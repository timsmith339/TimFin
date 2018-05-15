import {Category} from "../timfin-types";
import {GlobalState} from "./store";
import {createSelector} from "reselect";

export const NAME = "categories";

export interface CategoryState {
    categories: Category[];
    selectedId?: string;
}

// Actions
export const LOAD_CATEGORIES = "categories/LOAD_CATEGORIES";
export const LOAD_CATEGORY = "categories/LOAD_CATEGORY";
export const SET_SELECTED_CATEGORY = "categories/SET_SELECTED_CATEGORY";

// Reducer
export default function reducer(state: CategoryState = {
    categories: [],
    selectedId: null
},                              action: any): CategoryState {

    switch (action.type) {
        case LOAD_CATEGORIES:
            return Object.assign({}, state, { categories: action.categories });
        case LOAD_CATEGORY: {
            const newCategory = action.category;
            if (state.categories.find(c => c.id === newCategory.id)) {
                return Object.assign({}, state, {categories: state.categories.map(c => {
                    return c.id === newCategory.id ? newCategory : c;
                })});
            } else {
                return Object.assign({}, state, { categories: state.categories.concat(newCategory) });
            }
        }
        case SET_SELECTED_CATEGORY:
            return Object.assign({}, state, {selectedId: action.selectedId});
        default:
            return state;
    }

}


// Action Creators
export const loadCategories = (categories: Category[]) => ({type: LOAD_CATEGORIES, categories});
export const loadCategory = (category: Category) => ({type: LOAD_CATEGORY, category});
export const setSelectedCategory = (category: Category) => ({type: SET_SELECTED_CATEGORY, selectedId: category.id});


// Selectors
const getAll = (state: GlobalState): CategoryState => state[NAME];
export const getCategories = createSelector(getAll, (state) => {
    return state.categories.sort((a, b) => a.name <= b.name ? -1 : 1);
});
export const getSelectedCategory = createSelector(getAll, (state) => {
    const { categories, selectedId } = state;
    return selectedId ? categories.find(category => category.id === selectedId) : null;
});
