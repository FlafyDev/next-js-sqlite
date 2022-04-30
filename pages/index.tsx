﻿import React, { useEffect } from "react";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Image from "next/image";
import { AddBackground } from "../hooks/useBackgroundTransitioner";
import User from "../models/user";
import { genSSP, PageProps } from "../lib/genSSP";

const Home: React.FC<{ addBackground: AddBackground; user: User }> = (
  props
) => {
  useEffect(
    () =>
      props.addBackground(
        `linear-gradient(135deg, rgb(163, 185, 255) 0%, rgba(29, 185, 181, 1) 41%, rgb(49, 147, 142) 100%)`
      ),
    []
  );

  console.log(props.user);

  return (
    <div>
      <div className={styles.topSection}>
        <div className={styles.imgTitleContainer}>
          <Image alt="title" src={"/WIP.png"} width={601} height={211} />
        </div>
        <div className={styles.topButtonsContainer}>
          <TopButton text={"Learn"} important={true} link={"/learn"} />
          <TopButton text={"News"} important={false} link={"/news"} />
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

export const getServerSideProps = genSSP();
export default Home;
