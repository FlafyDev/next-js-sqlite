import React, { useEffect } from "react";
import Article from "../../models/article";
import { getArticles } from "../../lib/db";
import ArticleBox from "../../components/ArticleBox";
import { genSSP, PageProps } from "../../lib/genSSP";
import StyledButton from "../../components/StyledButton";
import styles from "../../styles/Articles.module.css";
import { useRouter } from "next/router";

const Articles: React.FC<PageProps & { articles: Article[] }> = (props) => {
  useEffect(
    () =>
      props.addBackground(
        `linear-gradient(90deg, rgba(238,163,255,1) 0%, rgba(29,149,185,1) 50%, rgba(147,49,144,1) 100%)`
      ),
    []
  );

  const router = useRouter();

  return (
    <div className={styles.container}>
      {props.user?.isAdmin ? (
        <StyledButton
          style={{
            marginTop: 10,
            marginLeft: 20,
          }}
          onClick={() => {
            router.push("/articles/create");
          }}
        >
          {"Create an article"}
        </StyledButton>
      ) : null}

      <div className={styles.articleBoxesContainer}>
        {props.articles
          .map((article) => <ArticleBox article={article} key={article.id} />)
          .reverse()}
      </div>
    </div>
  );
};

export const getServerSideProps = genSSP(async (_) => ({
  articles: await getArticles(),
}));
export default Articles;
