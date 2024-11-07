import {
  NotionCategory,
  NotionTag,
  PartialNotionBlog,
} from "@/types/notion.types";
import { Client } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { NotionToMarkdown } from "notion-to-md";
import { cache } from "react";

// Notionのファイル型を定義
type NotionFile = {
  name: string;
} & (
  | {
      type?: "file";
      file: { url: string; expiry_time?: string };
    }
  | {
      type?: "external";
      external: { url: string };
    }
);

// Notion のプロパティ型を定義
type NotionProperties = {
  Name: { title: Array<{ plain_text: string }> };
  Description: { rich_text: Array<{ plain_text: string }> };
  Slug: { rich_text: Array<{ plain_text: string }> };
  Date: { date: { start: string } | null };
  Tags: { multi_select: Array<NotionTag> };
  Categories: { multi_select: Array<NotionCategory> };
  Thumbnail: {
    files: Array<NotionFile>;
  };
  Published: { checkbox: boolean };
};

type GetBlogPostsParams = {
  limit?: number;
  startCursor?: string;
  getTotalCount?: boolean;
};

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

interface PageMetadata {
  id: string;
  title: string;
  description: string;
  slug: string;
  date: string;
  tags: Tag[];
  categories: Category[];
  thumbnail: string | null;
}

// サムネイル URL を取得する関数
const getThumbnailUrl = (thumbnail: NotionFile): string | null => {
  if ("file" in thumbnail) {
    return thumbnail.file.url;
  }
  if ("external" in thumbnail) {
    return thumbnail.external.url;
  }
  return null;
};

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// 公開済み記事の総数を取得する関数を修正
async function getPublishedPostCount(): Promise<number> {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      and: [
        {
          property: "Published",
          checkbox: {
            equals: true,
          },
        },
      ],
    },
    page_size: 100, // 最大100件ずつ取得
  });

  let totalCount = response.results.length;
  let nextCursor = response.next_cursor;

  // 100件以上ある場合は、次のページも取得
  while (nextCursor) {
    const nextResponse = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      start_cursor: nextCursor,
      filter: {
        and: [
          {
            property: "Published",
            checkbox: {
              equals: true,
            },
          },
        ],
      },
      page_size: 100,
    });

    totalCount += nextResponse.results.length;
    nextCursor = nextResponse.next_cursor;
  }

  return totalCount;
}

export const getFeaturedPost = async (): Promise<
  PartialNotionBlog | null | undefined
> => {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        property: "Published",
        checkbox: {
          equals: true, // 公開済みの記事のみを取得
        },
      },
      sorts: [
        {
          property: "Date", // Dateプロパティでソート
          direction: "descending",
        },
      ],
      page_size: 1,
    });

    if (response.results.length > 0) {
      const featuredPost = response.results[0] as PageObjectResponse;
      const properties = featuredPost.properties as unknown as NotionProperties;
      const thumbnailFile = properties.Thumbnail.files[0];

      return {
        id: featuredPost.id,
        title: properties.Name.title[0]?.plain_text || "",
        description: properties.Description.rich_text[0]?.plain_text || "",
        slug: properties.Slug.rich_text[0]?.plain_text || "",
        date: properties.Date?.date?.start || "",
        tags: properties.Tags.multi_select.map((tag) => ({
          id: tag.id,
          name: tag.name,
          color: tag.color,
        })),
        categories: properties.Categories.multi_select.map((category) => ({
          id: category.id,
          name: category.name,
          color: category.color,
        })),
        thumbnail: thumbnailFile ? getThumbnailUrl(thumbnailFile) : null,
      };
    }
  } catch (error) {
    console.error("Error fetching featured post:", error);
    return null;
  }
};

