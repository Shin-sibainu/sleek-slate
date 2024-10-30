export type NotionTag = {
  id: string;
  name: string;
  color: string;
};

export type NotionCategory = {
  id: string;
  name: string;
  color: string;
};

export type NotionBlog = {
  id: string;
  title: string;
  description: string;
  slug: string;
  content?: string; // オプショナルに変更
  thumbnail: string | null;
  tags: NotionTag[];
  categories: NotionCategory[];
  date: string; // ISO 8601形式の日付文字列
  published: boolean;
};

// BlogCardで使用する部分的なNotionBlog型
export type PartialNotionBlog = Pick<
  NotionBlog,
  | "id"
  | "title"
  | "description"
  | "slug"
  | "thumbnail"
  | "tags"
  | "categories"
  | "date"
>;
