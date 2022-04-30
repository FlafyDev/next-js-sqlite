import { withSessionSsr } from "../lib/withSession";
import { getUsers } from "../lib/db";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import User from "../models/user";
import { AddBackground } from "../hooks/useBackgroundTransitioner";

export interface PageProps {
  addBackground: AddBackground;
  user: User;
}

export const genSSP: (
  getProps?: (
    context: GetServerSidePropsContext
  ) => Promise<{ [key: string]: any }>
) => GetServerSideProps = (getProps) => {
  return withSessionSsr(async (context) => {
    return {
      props: {
        user:
          context.req.session.id === undefined
            ? null
            : await getUsers().where("id", context.req.session.id).first(),
        ...(await getProps?.(context)),
      },
    };
  });
};
