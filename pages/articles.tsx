import React, { useEffect } from "react";
import Article from "../models/article";
import { getArticles } from "../lib/db";
import ArticleBox from "../components/ArticleBox";
import { genSSP, PageProps } from "../lib/genSSP";

const Articles: React.FC<PageProps & { articles: Article[] }> = (props) => {
  useEffect(
    () =>
      props.addBackground(
        `linear-gradient(135deg, rgb(163, 185, 255) 0%, rgba(29, 185, 181, 1) 41%, rgb(49, 147, 142) 100%)`
      ),
    []
  );

  return (
    <div>
      <ArticleBox article={props.articles[0]}></ArticleBox>
    </div>
  );
};

export const getServerSideProps = genSSP(async (_) => ({
  articles: await getArticles(),
}));
export default Articles;
