import React, { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ErrorText from "../components/ErrorText";
import styles from "../styles/Login.module.css";
import StyledInput, { StyledInputConfig } from "../components/StyledInput";
import { faUser, faKey, faAt, faCake } from "@fortawesome/free-solid-svg-icons";
import ProgressBar from "../components/ProgressBar";
import { AddBackground } from "../hooks/useBackgroundTransitioner";
import { apiLogin, apiRegister } from "../lib/apiCommunicator";
import { genSSP, PageProps } from "../lib/genSSP";
import User, { Gender } from "../models/user";
import enumToStringArr from "../utils/enumToStringArr";
import validateUser, { ValidationResult } from "../lib/validateUser";

const Login: React.FC<{ addBackground: AddBackground }> = (props) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerStage, setRegisterStage] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const maxRegisterStages = 2; // zero-index

  useEffect(
    () =>
      props.addBackground(`
    linear-gradient(135deg, rgba(29, 66, 185, 1) 0%, rgba(29, 185, 181, 1) 41%, rgba(147, 49, 147, 1) 100%)
	`),
    []
  );

  const changeMode = () => {
    if (registerStage > 0) {
      setRegisterStage(registerStage - 1);
    } else {
      setError("");
      setIsRegistering(!isRegistering);
    }
  };

  const buttonOnClick = async () => {
    if (loading) return;

    if (isRegistering && registerStage < maxRegisterStages) {
      setRegisterStage(registerStage + 1);
      if (registerStage === 1) {
        let validationResult = await validateUser(
          new User(
            0,
            username,
            password,
            email,
            firstName,
            lastName,
            age,
            gender,
            0,
            false
          )
        );

        if (validationResult) {
          setError(validationResultToMessage(validationResult));
        } else {
          setLoading(true);

          validationResult = await apiRegister(
            username,
            password,
            email,
            firstName,
            lastName,
            age,
            gender
          );

          if (validationResult) {
            setError(validationResultToMessage(validationResult));
          } else {
            setError("");
          }
        }

        setRegisterStage(0);
        setLoading(false);
      }
    } else {
      setLoading(true);
      await login();
      setLoading(false);
    }
  };

  const login = async () => {
    const startTime = Date.now();
    const status = await apiLogin(username, password);
    const endTime = Date.now();
    const timeToWait = 500 - (endTime - startTime);

    if (timeToWait > 0) {
      await new Promise((resolve) => setTimeout(resolve, timeToWait));
    }

    switch (status) {
      case 403:
        setError("Wrong username or password");
        break;
      case 200:
        router.replace("/");
        break;
      default: {
        setError(`${status} error.`);
      }
    }
  };

  const validationResultToMessage = (result: ValidationResult) => {
    switch (result) {
      case ValidationResult.InvalidUsername:
        return "Username must contain 3-12 characters and only english letters and numbers.";
      case ValidationResult.InvalidPassword:
        return "Password must contain 8-32 characters.";
      case ValidationResult.InvalidEmail:
        return "Email must be valid.";
      case ValidationResult.InvalidFirstOrLastName:
        return "First and last names must be 2-32 english characters only.";
      case ValidationResult.BadAge:
        return "Age must be between 13 to 120.";
      case ValidationResult.TakenEmail:
        return "Email is already taken.";
      case ValidationResult.TakenUsername:
        return "Username is already taken.";
      case ValidationResult.None:
        return "";
      default:
        return ValidationResult[result];
    }
  };

  // const register = async () => {
  //   const dataError = validateData();
  //   if (dataError) {
  //     setError(dataError);
  //     return;
  //   }

  //   const startTime = new Date();
  //   const res = await fetch("api/Users/Register", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json charset=utf-8",
  //     },
  //     body: JSON.stringify({
  //       username: username,
  //       email: email,
  //       password: password,
  //       firstName: firstName,
  //       lastName: lastName,
  //       age: age,
  //       gender: gender,
  //     }),
  //   });
  //   const endTime = new Date();
  //   const timeToWait = 500 - (endTime - startTime);

  //   if (timeToWait > 0) {
  //     await new Promise((resolve) => setTimeout(resolve, timeToWait));
  //   }

  //   switch (res.status) {
  //     case 400: {
  //       setError(await res.text());
  //       break;
  //     }
  //     case 200: {
  //       setIsRegistering(false);
  //       setError(``);
  //       break;
  //     }
  //     default: {
  //       setError(`${res.status} error.`);
  //     }
  //   }
  // };

  return (
    <div className={[styles.container, !loading || styles.loading].join(" ")}>
      <div className={styles.panelContainer}>
        <div className={styles.miniTitle}>
          {isRegistering ? "Register an account" : "Login to your account"}
        </div>

        <ProgressBar visible={isRegistering} stage={registerStage} />

        {/* Register Stage 0 */}
        <StyledInput
          visible={registerStage === 0}
          config={new StyledInputConfig.Input("text", "Username", faUser)}
          state={[username, setUsername]}
        />

        <StyledInput
          visible={isRegistering && registerStage === 0}
          config={new StyledInputConfig.Input("text", "Email", faAt)}
          state={[email, setEmail]}
        />

        <StyledInput
          visible={registerStage === 0}
          config={new StyledInputConfig.Input("password", "Password", faKey)}
          state={[password, setPassword]}
        />

        {/* Register Stage 1 */}
        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
          <StyledInput
            visible={registerStage === 1}
            config={new StyledInputConfig.Input("text", "First Name", faUser)}
            state={[firstName, setFirstName]}
          />
          <div style={{ width: "50px" }}></div>
          <StyledInput
            visible={registerStage === 1}
            config={new StyledInputConfig.Input("text", "Last Name", faUser)}
            state={[lastName, setLastName]}
          />
        </div>

        <StyledInput
          visible={registerStage === 1}
          config={
            new StyledInputConfig.Input("number", "Age", faCake, {
              min: 0,
              max: 99,
              value: "",
            })
          }
          state={[age, setAge]}
        />

        <div hidden={!(registerStage === 1)} className={styles.genderContainer}>
          {enumToStringArr(Gender).map((genderName, i) => (
            <div
              className={styles.genderSelector}
              onClick={() => setGender(i)}
              key={i}
            >
              <input
                type="radio"
                checked={gender === i}
                onChange={() => {}}
              ></input>
              <label>{`${genderName}`}</label>
            </div>
          ))}
        </div>

        <div className={styles.bottomContainer}>
          <div className={styles.redirectContainer}>
            <a className={styles.redirect} onClick={changeMode}>
              {isRegistering
                ? registerStage !== 0
                  ? registerStage === maxRegisterStages
                    ? ""
                    : "Back"
                  : "Login instead"
                : "Register instead"}
            </a>
          </div>
          <div className={styles.loginContainer}>
            <button className={styles.login} onClick={buttonOnClick}>
              {isRegistering
                ? registerStage < maxRegisterStages - 1
                  ? "Next"
                  : "Register"
                : "Login"}
            </button>
          </div>
        </div>

        <ErrorText>{error}</ErrorText>
      </div>
    </div>
  );
};

export const getServerSideProps = genSSP();
export default Login;
