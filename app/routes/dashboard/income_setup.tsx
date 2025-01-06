import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { getUserSession } from "~/services/session.server";
import { getIncomeData, saveIncomeData } from "~/services/appwrite";

type LoaderData = {
  monthlyIncome: number | null;
  additionalIncome: number | null;
};

export const loader = async ({ request }: { request: Request }) => {
    const session = await getUserSession(request);
    if (!session || !session.userId) {
      return redirect("/login");
    }
  
    try {
      const incomeData = await getIncomeData(session.userId);
      return json<LoaderData>({
        monthlyIncome: incomeData?.monthlyIncome || null,
        additionalIncome: incomeData?.additionalIncome || null,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching income data:", error.message);
      } else {
        console.error("Unknown error fetching income data:", error);
      }
      return json<LoaderData>({ monthlyIncome: null, additionalIncome: null });
    }
};
  
export const action = async ({ request }: { request: Request }) => {
    const session = await getUserSession(request);
    if (!session || !session.userId) {
      return redirect("/login");
    }
  
    const formData = await request.formData();
    const monthlyIncome = parseFloat(formData.get("monthlyIncome") as string);
    const additionalIncome = parseFloat(formData.get("additionalIncome") as string);
  
    try {
      await saveIncomeData(session.userId, monthlyIncome, additionalIncome);
      return redirect("/dashboard/income_setup");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error saving income data:", error.message);
      } else {
        console.error("Unknown error saving income data:", error);
      }
      return json({ error: "Failed to save income data" }, { status: 500 });
    }
  };
  
export default function IncomeSetup() {
  const { monthlyIncome, additionalIncome } = useLoaderData<LoaderData>();

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Income Setup</h1>
      <Form method="post" className="space-y-4">
        <div>
          <label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-700">
            Monthly Income
          </label>
          <input
            type="number"
            name="monthlyIncome"
            id="monthlyIncome"
            defaultValue={monthlyIncome || ""}
            step="0.01"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="additionalIncome" className="block text-sm font-medium text-gray-700">
            Additional Income
          </label>
          <input
            type="number"
            name="additionalIncome"
            id="additionalIncome"
            defaultValue={additionalIncome || ""}
            step="0.01"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
        >
          Save Income
        </button>
      </Form>
    </div>
  );
}
