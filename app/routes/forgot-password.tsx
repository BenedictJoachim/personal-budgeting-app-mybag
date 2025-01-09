import { ActionFunction, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { createPasswordRecoveryToken } from "~/services/appwrite";

type ActionData = {
  success?: string;
  error?: string;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");

  if (typeof email !== "string") {
    return json<ActionData>({ error: "Invalid email" });
  }

  try {
    await createPasswordRecoveryToken(email);
    return json<ActionData>({ success: "Password recovery email sent successfully" });
  } catch (error) {
    console.error("Error during password recovery:", error);
    return json<ActionData>({ error: "Failed to send password recovery email" });
  }
};

export default function ForgotPassword() {
  const actionData = useActionData<ActionData>();

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <Form method="post" className="p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
        {actionData?.error && (
          <p className="text-red-500 mb-4">{actionData.error}</p>
        )}
        {actionData?.success && (
          <p className="text-green-500 mb-4">{actionData.success}</p>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="mb-4 p-2 border rounded w-full"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded w-full"
        >
          Send Password Reset Email
        </button>
      </Form>
    </div>
  );
}
