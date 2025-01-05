import { ActionFunction, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { createUserEntry } from "~/services/appwrite";
import { hashPassword } from "~/utils/hash";
import { createUserSession } from "~/services/session.server";

type ActionData = {
  error?: string;
  success?: string;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return json<ActionData>({ error: "Invalid form data" });
  }

  try {
    const hashedPassword = await hashPassword(password);
    console.log("NAME", name);
    console.log("EMAIL", email);
    console.log("PASSWORD", hashedPassword);
    
    
    
    const user = await createUserEntry(name, email, hashedPassword);

    return createUserSession(user.$id, user.name, user.email, user.role, "/dashboard");
  } catch (error) {
    console.error("Error during registration:", error);
    return json<ActionData>({ error: "Failed to register user" });
  }
};

export default function Register() {
  const actionData = useActionData<ActionData>();

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <Form method="post" className="p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        {actionData?.error && (
          <p className="text-red-500 mb-4">{actionData.error}</p>
        )}
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="mb-2 p-2 border rounded w-full"
          required
        />
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
          Register
        </button>
      </Form>
    </div>
  );
}
