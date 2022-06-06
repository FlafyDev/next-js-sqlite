import React, { useEffect } from "react";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Image from "next/image";
import { genSSP, PageProps } from "../lib/genSSP";
import GlobalRef from "../utils/globalRef";

const Home: React.FC<
  PageProps & { usersVisited: number; resetFrequencyMS: number }
> = (props) => {
  useEffect(
    () =>
      props.addBackground(
        `linear-gradient(135deg, rgb(163, 185, 255) 0%, rgba(29, 185, 181, 1) 41%, rgb(49, 147, 142) 100%)`
      ),
    []
  );

  return (
    <div>
      <div className={styles.topSection}>
        <div className={styles.title}>{"Mr. Chess"}</div>
        <div>
          {`${props.usersVisited} users visited in the last ${
            props.resetFrequencyMS / 1000 / 60
          } minutes.`}
        </div>
        <div className={styles.topButtonsContainer}>
          <TopButton text={"Articles"} important={true} link={"/articles"} />
          <TopButton
            text={"Play"}
            important={false}
            link={props.user ? "/game" : "/login"}
          />
        </div>
      </div>
    </div>
  );
};

const TopButton: React.FC<{
  text: string;
  link: string;
  important: boolean;
}> = (props) => {
  return (
    <Link href={props.link} passHref>
      <div>
        <button className={props.important ? styles.important : ""}>
          {props.text}
        </button>
      </div>
    </Link>
  );
};

class UsersVisited {
  constructor(
    public usersId: number[],
    public lastUpdated: number,
    public resetFrequencyMS: number
  ) {}
}

export const getServerSideProps = genSSP(async (context, user) => {
  const usersVisited = new GlobalRef<UsersVisited>("usersVisited");
  if (!usersVisited.value)
    usersVisited.value = new UsersVisited([], 0, 300_000);

  if (
    Date.now() >
    usersVisited.value.lastUpdated + usersVisited.value.resetFrequencyMS
  ) {
    usersVisited.value.usersId = [];
    usersVisited.value.lastUpdated = Date.now();
  }

  if (user && !usersVisited.value.usersId.includes(user.id)) {
    usersVisited.value.usersId.push(user.id);
  }

  return {
    usersVisited: usersVisited.value.usersId.length,
    resetFrequencyMS: usersVisited.value.resetFrequencyMS,
  };
});
export default Home;
