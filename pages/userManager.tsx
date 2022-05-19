import React, { useEffect, useState, useContext } from "react";
import styles from "../styles/UserManager.module.css";
import Link from "next/link";
import UserCard from "../components/UserCard";
// import UserFilter from '../components/UserFilter';
import ErrorText from "../components/ErrorText";
import StyledInput, { StyledInputConfig } from "../components/StyledInput";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { genSSP, PageProps } from "../lib/genSSP";
import { getUsers } from "../lib/db";
import User from "../models/user";

const UserManager: React.FC<PageProps & { users: User[] }> = (props) => {
  useEffect(
    () =>
      props.addBackground(`
    linear-gradient(135deg, rgb(163, 255, 220) 0%, rgba(29, 185, 181, 1) 41%, rgb(219, 129, 215) 100%)
	`),
    []
  );

  const [filteredUsersIndex, setFilteredUsersIndex] = useState<number[]>([]);
  // const [users, setUsers] = useState([]);
  // const [error, setError] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // useEffect(() => {
  // 	if (logged.info.isAdmin) {
  // 		const res = await fetch('api/Users/GetUsers');

  // 		switch (res.status) {
  // 			case 200: {
  // 				setUsers(await res.json());
  // 				setError(``);
  // 				break;
  // 			}
  // 			case 401: {
  // 				setError(`You're Unauthorized to view this page`);
  // 				setUsers([]);
  // 				break;
  // 			}
  // 			default: {
  // 				setError(`${res.status} error`);
  // 				setUsers([]);
  // 			}
  // 		}
  // 	} else {
  // 		setError(`You're Unauthorized to view this page`);
  // 		setUsers([]);
  // 	}
  // }, [logged]);

  useEffect(() => {
    setFilteredUsersIndex(
      props.users
        .map((_, i) => i)
        .filter((userIndex) => {
          const user = props.users[userIndex];
          return Object.values(user).some((value) => {
            return value
              .toString()
              .toLowerCase()
              .includes(searchQuery.toLowerCase());
          });
        })
    );
  }, [searchQuery]);

  return (
    <div className={styles.container}>
      {/* <ErrorText>{error}</ErrorText> */}
      <div className={styles.viewContainer}>
        <div className={styles.searchContainer}>
          <StyledInput
            config={new StyledInputConfig.Input("text", "Username")}
            state={[searchQuery, setSearchQuery]}
          />
        </div>
        <div className={styles.cardsContainer}>
          {props.users.map((user, i) => {
            return user ? (
              <UserCard
                canDelete={user.id !== props.user?.id}
                user={user}
                key={i}
                // visible={filteredUsersIndex.includes(i)}
              />
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = genSSP(async (_) => ({
  users: await getUsers(),
}));
export default UserManager;
