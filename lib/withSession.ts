import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiHandler,
} from "next";

declare module "iron-session" {
  interface IronSessionData {
    id?: number;
  }
}

const sessionOptions = {
  cookieName: "site_cookies",
  password:
    process.env.COOKIE_SECRET ??
    (() => {
      throw "No cookie secret";
    })(),
  cookieOptions: {
    maxAge: 600, // Reset after 600 seconds.
    secure: process.env.NODE_ENV === "production",
  },
};

export function withSessionRoute(handler: NextApiHandler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

export function withSessionSsr<
  P extends { [key: string]: unknown } = { [key: string]: unknown }
>(
  handler: (
    context: GetServerSidePropsContext
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) {
  return withIronSessionSsr(handler, sessionOptions);
}
