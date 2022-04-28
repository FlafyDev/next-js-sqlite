import React from "react";
import styles from "./StyledInput.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const StyledInput: React.FC<{
  visible: boolean;
  placeholder: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  type: React.HTMLInputTypeAttribute;
  state: [any, (newValue: any) => void];
  icon: any;
}> = (props) => {
  return (
    <div hidden={!props.visible} className={styles.container}>
      <input
        className={styles.input}
        type={props.type}
        placeholder={props.placeholder}
        {...(props.inputProps || {})}
        {...(props.state
          ? {
              value: props.state[0],
              onChange: (e) =>
                props.state[1](
                  props.type === "number"
                    ? parseInt(e.target.value)
                    : e.target.value
                ),
            }
          : {})}
      />
      <div className={styles.svgContainer}>
        <FontAwesomeIcon icon={props.icon} />
      </div>
    </div>
  );
};

export default StyledInput;
