import { clamp } from "lodash-es";
import User, { Gender } from "../models/user";

enum ValidationResult {
  None,
  InvalidUsername,
  InvalidEmail,
  InvalidPassword,
  InvalidFirstOrLastName,
  BadAge,
  TakenUsername,
  TakenEmail,
}

export const validatePassword = (password?: string) =>
  password && /^[a-z,A-Z,0-9,@$!%*#?&]{8,32}$/.test(password);

export const validateUsername = (username?: string) =>
  username && /^[a-z,A-Z,0-9]{3,12}$/.test(username);

export const validateEmail = (email?: string) =>
  email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validateName = (name?: string) =>
  name && /^[a-z,A-Z]{2,32}$/.test(name);

export const validateAge = (age?: number) => age && age > 13 && age < 120;

const validateUser = (user: User) => {
  if (!validatePassword(user.password)) {
    return ValidationResult.InvalidPassword;
  }
  if (!validateUsername(user.username)) {
    return ValidationResult.InvalidUsername;
  }
  if (!validateEmail(user.email)) {
    return ValidationResult.InvalidEmail;
  }
  if (!validateName(user.firstName) || !validateName(user.lastName)) {
    return ValidationResult.InvalidFirstOrLastName;
  }
  if (!validateAge(user.age)) {
    return ValidationResult.BadAge;
  }

  user.gender = clamp(user.gender, 0, Gender.Other);

  return ValidationResult.None;
};

export { ValidationResult };
export default validateUser;
