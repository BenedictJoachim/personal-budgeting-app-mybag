import { json, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getSession } from "~/services/session.server";
import { account } from "~/services/appwrite";

type LoaderData = {
  user: {
    name: string;
    email: string;
  } | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");

  // If no user is found in the session, redirect to login
  if (!user) {
    return redirect("/login");
  }

  try {
    // Verify the user's session with Appwrite
    const appwriteUser = await account.get();

    // If valid, return the user's information
    return json<LoaderData>({
      user: {
        name: appwriteUser.name,
        email: appwriteUser.email,
      },
    });
  } catch (error) {
    // If Appwrite session is invalid, clear the session and redirect to login
    return redirect("/login");
  }
};

export default function Index() {
  const { user } = useLoaderData<LoaderData>();

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <div className="p-8 bg-white shadow-lg rounded-lg text-center">
        {user ? (
          <>
            <h1 className="text-2xl font-bold text-blue-600">
              Welcome, {user.name}!
            </h1>
            <p className="text-gray-600 mt-2">Email: {user.email}</p>
          </>
        ) : (
          <p className="text-red-600">No user data available.</p>
        )}
      </div>
    </div>
  );
}
