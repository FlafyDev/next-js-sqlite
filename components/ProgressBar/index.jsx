import React from 'react'
import styles from './ProgressBar.module.css'


const ProgressBar = (props) => {
  return (
    <div hidden={!props.visible}
      className={styles.progressBarContainer}>
      {
        Array.from({ length: props.stage + 1 }, (i) => {
          return (
            <div className={styles.progressBarPart} key={i}></div>
          );
        })
      }
    </div>
  );
}

export default ProgressBar