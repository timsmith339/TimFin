import {Moment} from "moment";

export interface Account {
    id: string;
    name: string;
}

export interface Category {
    id: string;
    name: string;
}

export type TransactionType = "credit" | "debit";

export interface Transaction {
    id?: string;
    transaction_type: TransactionType;
    timestamp: Moment;
    amount: number;
    description: string;
    note?: string;
    account: Account;
    category: Category;
    created?: Moment;
    categoryId?: string;
}

export interface CategorySubtotal { [categoryId: string]: number; }

export interface TransactionStatistics {
    count: number;
    total: number;
    categorySubtotals: CategorySubtotal;
}
