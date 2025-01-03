import type { MetaFunction } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "myBAG | Personal Budgeting App" },
    { name: "description", content: "Welcome to myBag!" },
  ];
};

export default function Index() {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <nav>
          <ul>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>

        <Outlet /> 
      </body>
    </html>
  );
}