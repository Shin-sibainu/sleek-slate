import { about } from "@/config/about";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
};

const About = () => {
  return (
    <div className="my-10 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="w-1/4">
          <Image
            src={"/assets/shincode_icon.png"}
            alt="shincode-icon"
            width={140}
            height={140}
          />
        </div>

        <div className="w-3/4 space-y-10">
          <h3 className="font-bold md:text-3xl">{about.greeting}</h3>

          <div className="text-gray-600">{about.description}</div>

          <div className="text-gray-600">
            開発実績は以下です。
            <div className="mt-1">
              <li>コーポレートサイト作成(Next.js / MicroCMS)</li>
              <li>Notionで簡単ブログ作成アプリ(Next.js / Supabase / Notion)</li>
              <li>本ブログ(Next.js / TailwindCSS / MicroCMS)</li>
            </div>
          </div>

          <div className="text-gray-600">
            講師として教えてきたコンテンツの数は300を超えておりますので、その中で培ってきた技術力で、御社の開発のお手伝いをさせていただきます。
            まだ開発実績の数が少ない段階ですので、予算を抑えた上で開発をお任せいただければと思っている所存です。
          </div>

          <div className="text-gray-600">
            開発以外にも無料でご相談やお悩み事も承っております。下のボタンからコンタクトフォームからご連絡お願いいたします。
          </div>

          <div>
            <Link
              href={"/contact"}
              className="bg-teal-600 px-4 py-2 rounded-lg hover:bg-teal-700 duration-300"
            >
              <span className="inline text-white">Contact Me</span>
            </Link>
          </div>
        </div>
      </div>

      <section></section>
    </div>
  );
};

export default About;
