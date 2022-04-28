import { omit } from "lodash-es";
import React from "react";
import User from "../models/user";

export const LoggedContext = React.createContext({
  user: null as User | null,
  requestCurrentUser: () => {},
});
