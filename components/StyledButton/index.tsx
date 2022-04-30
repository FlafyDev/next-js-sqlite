import React from "react";
import styles from "./StyledButton.module.css";

const StyledButton: React.FC<{
  children?: React.ReactNode;
  enabled?: boolean;
  onClick: () => void;
  style?: React.CSSProperties;
}> = (props) => {
  return (
    <button
      style={props.style}
      className={[styles.btn, props.enabled ? styles.enabled : ""].join(" ")}
      onClick={() => props.onClick()}
    >
      {props.children}
    </button>
  );
};

export default StyledButton;
