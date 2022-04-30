import React from "react";
import styles from "./StyledInput.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export namespace StyledInputConfig {
  export abstract class Config {}

  export class Input implements Config {
    constructor(
      public inputType: React.HTMLInputTypeAttribute,
      public placeholder: string,
      public icon?: any,
      public props?: React.InputHTMLAttributes<HTMLInputElement>
    ) {}
  }

  export class TextArea implements Config {
    constructor(
      public placeholder: string,
      public props?: React.TextareaHTMLAttributes<HTMLTextAreaElement>
    ) {}
  }
}

const StyledInput: React.FC<{
  visible?: boolean;
  state: [any, (newValue: any) => void];
  config: StyledInputConfig.Config;
  style?: React.CSSProperties;
}> = (props) => {
  return (
    <div
      style={props.style}
      hidden={props.visible !== undefined && !props.visible}
      className={styles.container}
    >
      {props.config instanceof StyledInputConfig.TextArea ? (
        <textarea
          className={styles.input}
          placeholder={props.config.placeholder}
          onChange={(e) => {
            props.state[1](e.target.value);
          }}
          {...props.config.props}
          value={props.state[0]}
        ></textarea>
      ) : props.config instanceof StyledInputConfig.Input ? (
        <>
          <input
            className={[
              styles.input,
              props.config.icon ? styles.withIcon : "",
            ].join(" ")}
            type={props.config.inputType}
            placeholder={props.config.placeholder}
            {...(props.config.props || {})}
            {...(props.state
              ? {
                  value: props.state[0],
                  onChange: (e) =>
                    props.state[1](
                      (props.config as StyledInputConfig.Input).inputType ===
                        "number"
                        ? parseInt(e.target.value)
                        : e.target.value
                    ),
                }
              : {})}
          />

          {props.config.icon ? (
            <div className={styles.svgContainer}>
              <FontAwesomeIcon icon={props.config.icon} />
            </div>
          ) : null}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default StyledInput;
