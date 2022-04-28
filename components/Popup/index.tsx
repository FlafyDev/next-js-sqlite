import React from "react";
import styles from "./Popup.module.css";

const Popup: React.FC<{ onClose: Function; children?: React.ReactNode }> = (
  props
) => {
  return (
    <div className={styles.container} onClick={() => props.onClose()}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        {props.children}
      </div>
    </div>
  );
};

export default Popup;