export const getBlogPosts = cache(
  async ({
    limit = 10,
    startCursor,
    getTotalCount = false,
  }: GetBlogPostsParams = {}): Promise<{
    contents: PartialNotionBlog[];
    totalCount?: number;
    nextCursor: string | null;
    hasMore: boolean;
  }> => {
    try {
      // フィーチャー記事を取得
      const featuredPost = await getFeaturedPost();
      const featuredPostSlug = featuredPost?.slug;

      // Notionクエリの設定
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const queryParams: any = {
        database_id: process.env.NOTION_DATABASE_ID!,
        page_size: limit,
        start_cursor: startCursor || undefined, // startCursorが指定されている場合はそこから取得
        sorts: [
          {
            property: "Date",
            direction: "descending",
          },
        ],
        filter: {
          and: [
            {
              property: "Published",
              checkbox: {
                equals: true, // 公開済みの記事のみを取得
              },
            },
            featuredPostSlug
              ? {
                  property: "Slug",
                  rich_text: {
                    does_not_equal: featuredPostSlug, // フィーチャー記事を除外
                  },
                }
              : undefined,
          ].filter(Boolean),
        }, // undefinedを除外
      };

      const response = await notion.databases.query(queryParams);

      const posts: PartialNotionBlog[] = response.results.map((page) => {
        const pageObj = page as PageObjectResponse;
        const properties = pageObj.properties as unknown as NotionProperties;
        const thumbnailFile = properties.Thumbnail.files[0];

        return {
          id: pageObj.id,
          title: properties.Name.title[0]?.plain_text || "",
          description: properties.Description.rich_text[0]?.plain_text || "",
          slug: properties.Slug.rich_text[0]?.plain_text || "",
          date: properties.Date?.date?.start || "",
          tags: properties.Tags.multi_select.map((tag) => ({
            id: tag.id,
            name: tag.name,
            color: tag.color,
          })),
          categories: properties.Categories.multi_select.map((category) => ({
            id: category.id,
            name: category.name,
            color: category.color,
          })),
          thumbnail: thumbnailFile ? getThumbnailUrl(thumbnailFile) : null,
        };
      });

      let totalCount = 0;
      if (getTotalCount) {
        totalCount = await getPublishedPostCount();
      }

      return {
        contents: posts,
        totalCount, // フィーチャー記事を除いた総数
        nextCursor: response.next_cursor,
        hasMore: response.has_more,
      };
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      return {
        contents: [],
        totalCount: 0,
        nextCursor: null,
        hasMore: false,
      };
    }
  }
);

//詳細記事取得
export const getDetailPost = async (slug: string) => {
  try {
    const [pageResponse] = await Promise.all([
      notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID!,
        filter: {
          property: "Slug",
          formula: {
            string: {
              equals: slug,
            },
          },
        },
        page_size: 1,
      }),
      notion.databases.retrieve({
        database_id: process.env.NOTION_DATABASE_ID!,
      }),
    ]);

    if (!pageResponse.results[0]) {
      throw new Error("Post not found");
    }

    const page = pageResponse.results[0] as PageObjectResponse;
    const metadata = getPageMetaData(page);

    const n2m = new NotionToMarkdown({ notionClient: notion });
    const mdBlocks = await n2m.pageToMarkdown(page.id, 2);
    const mdString = n2m.toMarkdownString(mdBlocks);

    return {
      metadata,
      markdown: mdString.parent,
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};

