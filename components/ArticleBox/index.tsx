import styles from "./ArticleBox.module.css";
import Article from "../../models/article";
import React, { useState } from "react";
import moment from "moment";
import Link from "next/link";

const ArticleBox: React.FC<{ article: Article }> = (props) => {
  return (
    <Link href={`/articles/${props.article.id}`} passHref>
      <div className={styles.container}>
        <div className={styles.title}>{props.article.title}</div>
        <div className={styles.date}>
          {moment(props.article.lastUpdated).calendar()}
        </div>
        <br />
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: props.article.content }}
        ></div>
      </div>
    </Link>
  );
};

export default ArticleBox;
