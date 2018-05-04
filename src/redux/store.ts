import {
    applyMiddleware,
    combineReducers,
    compose,
    createStore,
    Store
} from "redux";

import appReducer, {AppState, NAME as APP_NAME} from "./app-module";
import categoriesReducer, {CategoryState, NAME as CATEGORIES_NAME} from "./category-module";
import accountsReducer, {AccountState, NAME as ACCOUNTS_NAME} from "./account-module";
import transactionsReducer, {TransactionState, NAME as TRANSACTIONS_NAME} from "./transaction-module";
import {loadState, saveState} from "../lib/localStorage";

declare module window {
    export let devToolsExtension: any;
}

export interface GlobalState {
    app: AppState;
    categories: CategoryState;
    accounts: AccountState;
    transactions: TransactionState;
}

const reducers = combineReducers({
    [APP_NAME]: appReducer,
    [CATEGORIES_NAME]: categoriesReducer,
    [ACCOUNTS_NAME]: accountsReducer,
    [TRANSACTIONS_NAME]: transactionsReducer,
});

const rootReducer = (state: GlobalState, action: any) => {
    return reducers(state, action);
};

const middleware = compose(
    applyMiddleware(),
    window.devToolsExtension ? window.devToolsExtension() : (f: any) => f
);

const persistedState = loadState();

export const store: Store<GlobalState> = createStore(
    rootReducer,
    persistedState,
    middleware
) as Store<GlobalState>;

store.subscribe(() => {
    const state = store.getState();
    saveState({
        categories: state.categories,
        accounts: state.accounts
   });
});
