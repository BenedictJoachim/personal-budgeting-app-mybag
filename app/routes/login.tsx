import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { client, account  } from "~/services/appwrite";
import { commitSession, getSession } from "~/services/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("user")) {
    return redirect("/dashboard");
  }
  return json({});
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const session = await account.createEmailPasswordSession(email, password);
    const user = await account.get();
    const sessionStorage = await getSession(request.headers.get("Cookie"));
    sessionStorage.set("user", { id: user.$id, email: user.email });
    return redirect("/dashboard", {
      headers: {
        "Set-Cookie": await commitSession(sessionStorage),
      },
    });
  } catch (err: any) {
    return json({ error: err.message }, { status: 400 });
  }
};

export default function Login() {
  const actionData = useActionData();
  return (
    <div>
      <h1>Login</h1>
      <Form method="post">
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Login</button>
        {actionData?.error && <p>{actionData.error}</p>}
      </Form>
    </div>
  );
}