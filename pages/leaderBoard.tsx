import { useEffect } from "react";
import Table from "../components/Table";
import { getUsers } from "../lib/db";
import { genSSP, PageProps } from "../lib/genSSP";
import LeaderBoardEntry from "../models/leaderBoardEntry";
import styles from "../styles/LeaderBoard.module.css";

const LeaderBoardPage: React.FC<
  PageProps & { leaderBoard: LeaderBoardEntry[] }
> = (props) => {
  useEffect(
    () =>
      props.addBackground(
        `linear-gradient(150deg, rgba(238,163,255,1) 0%, rgba(29,149,185,1) 80%, rgba(147,149,144,1) 100%)`
      ),
    []
  );

  return (
    <div className={styles.container}>
      <div className={styles.text}>
        {"Top 10 users with the least switches in the Chess game."}
      </div>
      <Table
        columnNames={["Name", "# of switches"]}
        rowsData={props.leaderBoard.map((leaderBoard) => [
          leaderBoard.name,
          leaderBoard.score.toString(),
        ])}
      />
    </div>
  );
};

export const getServerSideProps = genSSP(async (context, user) => {
  const users = await getUsers();
  const leaderBoard: LeaderBoardEntry[] = users
    .filter((user) => user.leastSwitches > 0)
    .map(
      (user) =>
        new LeaderBoardEntry(
          `${user.firstName} ${user.lastName}`,
          user.leastSwitches
        )
    );

  leaderBoard.sort((a, b) => a.score - b.score);
  leaderBoard.splice(5);

  return {
    leaderBoard: JSON.parse(JSON.stringify(leaderBoard)),
  };
});

export default LeaderBoardPage;
