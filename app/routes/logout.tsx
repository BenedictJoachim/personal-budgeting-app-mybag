import { ActionFunction, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { destroySession, getSession } from "~/services/session.server";

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};

export default function Logout() {
  return <Form method="post"><button type="submit">Logout</button></Form>;
}
