import React, { useState } from 'react';
import { useLoaderData, Form, useNavigation } from '@remix-run/react';
import { LoaderFunction, ActionFunction } from '@remix-run/node';
import { fetchExpenses, saveExpenses } from '../services/appwrite';
import { getUserSession } from "~/services/session.server";
import { Expense } from '../types/data-types';

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await getUserSession(request);
  if (!sessionUser || !sessionUser.userId) {
    throw new Response('Unauthorized', { status: 401 });
  }

  const expenses = await fetchExpenses(sessionUser.userId);
  return expenses;
};

export const action: ActionFunction = async ({ request }) => {
  const sessionUser = await getUserSession(request);
  if (!sessionUser) {
    throw new Response('Unauthorized', { status: 401 });
  }

  const formData = await request.formData();
  const expenses = JSON.parse(formData.get('expenses') as string);

  const enrichedExpenses = expenses.map((expense: Expense) => ({
    ...expense,
    userId: sessionUser.userId,
  }));

  const result = await saveExpenses(enrichedExpenses);
  console.log("EXPENSES: ", enrichedExpenses);
  
  return result;
};

const ExpenseInput = () => {
  const data = useLoaderData<Expense[]>();
  const transition = useNavigation();
  const [expenses, setExpenses] = useState(data);

  const handleChange = (index: number, field: keyof Expense, value: string | number) => {
    const updatedExpenses = [...expenses];
    updatedExpenses[index] = { ...updatedExpenses[index], [field]: value };
    setExpenses(updatedExpenses);
  };

  const handleAddExpense = () => {
    setExpenses([...expenses, { id: '', category: '', description: '', amount: 0, date: new Date(), userId: '' }]);
  };

  const handleRemoveExpense = (index: number) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-800">Expense Input</h1>
      <p className="text-gray-600 mt-4">Input your monthly expenses for each category.</p>
      <Form method="post">
        <input type="hidden" name="expenses" value={JSON.stringify(expenses)} />
        {expenses.map((expense, index) => (
          <div key={index} className="mt-6">
            <label className="block text-gray-700">Category:</label>
            <input
              type="text"
              className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
              value={expense.category}
              onChange={(e) => handleChange(index, 'category', e.target.value)}
              placeholder="Enter category"
            />
            <label className="block text-gray-700 mt-4">Description:</label>
            <input
              type="text"
              className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
              value={expense.description}
              onChange={(e) => handleChange(index, 'description', e.target.value)}
              placeholder="Enter description"
            />
            <label className="block text-gray-700 mt-4">Amount:</label>
            <input
              type="number"
              className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
              value={expense.amount || ''}
              onChange={(e) => handleChange(index, 'amount', parseFloat(e.target.value))}
              placeholder="Enter amount"
            />
            <button
              type="button"
              onClick={() => handleRemoveExpense(index)}
              className="bg-red-500 text-white mt-2 py-1 px-3 rounded hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddExpense}
          className="bg-green-500 text-white mt-6 py-2 px-4 rounded hover:bg-green-700"
        >
          Add Expense
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white mt-6 py-2 px-4 rounded hover:bg-blue-700"
        >
          {transition.state === 'submitting' ? 'Saving...' : 'Save'}
        </button>
      </Form>
    </div>
  );
};

export default ExpenseInput;
