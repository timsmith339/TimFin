export interface Account {
    id: string;
    name: string;
}

export interface Category {
    id: string;
    name: string;
}

export interface Transaction {
    id?: string;
    timestamp: Date;
    amount: number;
    description: string;
    note?: string;
    account: Account;
    category: Category;
}
