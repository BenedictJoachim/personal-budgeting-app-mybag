import { LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import LogoutButton from "~/components/LogoutButton";
import { getUserSession } from "~/services/session.server";

type LoaderData = {
  name: string;
  email: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getUserSession(request);
  console.log("Dashboard session", session);
  
  if (!session || !session.userId) {
    console.log("No session found redirecting to login");
    
    return redirect("/login");
  }

  console.log("User session: ", session);
  

  const { name, email } = session;

  return { name, email };
};

export default function Dashboard() {
  const { name, email } = useLoaderData<LoaderData>();

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <div className="p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold">Welcome, {name}!</h1>
        <p className="text-gray-600">Email: {email}</p>
        <LogoutButton />
      </div>
    </div>
  );
}
