import React, { useState } from "react";
import { OpenPopupContext } from "../components/Popup/context";
import "../styles/globals.css";
import Menu from "../components/Menu";
import useBackgroundTransitioner from "../hooks/useBackgroundTransitioner";
import Popup from "../components/Popup";
import { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  const [backgroundElement, addBackground] = useBackgroundTransitioner(
    `linear-gradient(#e66465, #9198e5)`
  );
  const [popupChildren, setPopupChildren] = useState<React.ReactNode | null>(
    null
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <>
        {backgroundElement}

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
          <Menu user={pageProps.user} />
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
      </>
    </div>
  );
}

export default MyApp;
