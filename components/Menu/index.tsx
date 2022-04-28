import React, { useEffect, useState, useContext } from "react";
import styles from "./Menu.module.css";
import Link from "next/link";
import { LoggedContext } from "../../context/loggedContext";

const Menu: React.FC = (props) => {
  const logged = useContext(LoggedContext);

  const logout = async () => {
    await fetch("api/Users/Logout");
    logged.requestCurrentUser();
  };

  return (
    <div className={styles.menu}>
      <MenuItem text={"Home"} link={"/"} />
      {logged.user ? (
        <MenuItem text={"Logout"} action={logout} />
      ) : (
        <MenuItem text={"Login"} link={"/login"} />
      )}
      {!logged.user?.isAdmin || (
        <MenuItem text={"User Manager"} link={"/userManager"} />
      )}
      <div className={styles.menuText}>
        {!logged.user || `Hello ${logged.user.username}!`}
      </div>
    </div>
  );
};

const MenuItem: React.FC<{ text: string; link?: string; action?: Function }> = (
  props
) => {
  return props.link ? (
    <Link href={props.link} passHref>
      <div className={styles.menuItem}>{props.text}</div>
    </Link>
  ) : props.action ? (
    <div className={styles.menuItem} onClick={() => props.action!()}>
      {props.text}
    </div>
  ) : (
    <></>
  );
};

export { MenuItem };
export default Menu;
