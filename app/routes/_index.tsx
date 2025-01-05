import { LoaderFunction, redirect, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUserSession } from "~/services/session.server";

type LoaderData = {
  user: {
    name: string;
    email: string;
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  // Retrieve user session
  const session = await getUserSession(request);

  // Redirect to login if no session exists
  if (!session) {
    return redirect("/login");
  }

  // Extract user details from the session
  const { name, email } = session;

  // Validate required fields
  if (!name || !email) {
    console.error("Invalid session data. Redirecting to login.");
    return redirect("/login");
  }

  // Return user data to the client
  return json<LoaderData>({
    user: { name, email },
  });
};

export default function Index() {
  const { user } = useLoaderData<LoaderData>();

  return (
    <main className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-blue-600">Welcome, {user.name}!</h1>
        <p className="text-gray-700 mt-2">Your email: {user.email}</p>
        <div className="mt-6">
          <a
            href="/dashboard"
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </main>
  );
}
