import React, { useEffect, useState } from "react";
import { genSSP, PageProps } from "../../lib/genSSP";
import styles from "../../styles/CreateArticle.module.css";
import stylesLogin from "../../styles/Login.module.css";
import StyledInput, { StyledInputConfig } from "../../components/StyledInput";
import StyledButton from "../../components/StyledButton";
import { apiAddArticle } from "../../lib/apiCommunicator";
import ErrorText from "../../components/ErrorText";
import { useRouter } from "next/router";

const CreateArticle: React.FC<PageProps> = (props) => {
  useEffect(
    () =>
      props.addBackground(
        `linear-gradient(90deg, rgba(238,163,255,1) 0%, rgba(29,149,185,1) 50%, rgba(238,163,255,1) 105%)`
      ),
    []
  );

  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const createArticle = async () => {
    const status = await apiAddArticle(title, content);
    if (status !== 200) {
      setError(`Couldn't create article. (returned ${status})`);
      return;
    }

    router.push(`/articles/`);
  };

  return (
    <div className={styles.container}>
      <div className={stylesLogin.miniTitle}>{"Create a new article"}</div>
      <div className={styles.formBox}>
        <StyledInput
          state={[title, setTitle]}
          config={new StyledInputConfig.Input("text", "Title")}
        />
        <StyledInput
          config={
            new StyledInputConfig.TextArea("Content", {
              rows: 10,
            })
          }
          state={[content, setContent]}
          style={{
            height: "auto",
          }}
        />
        <StyledButton
          style={{
            width: "100%",
            height: "32px",
          }}
          onClick={createArticle}
        >
          Submit
        </StyledButton>
      </div>
      <ErrorText>{error}</ErrorText>
    </div>
  );
};

export const getServerSideProps = genSSP();
export default CreateArticle;
