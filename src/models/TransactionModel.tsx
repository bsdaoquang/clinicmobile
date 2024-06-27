export interface TransactionModel {
  amount: string;
  createdAt: number;
  email: string;
  id: string;
  method: string;
  name: string;
  phoneNumber: string;
  status: number;
  uid: string;
  type: 'deposit' | 'withdraw' | 'transfer';
  content: string;
}