export const getPostsByTag = cache(
  async ({
    tagName,
    limit = 10,
    startCursor,
    getTotalCount = false,
    skipFirst = false,
  }: {
    tagName: string;
    limit?: number;
    startCursor?: string;
    getTotalCount?: boolean;
    skipFirst?: boolean;
  }) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const queryParams: any = {
        database_id: process.env.NOTION_DATABASE_ID!,
        page_size: limit,
        start_cursor: startCursor || undefined,
        sorts: [
          {
            property: "Date",
            direction: "descending",
          },
        ],
        filter: {
          and: [
            {
              property: "Published",
              checkbox: {
                equals: true,
              },
            },
            {
              or: [
                {
                  property: "Tags",
                  multi_select: {
                    contains: tagName, // オリジナルのタグ名
                  },
                },
                {
                  property: "Tags",
                  multi_select: {
                    contains: tagName.toLowerCase(), // 小文字のタグ名
                  },
                },
                {
                  property: "Tags",
                  multi_select: {
                    contains:
                      tagName.charAt(0).toUpperCase() + tagName.slice(1), // 先頭大文字のタグ名
                  },
                },
              ],
            },
          ],
        },
      };

      const response = await notion.databases.query(queryParams);

      let posts: PartialNotionBlog[] = response.results.map((page) => {
        const pageObj = page as PageObjectResponse;
        const properties = pageObj.properties as unknown as NotionProperties;
        const thumbnailFile = properties.Thumbnail.files[0];

        return {
          id: pageObj.id,
          title: properties.Name.title[0]?.plain_text || "",
          description: properties.Description.rich_text[0]?.plain_text || "",
          slug: properties.Slug.rich_text[0]?.plain_text || "",
          date: properties.Date?.date?.start || "",
          tags: properties.Tags.multi_select.map((tag) => ({
            id: tag.id,
            name: tag.name,
            color: tag.color,
          })),
          categories: properties.Categories.multi_select.map((category) => ({
            id: category.id,
            name: category.name,
            color: category.color,
          })),
          thumbnail: thumbnailFile ? getThumbnailUrl(thumbnailFile) : null,
        };
      });

      // skipFirstがtrueの場合、最初の記事をスキップ
      if (skipFirst && posts.length > 0) {
        posts = posts.slice(1);
      }

      let totalCount = 0;
      if (getTotalCount) {
        // タグに関連する公開済み記事の総数を取得
        const countResponse = await notion.databases.query({
          database_id: process.env.NOTION_DATABASE_ID!,
          filter: {
            and: [
              {
                property: "Published",
                checkbox: {
                  equals: true,
                },
              },
              {
                property: "Tags",
                multi_select: {
                  contains: tagName,
                },
              },
            ],
          },
        });
        totalCount = countResponse.results.length;
      }

      return {
        contents: posts,
        totalCount,
        nextCursor: response.next_cursor,
        hasMore: response.has_more,
      };
    } catch (error) {
      console.error("Error fetching posts by tag:", error);
      return {
        contents: [],
        totalCount: 0,
        nextCursor: null,
        hasMore: false,
      };
    }
  }
);

export const getAllTags = async (): Promise<Tag[]> => {
  try {
    const response = await notion.databases.retrieve({
      database_id: process.env.NOTION_DATABASE_ID!,
    });

    if (response.properties.Tags.type === "multi_select") {
      return response.properties.Tags.multi_select.options.map((tag) => ({
        id: tag.id,
        name: tag.name,
        color: tag.color,
      }));
    }
    return [];
  } catch (error) {
    console.error("タグの取得中にエラーが発生しました:", error);
    return [];
  }
};

export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const response = await notion.databases.retrieve({
      database_id: process.env.NOTION_DATABASE_ID!,
    });

    if (response.properties.Categories.type === "multi_select") {
      return response.properties.Categories.multi_select.options.map(
        (category) => ({
          id: category.id,
          name: category.name,
          color: category.color,
        })
      );
    }
    return [];
  } catch (error) {
    console.error("カテゴリーの取得中にエラーが発生しました:", error);
    return [];
  }
};

