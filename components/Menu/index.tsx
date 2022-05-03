import React, { useEffect, useState, useContext } from "react";
import styles from "./Menu.module.css";
import Link from "next/link";
import User from "../../models/user";
import { apiLogout } from "../../lib/apiCommunicator";
import { useRouter } from "next/router";

const Menu: React.FC<{ user: User }> = (props) => {
  const router = useRouter();

  const logout = async () => {
    if ((await apiLogout()) === 200) {
      router.replace(router.asPath);
      router.push("/");
    }
  };

  return (
    <div className={styles.menu}>
      <MenuItem text={"Home"} link={"/"} />
      {props.user ? (
        <>
          <MenuItem text={"Logout"} action={logout} />
        </>
      ) : (
        <MenuItem text={"Login"} link={"/login"} />
      )}
      <MenuItem text={"Articles"} link={"/articles"} />
      {!props.user?.isAdmin || (
        <MenuItem text={"User Manager"} link={"/userManager"} />
      )}
      <div className={[styles.menuItem, styles.menuWelcomeText].join(" ")}>
        {!props.user || `Hello ${props.user.firstName} ${props.user.lastName}!`}
      </div>
      <div className={styles.background}></div>
    </div>
  );
};

const MenuItem: React.FC<{ text: string; link?: string; action?: Function }> = (
  props
) => {
  return props.link ? (
    <Link href={props.link} passHref>
      <div className={styles.menuItem}>
        <p>{props.text}</p>
      </div>
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
