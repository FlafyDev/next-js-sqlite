import styles from "./ArticleBox.module.css";
import Article from "../../models/article";
import React from "react";
import moment from "moment";

const ArticleBox: React.FC<{ article: Article }> = (props) => {
  return (
    <div>
      <div>{props.article.title}</div>
      <div>{moment(props.article.lastUpdated).calendar()}</div>
      <div dangerouslySetInnerHTML={{ __html: props.article.content }}></div>
    </div>
  );
};

export default ArticleBox;
