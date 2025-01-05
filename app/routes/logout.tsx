import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { logout } from "~/services/session.server";

export const loader = () => {
  return null;
};

export const action: ActionFunction = async ({ request }) => {
    return logout(request);
  };