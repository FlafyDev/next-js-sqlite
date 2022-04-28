import React from "react";
import styles from "./ProgressBar.module.css";

const ProgressBar: React.FC<{ visible: boolean; stage: number }> = (props) => {
  return (
    <div hidden={!props.visible} className={styles.progressBarContainer}>
      {new Array(props.stage).fill(null).map((_, i) => (
        <div className={styles.progressBarPart} key={i}></div>
      ))}
    </div>
  );
};

export default ProgressBar;
