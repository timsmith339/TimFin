import axios from "axios";
import {Account, Category, Transaction} from "../timfin-types";
import * as moment from "moment";
import * as tz from "moment-timezone";

// const baseUrl = "https://timfinapi.herokuapp.com/api";
const baseUrl = "http://0.0.0.0:3001/api";

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

export interface TransactionSearchCriteria {
    account?: Account;
    category?: Category;
    startDate?: moment.Moment;
    endDate?: moment.Moment;
}

export function getTransactions(criteria: TransactionSearchCriteria): Promise<Transaction[]> {
    return new Promise((resolve, reject) => {
        const { account, category, startDate, endDate } = criteria;
        let filter = "";

        let initialized: boolean = false;
        const getNextSymbol = () => {
            if (initialized) { return "&"; }
            initialized = true;
            return "?";
        };

        if (account) {
            filter += `${getNextSymbol()}filter[where][accountId]=${account.id}`;
        }
        if (category) {
            filter += `${getNextSymbol()}filter[where][categoryId]=${category.id}`;
        }
        if (startDate) {
            filter += `${getNextSymbol()}filter[where][and][0][timestamp][gte]=${startDate.utc().toISOString()}`;
        }
        if (endDate) {
            filter += `${getNextSymbol()}filter[where][and][1][timestamp][lte]=${endDate.utc().toISOString()}`;
        }
        const url = `${baseUrl}/transactions${filter}&filter[include]=category&filter[include]=account`;
        axios.get(url)
            .then((response) => {
                const result = response.data.map((d: any) => Object.assign({}, d, { timestamp: moment(d.timestamp).local() }));
                resolve(result as Transaction[]);
            }, (error) => {
                reject(error);
            });
    });
}

export function postNewTransaction(transaction: Transaction): Promise<Transaction> {
    return new Promise((resolve, reject) => {
        const payload = {
            accountId: transaction.account.id,
            transaction_type: transaction.transaction_type,
            categoryId: transaction.category.id,
            timestamp: transaction.timestamp.utc().toISOString(),
            amount: transaction.amount,
            description: transaction.description,
            note: transaction.note
        };
        axios.post(`${baseUrl}/transactions`, payload)
            .then((response) => {
                const res = response.data as Transaction;
                axios.get(`${baseUrl}/transactions/${res.id}?filter[include]=category&filter[include]=account`)
                    .then((r) => {
                        resolve(Object.assign({}, r.data, { timestamp: moment(r.data.timestamp).local() }));
                    }, (error) => {
                        reject(error);
                    });
            }, (error) => {
                reject(error);
            });
    });
}

export function deleteTransaction(transaction: Transaction): Promise<any> {
    return new Promise((resolve, reject) => {
        axios.delete(`${baseUrl}/transactions/${transaction.id}`)
            .then((response) => {
                resolve();
            })
            .catch((error) => {
                console.error("Error deleting transaction", error);
                reject(error);
            });
    });
}
