import { withSessionSsr } from "../lib/withSession";
import { getUsers } from "../lib/db";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import User from "../models/user";
import { AddBackground } from "../hooks/useBackgroundTransitioner";

export interface PageProps {
  addBackground: AddBackground;
  user?: User;
}

export const genSSP: (
  getProps?: (
    context: GetServerSidePropsContext,
    user: User | null
  ) => Promise<{ [key: string]: any } | string>
) => GetServerSideProps = (getProps) => {
  return withSessionSsr(async (context) => {
    const user =
      context.req.session.id === undefined
        ? null
        : (await getUsers().where("id", context.req.session.id).first()) ??
          null;

    const props = await getProps?.(context, user);

    if (typeof props === "string") {
      return {
        redirect: {
          destination: props,
        },
        props: {},
      };
    }

    return {
      props: {
        user,
        ...props,
      },
    };
  });
};