export const getPostsByCategory = cache(
  async ({
    categoryName,
    limit = 10,
    startCursor,
    getTotalCount = false,
    skipFirst = false,
  }: {
    categoryName: string;
    limit?: number;
    startCursor?: string;
    getTotalCount?: boolean;
    skipFirst?: boolean;
  }) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const queryParams: any = {
        database_id: process.env.NOTION_DATABASE_ID!,
        page_size: limit,
        start_cursor: startCursor || undefined,
        sorts: [
          {
            property: "Date",
            direction: "descending",
          },
        ],
        filter: {
          and: [
            {
              property: "Published",
              checkbox: {
                equals: true,
              },
            },
            {
              or: [
                {
                  property: "Categories",
                  multi_select: {
                    contains: categoryName, // オリジナルのカテゴリー名
                  },
                },
                {
                  property: "Categories",
                  multi_select: {
                    contains: categoryName.toLowerCase(), // 小文字のカテゴリー名
                  },
                },
                {
                  property: "Categories",
                  multi_select: {
                    contains:
                      categoryName.charAt(0).toUpperCase() +
                      categoryName.slice(1), // 先頭大文字のカテゴリー名
                  },
                },
              ],
            },
          ],
        },
      };

      const response = await notion.databases.query(queryParams);

      let posts: PartialNotionBlog[] = response.results.map((page) => {
        const pageObj = page as PageObjectResponse;
        const properties = pageObj.properties as unknown as NotionProperties;
        const thumbnailFile = properties.Thumbnail.files[0];

        return {
          id: pageObj.id,
          title: properties.Name.title[0]?.plain_text || "",
          description: properties.Description.rich_text[0]?.plain_text || "",
          slug: properties.Slug.rich_text[0]?.plain_text || "",
          date: properties.Date?.date?.start || "",
          tags: properties.Tags.multi_select.map((tag) => ({
            id: tag.id,
            name: tag.name,
            color: tag.color,
          })),
          categories: properties.Categories.multi_select.map((category) => ({
            id: category.id,
            name: category.name,
            color: category.color,
          })),
          thumbnail: thumbnailFile ? getThumbnailUrl(thumbnailFile) : null,
        };
      });

      // skipFirstがtrueの場合、最初の記事をスキップ
      if (skipFirst && posts.length > 0) {
        posts = posts.slice(1);
      }

      let totalCount = 0;
      if (getTotalCount) {
        // カテゴリーに関連する公開済み記事の総数を取得
        const countResponse = await notion.databases.query({
          database_id: process.env.NOTION_DATABASE_ID!,
          filter: {
            and: [
              {
                property: "Published",
                checkbox: {
                  equals: true,
                },
              },
              {
                property: "Categories",
                multi_select: {
                  contains: categoryName,
                },
              },
            ],
          },
        });
        totalCount = countResponse.results.length;
      }

      return {
        contents: posts,
        totalCount,
        nextCursor: response.next_cursor,
        hasMore: response.has_more,
      };
    } catch (error) {
      console.error("Error fetching posts by category:", error);
      return {
        contents: [],
        totalCount: 0,
        nextCursor: null,
        hasMore: false,
      };
    }
  }
);

function getPageMetaData(page: PageObjectResponse): PageMetadata {
  const properties = page.properties;
  const thumbnailFile =
    properties.Thumbnail.type === "files" && properties.Thumbnail.files[0]
      ? properties.Thumbnail.files[0]
      : null;

  return {
    id: page.id,
    title:
      properties.Name.type === "title"
        ? properties.Name.title[0]?.plain_text || ""
        : "",
    description:
      properties.Description.type === "rich_text"
        ? properties.Description.rich_text[0]?.plain_text || ""
        : "",
    slug:
      properties.Slug.type === "rich_text"
        ? properties.Slug.rich_text[0]?.plain_text || ""
        : "",
    date:
      properties.Date.type === "date" ? properties.Date.date?.start || "" : "",
    tags:
      properties.Tags.type === "multi_select"
        ? properties.Tags.multi_select.map((tag) => ({
            id: tag.id,
            name: tag.name,
            color: tag.color,
          }))
        : [],
    categories:
      properties.Categories.type === "multi_select"
        ? properties.Categories.multi_select.map((category) => ({
            id: category.id,
            name: category.name,
            color: category.color,
          }))
        : [],
    thumbnail: thumbnailFile ? getThumbnailUrl(thumbnailFile) : null,
  };
}
