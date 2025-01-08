export interface User {
    $id: string;
    name: string;
    email: string;
    role: string;
    password: string;
}

export interface Category {
    id?: string;
    name: string;
    userPercentage?: string;
    userId: string;
  }
  