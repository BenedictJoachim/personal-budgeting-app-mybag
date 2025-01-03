import { ActionFunction, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { account } from "~/services/appwrite";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  try {
    await account.create("unique()", email, password, name);
    return json({ success: true });
  } catch (err: any) {
    return json({ error: err.message }, { status: 400 });
  }
};

export default function Register() {
  const actionData = useActionData();
  return (
    <div>
      <h1>Register</h1>
      <Form method="post">
        <input type="text" name="name" placeholder="Name" required />
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Register</button>
        {actionData?.error && <p>{actionData.error}</p>}
      </Form>
    </div>
  );
}
