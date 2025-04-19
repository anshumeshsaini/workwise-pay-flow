
export type UserRole = "employer" | "labourer";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  avatar_url?: string;
  phone?: string;
  wallet_balance: number;
  created_at: string;
}

export interface Job {
  id: string;
  employer_id: string;
  title: string;
  description: string;
  pay_rate: number;
  hours: number;
  total_pay: number;
  status: "pending" | "accepted" | "rejected" | "completed" | "paid";
  created_at: string;
  start_date: string;
  end_date?: string;
  labourer_id?: string;
  labourer?: User;
  employer?: User;
}

export interface Payment {
  id: string;
  job_id: string;
  employer_id: string;
  labourer_id: string;
  amount: number;
  status: "pending" | "processing" | "paid" | "failed";
  created_at: string;
  updated_at: string;
  transaction_id?: string;
  job?: Job;
  labourer?: User;
  employer?: User;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "job" | "payment" | "system";
  read: boolean;
  created_at: string;
  related_id?: string;
}

export interface FilterOptions {
  status?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

export interface PaymentMethod {
  id: string;
  type: "upi" | "wallet" | "bank";
  name: string;
  details: string;
  is_default: boolean;
}
