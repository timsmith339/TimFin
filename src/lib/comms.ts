import axios from "axios";

import {Account, Category} from "../typings/timfin-types";

export function getAccounts(): Promise<Account[]> {
    return new Promise((resolve, reject) => {
        axios.get("https://timfinapi.herokuapp.com/api/accounts")
            .then((response) => {
                resolve(response.data as Account[]);
            }, (error) => {
                reject(error);
            });
    });
}

export function getCategories(): Promise<Category[]> {
    return new Promise((resolve, reject) => {
        axios.get("https://timfinapi.herokuapp.com/api/categories")
            .then((response) => {
                resolve(response.data as Category[]);
            }, (error) => {
                reject(error);
            });
    });
}
