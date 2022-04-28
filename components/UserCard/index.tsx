import React, { useEffect, useState, useContext } from "react";
import styles from "./UserCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import Popup from "../Popup";
import { OpenPopupContext } from "../Popup/context";
import User from "../../models/user";

const UserCard: React.FC<{
  user: User;
  canDelete: boolean;
  visible: boolean;
}> = (props) => {
  const [user, setUser] = useState(props.user);
  const openPopup = useContext(OpenPopupContext);

  // useEffect(async () => {
  //   await fetch("api/Users/UpdateUser", {
  //     method: 'POST',
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(user),
  //   });
  // }, [user]);

  const deleteUser = async () => {
    openPopup("");
    // setUser({});
    await fetch("api/Users/DeleteUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
  };

  return (
    <div>
      <div className={styles.container} hidden={!props.visible}>
        <div className={styles.gridContainer}>
          <Field displayName={"Email"} state={[user, setUser]} />
          <Field displayName={"Username"} state={[user, setUser]} />
          <Field displayName={"Password"} state={[user, setUser]} />
          <Field displayName={"First Name"} state={[user, setUser]} />
          <Field displayName={"Last Name"} state={[user, setUser]} />
          <Field displayName={"Age"} state={[user, setUser]} type={"number"} />
          <Field
            displayName={"Gender"}
            state={[user, setUser]}
            type={"number"}
          />
          <Field
            displayName={"Boxing Points"}
            state={[user, setUser]}
            type={"number"}
          />
          <Field
            displayName={"Admin"}
            state={[user, setUser]}
            type={"checkbox"}
          />
        </div>
        {props.canDelete ? (
          <div
            className={styles.deleteButton}
            onClick={() =>
              openPopup(
                <div className={styles.popupContainer}>
                  <div className={styles.popupTitle}>
                    {`Are you sure you want to remove "${user.username}"?`}
                  </div>
                  <button
                    className={styles.sureDeleteButton}
                    onClick={deleteUser}
                  >
                    {"Delete"}
                  </button>
                </div>
              )
            }
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

const Field: React.FC<{
  displayName: string;
  type?: string;
  state: [any, (newValue: any) => void];
}> = (props) => {
  const name = props.displayName.replaceAll(" ", "");
  return (
    <div className={styles.field}>
      <div className={styles.name}>{props.displayName}</div>
      <input
        type={props.type}
        value={props.state[0][name]}
        checked={props.state[0][name]}
        className={styles.value}
        onChange={(e) => {
          let newValue: any;
          switch (props.type) {
            case "checkbox":
              newValue = e.target.checked;
              break;
            case "number":
              newValue = parseInt(e.target.value);
              break;
            default:
              newValue = e.target.value;
              break;
          }

          props.state[1]({
            ...props.state[0],
            [name]: newValue,
          });
        }}
      />
    </div>
  );
};

export default UserCard;
