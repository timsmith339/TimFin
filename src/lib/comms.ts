import axios from "axios";

import {Account, Category, Transaction} from "../timfin-types";

const baseUrl = "https://timfinapi.herokuapp.com/api";
// const baseUrl = "http://0.0.0.0:3001/api";

export function getAccounts(): Promise<Account[]> {
    return new Promise((resolve, reject) => {
        axios.get(`${baseUrl}/accounts`)
            .then((response) => {
                resolve(response.data as Account[]);
            }, (error) => {
                reject(error);
            });
    });
}

export function getCategories(): Promise<Category[]> {
    return new Promise((resolve, reject) => {
        axios.get(`${baseUrl}/categories`)
            .then((response) => {
                resolve(response.data as Category[]);
            }, (error) => {
                reject(error);
            });
    });
}

export function addCategory(name: string, budget?: number): Promise<Category> {
    return new Promise((resolve, reject) => {
        axios.post(`${baseUrl}/categories`, { name, budget })
            .then((response) => {
                const res = response.data as Category;
                resolve(res);
            }, (error) => {
                reject(error);
            });
    });
}

export function getTransactions(account: Account, category?: Category): Promise<Transaction[]> {
    return new Promise((resolve, reject) => {
        let filter = "";
        filter += `filter[where][accountId]=${account.id}`;
        if (category) {
            filter += `&filter[where][categoryId]=${category.id}`;
        }
        const url = `${baseUrl}/transactions?${filter}&filter[include]=category&filter[include]=account`;
        axios.get(url)
            .then((response) => {
                resolve(response.data as Transaction[]);
            }, (error) => {
                reject(error);
            });
    });
}

export function postNewTransaction(transaction: Transaction): Promise<Transaction> {
    return new Promise((resolve, reject) => {
        const payload = {
            accountId: transaction.account.id,
            categoryId: transaction.category.id,
            timestamp: transaction.timestamp,
            amount: transaction.amount,
            description: transaction.description,
            note: transaction.note
        };
        axios.post(`${baseUrl}/transactions`, payload)
            .then((response) => {
                const res = response.data as Transaction;
                axios.get(`${baseUrl}/transactions/${res.id}?filter[include]=category&filter[include]=account`)
                    .then((r) => {
                        resolve(r.data as Transaction);
                    }, (error) => {
                        reject(error);
                    });
            }, (error) => {
                reject(error);
            });
    });
}
