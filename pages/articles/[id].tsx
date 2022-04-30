import styles from "../../styles/ArticlePage.module.css";
import { getArticles } from "../../lib/db";
import Article from "../../models/article";
import { genSSP, PageProps } from "../../lib/genSSP";
import moment from "moment";
import StyledButton from "../../components/StyledButton";
import { useEffect, useState } from "react";
import { apiLikeArticle } from "../../lib/apiCommunicator";
import { useRouter } from "next/router";

const ArticlePage: React.FC<PageProps & { article?: Article }> = (props) => {
  useEffect(
    () =>
      props.addBackground(
        `linear-gradient(150deg, rgba(238,163,255,1) 0%, rgba(29,149,185,1) 80%, rgba(147,149,144,1) 100%)`
      ),
    []
  );

  const likedBy = props.article
    ? (JSON.parse(props.article.likedBy) as number[])
    : [];

  const [liked, setLiked] = useState(likedBy.includes(props.user?.id) ?? false);
  const [likes, setLikes] = useState(likedBy.length);
  const router = useRouter();

  if (!props.article) {
    return <div>{"404 - Article not found."}</div>;
  }

  const like = async () => {
    if (!props.user) {
      router.push("/login");
      return;
    }

    const res = await apiLikeArticle(props.article!.id, !liked);
    if (res !== null) {
      setLiked(res.liked);
      setLikes(res.likes);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>{props.article.title}</div>
      <div className={styles.date}>
        {moment(props.article.lastUpdated).calendar()}
        <StyledButton
          onClick={like}
          enabled={liked}
          style={{
            margin: "0 10px",
          }}
        >{`${likes} Likes`}</StyledButton>
      </div>
      <br />
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: props.article.content }}
      ></div>
    </div>
  );
};

export const getServerSideProps = genSSP(async (context, user) => {
  const article =
    (await getArticles().where("id", context.query.id).first()) ?? null;

  // Hide users (except the user who requested the page) who liked the article from not administrators.
  if (article && !user?.isAdmin) {
    article.likedBy = JSON.stringify(
      (JSON.parse(article?.likedBy) as number[]).map((id) =>
        id === user?.id ? id : -1
      )
    );
  }

  return {
    article,
  };
});

export default ArticlePage;
