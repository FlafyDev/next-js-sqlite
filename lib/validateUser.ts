import User from "../models/user";
import { getUsers } from "./db";

enum ValidationResult {
  None,
  InvalidUsername,
  InvalidEmail,
  InvalidPassword,
  TakenUsername,
  TakenEmail,
}

export const validatePassword = (password?: string) =>
  password && /^[a-z,A-Z,0-9,@$!%*#?&]{8,32}$/.test(password);
export const validateUsername = (username?: string) =>
  username && /^[a-z,A-Z,0-9]{3,12}$/.test(username);
export const validateEmail = (email?: string) =>
  email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validateUser = async (user: User) => {
  if (!validatePassword(user.password)) {
    return ValidationResult.InvalidPassword;
  }
  if (!validateUsername(user.username)) {
    return ValidationResult.InvalidUsername;
  }
  if (!validateEmail(user.email)) {
    return ValidationResult.InvalidEmail;
  }
  if (
    (
      await getUsers().whereRaw(
        "LOWER(username) LIKE ?",
        `${user.username.toLowerCase()}`
      )
    ).length
  ) {
    return ValidationResult.TakenUsername;
  }
  if (
    (
      await getUsers().whereRaw(
        "LOWER(email) LIKE ?",
        `${user.email.toLowerCase()}`
      )
    ).length
  ) {
    return ValidationResult.TakenEmail;
  }
  return ValidationResult.None;
};

export { ValidationResult };
export default validateUser;
