import React from 'react';
import styles from './ErrorText.module.css';

const ErrorText = (props) => {
  return (
    <div className={styles.errorText}>
      {props.children}
    </div>
  )
}

export default ErrorText;