import React, { useEffect, useState, useContext } from "react";
import { LoggedContext } from "../context/loggedContext";
import { OpenPopupContext } from "../components/Popup/context";
import "../styles/globals.css";
import Menu from "../components/Menu";
import styles from "../styles/App.module.css";
import useBackgroundTransitioner from "../hooks/useBackgroundTransitioner";
import Popup from "../components/Popup";
import { AppProps } from "next/app";
import User from "../models/user";
import { apiCurrentUser } from "../lib/apiCommunicator";

function MyApp({ Component, pageProps }: AppProps) {
  const [backgroundElement, addBackground] = useBackgroundTransitioner(
    `linear-gradient(#e66465, #9198e5)`
  );
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [popupChildren, setPopupChildren] = useState<React.ReactNode | null>(
    null
  );

  const requestCurrentUser = async () => {
    setCurrentUser(await apiCurrentUser());
  };

  // useEffect(() => {
  //   requestCurrentUser();
  //   const interval = setInterval(() => requestCurrentUser(), 10000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <>
        {backgroundElement}
        <LoggedContext.Provider
          value={{ user: currentUser, requestCurrentUser }}
        >
          <OpenPopupContext.Provider
            value={(children) => setPopupChildren(children)}
          >
            {!popupChildren || (
              <Popup
                onClose={() => {
                  setPopupChildren(null);
                }}
              >
                {popupChildren}
              </Popup>
            )}
            <Menu />
            <div
              style={{
                position: "relative",
                top: "61px",
                height: "Calc(100vh - 61px)",
              }}
            >
              <Component {...pageProps} addBackground={addBackground} />
            </div>
          </OpenPopupContext.Provider>
        </LoggedContext.Provider>
      </>
    </div>
  );
}

export default MyApp;
