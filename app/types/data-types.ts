export interface User {
    $id: string;
    name: string;
    email: string;
    role: string;
    password: string;
    recoveryToken: string;
}

export interface Category {
    id?: string;
    name: string;
    userPercentage?: string;
    userId: string;
  }

  export interface Expense {
    id: string;
    category: string;
    description: string; 
    amount: number;
    date: Date;
    userId: string; 
  }
  