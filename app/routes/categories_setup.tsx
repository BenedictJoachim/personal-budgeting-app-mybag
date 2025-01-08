import React, { useState, useTransition } from 'react';
import { useLoaderData, Form, useNavigation } from '@remix-run/react';
import { getCategories, getIncomeData, saveCategories } from '../services/appwrite'; // Import Appwrite functions
import { ActionFunction, json, LoaderFunction, redirect } from '@remix-run/node';
import { Category } from '~/types/data-types';
import { getUserSession } from '~/services/session.server';

const defaultCategories = [
  { name: 'Housing', recommendedPercentage: '25-35%' },
  { name: 'Transportation', recommendedPercentage: '10-15%' },
  { name: 'Groceries and Dining', recommendedPercentage: '10-15%' },
  { name: 'Utilities', recommendedPercentage: '5-10%' },
  { name: 'Savings and Investments', recommendedPercentage: '10-20%' },
  { name: 'Healthcare', recommendedPercentage: '5-10%' },
  { name: 'Personal Spending', recommendedPercentage: '5-10%' },
  { name: 'Debt Repayment', recommendedPercentage: '5-15%' },
  { name: 'Miscellaneous', recommendedPercentage: '5-10%' },
];


interface LoaderData {
  monthlyIncome: number | null;
  additionalIncome: number | null;
  categories: Category[] | null;
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getUserSession(request);
  console.log("CATEGORY USER", session?.name);
  
  if (!session || !session.userId) {
    return redirect("/login");
  }

  try {
    const [incomeData, categories] = await Promise.all([
      getIncomeData(session.userId),
      getCategories(),
    ]);

    const formattedCategories = categories.map((category: any) => ({
      id: category.$id,
      name: category.name,
      userPercentage: category.userPercentage || '',
      userId: session.userId,
    }));

    return json<LoaderData>({
      monthlyIncome: incomeData?.monthlyIncome || null,
      additionalIncome: incomeData?.additionalIncome || null,
      categories: formattedCategories.length > 0 ? formattedCategories : [],
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return json<LoaderData>({
      monthlyIncome: null,
      additionalIncome: null,
      categories: [],
    });
  }
};

export const action:ActionFunction = async({ request }) => {
  const formData = await request.formData();
  const categories = JSON.parse(formData.get('categories') as string);
  return await saveCategories(categories); // Use Appwrite utility function
}

const CategorySetup = () => {
  const data = useLoaderData<LoaderData>();
  const navigation = useNavigation()

  const initialCategories = defaultCategories.map(category => {
    const existingCategory = data.categories?.find(
      (item: Category) => item.name === category.name
    );
    return existingCategory || { ...category, userPercentage: '' };
  });

  const [categories, setCategories] = useState(initialCategories);

  const handleChange = (index: number, value: string) => {
    const updatedCategories = [...categories];
    updatedCategories[index].userPercentage = value;
    setCategories(updatedCategories);
  };

  const handleAddCategory = () => {
    setCategories([...categories, { name: '', recommendedPercentage: '', userPercentage: '' }]);
  };

  const handleRemoveCategory = (index: number) => {
    const updatedCategories = categories.filter((_, i) => i !== index);
    setCategories(updatedCategories);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-800">Category Setup</h1>
      <p className="text-gray-600 mt-4">Set up your budget categories and allocate percentages.</p>
      <Form method="post">
        <input type="hidden" name="categories" value={JSON.stringify(categories)} />
        {categories.map((category, index) => (
          <div key={index} className="mt-6">
            <label className="block text-gray-700">Category Name:</label>
            <input
              type="text"
              className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
              value={category.name}
              onChange={(e) => {
                const updatedCategories = [...categories];
                updatedCategories[index].name = e.target.value;
                setCategories(updatedCategories);
              }}
              placeholder="Enter category name"
            />
            <label className="block text-gray-700 mt-4">Recommended Percentage: {defaultCategories[index].recommendedPercentage}</label>
            <label className="block text-gray-700 mt-4">User Percentage:</label>
            <input
              type="number"
              className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
              value={category.userPercentage || ''}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder="Enter user percentage"
            />
            <button
              type="button"
              onClick={() => handleRemoveCategory(index)}
              className="bg-red-500 text-white mt-2 py-1 px-3 rounded hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddCategory}
          className="bg-green-500 text-white mt-6 py-2 px-4 rounded hover:bg-green-700"
        >
          Add Category
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white mt-6 py-2 px-4 rounded hover:bg-blue-700"
        >
          {navigation.state === 'submitting' ? 'Saving...' : 'Save'}
        </button>
      </Form>
    </div>
  );
};

export default CategorySetup;
