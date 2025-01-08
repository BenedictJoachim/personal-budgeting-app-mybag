import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getIncomeData, getCategories, fetchExpenses } from "~/services/appwrite";
import { getUserSession } from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
      const sessionUser = await getUserSession(request);
      if (!sessionUser || !sessionUser.userId) {
        throw new Response('Unauthorized', { status: 401 });
      }
    
  const userId = sessionUser.userId; // Replace with logic to fetch user ID from session or request
  
  // Fetch income data
  const incomeData = await getIncomeData(userId);
  const totalIncome =
    (incomeData?.monthlyIncome || 0) + (incomeData?.additionalIncome || 0);

  // Fetch categories
  const categories = await getCategories();

  // Fetch expenses
  const expenses = await fetchExpenses(userId);
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return json({
    incomeData,
    totalIncome,
    categories,
    expenses,
    totalExpenses,
  });
}

export default function summaryDashboard() {
  const { incomeData, totalIncome, categories, expenses, totalExpenses } =
    useLoaderData<typeof loader>();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Income Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold">Income</h2>
        <div className="mt-2">
          <p>Monthly Income: ${incomeData?.monthlyIncome || 0}</p>
          <p>Additional Income: ${incomeData?.additionalIncome || 0}</p>
          <p className="font-bold">Total Income: ${totalIncome}</p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold">Categories</h2>
        <ul className="list-disc pl-6 mt-2">
          {categories.map((category) => (
            <li key={category.$id}>{category.name}{category.userPercentage}</li>
          ))}
        </ul>
      </section>

      {/* Expenses Section */}
      <section>
        <h2 className="text-xl font-semibold">Expenses</h2>
        <table className="table-auto w-full mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="border-t">
                <td className="px-4 py-2">{expense.category}</td>
                <td className="px-4 py-2">{expense.description}</td>
                <td className="px-4 py-2">${expense.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 font-bold">Total Expenses: ${totalExpenses}</p>
      </section>
    </div>
  );
}
