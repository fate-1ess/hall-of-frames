import { notFound } from "next/navigation";

import articles from "@/articles";
import { findArticleBySlug, generateSlug } from "@/utils";
import ArticleDetailClient from "./ArticleDetailClient";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: generateSlug(article.title) }));
}

export const dynamicParams = false;

const ArticleDetailPage = ({ params }) => {
  const slug = params?.slug;
  const article = findArticleBySlug(articles, slug);

  if (!article) {
    notFound();
  }

  return <ArticleDetailClient article={article} />;
};

export default ArticleDetailPage;
