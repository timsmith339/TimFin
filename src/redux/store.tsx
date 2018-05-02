import {
    applyMiddleware,
    combineReducers,
    compose,
    createStore,
    Store
} from "redux";

import appReducer, {AppState, NAME as APP_NAME} from "./app-module";

export interface GlobalState {
    app: AppState
}

const reducers = combineReducers({
    [APP_NAME]: appReducer
});

const rootReducer = (state: GlobalState, action: any) => {
    return reducers(state, action);
};

export const store: Store<GlobalState> = createStore(rootReducer) as Store<GlobalState>;
