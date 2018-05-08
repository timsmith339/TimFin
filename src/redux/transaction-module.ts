import {Category, Transaction, TransactionStatistics} from "../timfin-types";
import {GlobalState} from "./store";
import {createSelector} from "reselect";
import {TransactionSearchCriteria} from "../lib/comms";
import * as moment from "moment";
import Statistics from "../lib/statistics";

export const NAME = "transactions";

export interface TransactionState {
    transactions: Transaction[];
    selectedId?: string;
    searchCriteria: TransactionSearchCriteria;
    stats: TransactionStatistics;
}

// Actions
export const LOAD_TRANSACTIONS = "transactions/LOAD_TRANSACTIONS";
export const LOAD_TRANSACTION = "transactions/LOAD_TRANSACTION";
export const SET_SELECTED_TRANSACTION = "transactions/SET_SELECTED_TRANSACTION";
export const CLEAR_SELECTED_TRANSACTION = "transactions/CLEAR_SELECTED_TRANSACTION";
export const REMOVE_TRANSACTION = "transactions/REMOVE_TRANSACTION";
export const SET_SEARCH_CRITERIA = "transactions/SET_SEARCH_CRITERIA";

// Reducer
export default function reducer(state: TransactionState = {
    transactions: [],
    selectedId: null,
    searchCriteria: {
        startDate: moment().startOf("month"),
        endDate: moment().endOf("month")
    },
    stats: {
        count: 0,
        total: 0,
        categorySubtotals: { }
    }
},                              action: any): TransactionState {
    switch (action.type) {
        case LOAD_TRANSACTIONS: {
            const {transactions} = action;
            const stats = Statistics.calculateStats(transactions);
            return Object.assign({}, state, {transactions, stats});
        }
        case LOAD_TRANSACTION: {
            const newTransaction = action.transaction;
            if (state.transactions.find(c => c.id === newTransaction.id)) {
                return state;
            } else {
                const transactions = state.transactions.concat(newTransaction);
                const stats = Statistics.calculateStats(transactions);
                return Object.assign({}, state, {transactions, stats});
            }
        }
        case REMOVE_TRANSACTION:
            return Object.assign({}, state, { transactions: state.transactions.filter(t => t.id !== action.transaction.id) });
        case SET_SELECTED_TRANSACTION:
            return Object.assign({}, state, { selectedId: action.selectedId });
        case CLEAR_SELECTED_TRANSACTION:
            return Object.assign({}, state, { selectedId: "" });
        case SET_SEARCH_CRITERIA:
            return Object.assign({}, state, { searchCriteria: action.searchCriteria });
        default:
            return state;
    }
}


// Action Creators
export const loadTransactions = (transactions: Transaction[]) => ({ type: LOAD_TRANSACTIONS, transactions });
export const loadTransaction = (transaction: Transaction) => ({ type: LOAD_TRANSACTION, transaction });
export const removeTransaction = (transaction: Transaction) => ({ type: REMOVE_TRANSACTION, transaction });
export const setSelectedTransaction = (transaction: Transaction) => ({ type: SET_SELECTED_TRANSACTION, selectedId: transaction.id });
export const clearSelectedTransaction = () => ({ type: CLEAR_SELECTED_TRANSACTION });
export const setTransactionSearchCriteria = (criteria: TransactionSearchCriteria) => ({ type: SET_SEARCH_CRITERIA, searchCriteria: criteria });

// Selectors
const getAll = (state: GlobalState): TransactionState => state[NAME];
export const getTransactionsReversed = createSelector(getAll, state => {
    return state.transactions.sort((a, b) => {
        // If  they're the same day, sort by created
        if (a.timestamp.isSame(b.timestamp, "d")) {
            return a.created > b.created ? -1 : 1;
        // If they're different days, then sort by timestamp
        } else {
            return a.timestamp > b.timestamp ? -1 : 1;
        }
    });
});
export const getSelectedTransaction = createSelector(getAll, (state) => {
    const { transactions, selectedId } = state;
    return selectedId ? transactions.find(transaction => transaction.id === selectedId) : null;
});
