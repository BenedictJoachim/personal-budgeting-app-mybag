import { LoaderFunction, redirect } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
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
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-600 text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm">Welcome, {name}!</p>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-2 px-4">
            <li>
              <NavLink
                to="/summaryDashboard"
                className="block px-4 py-2 rounded hover:bg-blue-700"
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/income_setup"
                className="block px-4 py-2 rounded hover:bg-blue-700"
              >
                Income Setup
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/expenses"
                className="block px-4 py-2 rounded hover:bg-blue-700"
              >
                Track Expenses
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/goals"
                className="block px-4 py-2 rounded hover:bg-blue-700"
              >
                Savings Goals
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/tips"
                className="block px-4 py-2 rounded hover:bg-blue-700"
              >
                Personalized Tips
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="p-4">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 bg-white shadow-md">
        <Outlet />
      </main>
    </div>
  );
}
