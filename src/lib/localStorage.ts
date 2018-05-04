import {GlobalState} from "../redux/store";

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem("state");
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        console.error("Error deserializing state from localStorage", err);
        return undefined;
    }
};

export const saveState = (state: object) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem("state", serializedState);
    } catch (err) {
        console.error("Error serializing state from localStorage", err);
    }
};
