import { ActionFunction, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { findUserByEmail } from "~/services/appwrite";
import { verifyPassword } from "~/utils/hash";
import { createUserSession } from "~/services/session.server";

type ActionData = {
  error?: string;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return json<ActionData>({ error: "Invalid form data" });
  }

  try {
    const user = await findUserByEmail(email);

    if (!user || !(await verifyPassword(password, user.password))) {
      return json<ActionData>({ error: "Invalid email or password" });
    }
    console.log("USER FOUND", user);
    
    // Create a user session and redirect to the dashboard
    return createUserSession(user.$id, user.name, user.email, user.role, "/welcome");
  } catch (error) {
    console.error("Error during login:", error);
    return json<ActionData>({ error: "Failed to log in user" });
  }
};

export default function Login() {
  const actionData = useActionData<ActionData>();

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <Form method="post" className="p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        {actionData?.error && (
          <p className="text-red-500 mb-4">{actionData.error}</p>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="mb-2 p-2 border rounded w-full"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="mb-4 p-2 border rounded w-full"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded w-full"
        >
          Login
        </button>
        <p>OR <Link to={"/register"}>Register</Link> </p>
      </Form>
    </div>
  );
}
