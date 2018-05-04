import {Transaction} from "../timfin-types";
import {GlobalState} from "./store";
import {createSelector} from "reselect";

export const NAME = "transactions";

export interface TransactionState {
    transactions: Transaction[];
}

// Actions
export const LOAD_TRANSACTIONS = "transactions/LOAD_TRANSACTIONS";
export const LOAD_TRANSACTION = "transactions/LOAD_TRANSACTION";

// Reducer
export default function reducer(state: TransactionState = {
    transactions: []
},                              action: any): TransactionState {
    switch (action.type) {
        case LOAD_TRANSACTIONS:
            return Object.assign({}, state, { transactions: action.transactions });
        case LOAD_TRANSACTION:
            const newTransaction = action.transaction;
            if (state.transactions.find(c => c.id === newTransaction.id)) {
                return state;
            } else {
                return Object.assign({}, state, { transactions: state.transactions.concat(newTransaction) });
            }
        default:
            return state;
    }
}


// Action Creators
export const loadTransactions = (transactions: Transaction[]) => ({ type: LOAD_TRANSACTIONS, transactions });
export const loadTransaction = (transaction: Transaction) => ({ type: LOAD_TRANSACTION, transaction });


// Selectors
const getAll = (state: GlobalState): TransactionState => state[NAME];
export const getTransactions = createSelector(getAll, state => {
    return state.transactions.sort((a, b) => a.timestamp <= b.timestamp ? -1 : 1);
});
export const getTransactionsReversed = createSelector(getAll, state => {
    return state.transactions.sort((a, b) => a.timestamp > b.timestamp ? -1 : 1);
});
