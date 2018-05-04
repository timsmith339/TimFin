import {Account} from "../timfin-types";
import {GlobalState} from "./store";
import {createSelector} from "reselect";

export const NAME = "accounts";

export interface AccountState {
    accounts: Account[];
    selectedId?: string;
}

// Actions
export const LOAD_ACCOUNTS = "accounts/LOAD_ACCOUNTS";
export const SET_SELECTED_ACCOUNT = "accounts/SET_SELECTED_ACCOUNT";

// Reducer
export default function reducer(state: AccountState = {
    accounts: [],
    selectedId: null
},                              action: any): AccountState {

    switch (action.type) {
        case LOAD_ACCOUNTS:
            return Object.assign({}, state, { accounts: action.accounts });
        case SET_SELECTED_ACCOUNT:
            return Object.assign({}, state, {selectedId: action.selectedId});
        default:
            return state;
    }

}


// Action Creators
export const loadAccounts = (accounts: Account[]) => ({ type: LOAD_ACCOUNTS, accounts });
export const setSelectedAccount = (account: Account) => ({type: SET_SELECTED_ACCOUNT, selectedId: account.id});


// Selectors
const getAll = (state: GlobalState): AccountState => state[NAME];
export const getAllAccounts = (state: GlobalState): Account[] => state[NAME].accounts;
export const getSelectedAccount = createSelector(getAll, (state) => {
    const { accounts, selectedId } = state;
    return selectedId ? accounts.find(account => account.id === selectedId) : null;
});
