import React from "react";

export const LoggedContext = React.createContext(
  { info: { username: '', isAdmin: false }, requestLoggedInfo: () => { } }
);