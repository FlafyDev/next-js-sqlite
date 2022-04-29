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
      <div className={[styles.menuItem, styles.menuWelcomeText].join(' ')}>
        {!logged.user || `Hello ${logged.user.username}!`}
      </div>
      <div className={styles.background}>
        
      </div>
    </div>
  );
};

const MenuItem: React.FC<{ text: string; link?: string; action?: Function }> = (
  props
) => {
  return props.link ? (
    <Link href={props.link} passHref>
      <div className={styles.menuItem}><p>{props.text}</p></div>
    </Link>
  ) : props.action ? (
    <div className={styles.menuItem} onClick={() => props.action!()}>
      <p>{props.text}</p>
    </div>
  ) : (
    <></>
  );
};

export { MenuItem };
export default Menu;
