const enumToStringArr = (myEnum: object) =>
  Object.values(myEnum).filter(
    (value) => typeof value === "string"
  ) as string[];
export default enumToStringArr;
