import { LoaderFunction, redirect, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
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

export default function Welcome() {
  const { user } = useLoaderData<LoaderData>();

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "Good mornig";
    if (currentHour <18) return "Good afternoon";
    return "Good evening";
  }

  const greeting = `${getGreeting()}, ${user.name}`

  return (
    <main className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-blue-600">{greeting}!</h1>
        <p>
          "In my bag" mean alot of things to alot of folks, but in its most simple form, it means the following;
        </p>
        <ul  className="list-disc list-inside text-center mt-2">
            <li>
                <strong>Track Expenses</strong>: Easily monitor your daily spending.
            </li>
            <li>
                <strong>Savings Goals</strong>: Plan and save for your future
            </li>
            <li>
              <strong>Personalized Tips</strong>: Get advice tailored to your financial situation.
            </li>
        </ul>


        <div className="mt-6 bg-blue-100">
            <p className="text-gray-600 mb-6">Let's get started! We will guide youthrough a quick setup process to personalize your budget experience.
                 You can adjust these settings at any time.
          <Link to={"/dashboard"}
            className="px-4 py-2 bg-gray-600 text-white rounded-md shadow hover:bg-gray-700"
          >
            Go to Dashboard
          </Link>
          </p>
        </div>
        
      </div>
    </main>
  );
}
