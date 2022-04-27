import type { NextPage } from "next";
type Data = {
  name: string;
};
const Home: NextPage = () => {
  return (
    <button
      onClick={async () => {
        // alert(
        //   (JSON.parse(await fetch("api/hello").then((r) => r.text())) as Data).
        // );
      }}
    >
      {"Hello!"}
    </button>
  );
};

export default Home;
