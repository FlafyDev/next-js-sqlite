import React, { useEffect, useState, useContext, useRef } from "react";
import styles from "./UserCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import Popup from "../Popup";
import { OpenPopupContext } from "../Popup/context";
import User from "../../models/user";
import { toNamespacedPath } from "path";
import { apiEditUser } from "../../lib/apiCommunicator";

const UserCard: React.FC<{
  user: User;
  canDelete: boolean;
}> = (props) => {
  const [user, setUser] = useState(props.user);
  const openPopup = useContext(OpenPopupContext);
  const [visible, setVisible] = useState(true);
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) updateUser();
    else didMount.current = true;
  }, [user]);

  const updateUser = async () => {
    await apiEditUser(user.id, user);
    console.log("A");
  };

  const deleteUser = async () => {
    openPopup("");
    setVisible(false);
    await apiEditUser(user.id, {}, true);
  };

  return (
    <div>
      <div className={styles.container} hidden={!visible}>
        <div className={styles.gridContainer}>
          <Field
            objectKey={"email"}
            displayName={"Email"}
            state={[user, setUser]}
          />
          <Field
            objectKey={"username"}
            displayName={"Username"}
            state={[user, setUser]}
          />
          <Field
            objectKey={"password"}
            displayName={"Password"}
            state={[user, setUser]}
          />
          <Field
            objectKey={"firstName"}
            displayName={"First Name"}
            state={[user, setUser]}
          />
          <Field
            objectKey={"lastName"}
            displayName={"Last Name"}
            state={[user, setUser]}
          />
          <Field
            objectKey={"age"}
            displayName={"Age"}
            state={[user, setUser]}
            type={"number"}
          />
          <Field
            objectKey={"gender"}
            displayName={"Gender"}
            state={[user, setUser]}
            type={"number"}
          />
          <Field
            objectKey={"points"}
            displayName={"Points"}
            state={[user, setUser]}
            type={"number"}
          />
          <Field
            objectKey={"isAdmin"}
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
  objectKey: string;
  type?: string;
  state: [any, (newValue: any) => void];
}> = (props) => {
  return (
    <div className={styles.field}>
      <div className={styles.name}>{props.displayName}</div>
      <input
        type={props.type}
        value={props.state[0][props.objectKey]}
        checked={props.state[0][props.objectKey]}
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
            [props.objectKey]: newValue,
          });
        }}
      />
    </div>
  );
};

export default UserCard;
