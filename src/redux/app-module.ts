export const NAME = "app";

export interface AppState {
    count: number;
}

// Actions --------------------------------------------------
export const APP_INIT = "app/APP_INIT";
export const INC_COUNT = "app/INC_COUNT";
export const DEC_COUNT = "app/DEC_COUNT";

export default function reducer(state: AppState = {
    count: 0
},                              action: any): AppState {
    switch (action.type) {
        case APP_INIT: {
            return state;
        }
        case INC_COUNT:
            return Object.assign({}, state, {count: state.count + 1});
        case DEC_COUNT:
            return Object.assign({}, state, {count: state.count - 1});
        default:
            return state;
    }
}

// Action Creators --------------------------------------------------
export const incCount = () => ({type: INC_COUNT});
export const decCount = () => ({type: DEC_COUNT});
