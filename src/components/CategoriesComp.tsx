import * as React from "react";
import {connect} from "react-redux";
import {GlobalState} from "../redux/store";
import {Category} from "../timfin-types";
import {addCategory} from "../lib/comms";
import {getCategories, getSelectedCategory, loadCategory, setSelectedCategory} from "../redux/category-module";
import {Dispatch} from "redux";

interface CategoriesCompState {
    newCategoryName: string;
}

class CategoriesComp extends React.Component<CategoriesCompOwnProps, CategoriesCompState> {
    constructor(props: CategoriesCompOwnProps) {
        super(props);

        this.state = { newCategoryName: "" };

        this.newCatChanged = this.newCatChanged.bind(this);
        this.newCatKeyUp = this.newCatKeyUp.bind(this);
        this.submitNewCategory = this.submitNewCategory.bind(this);
    }

    newCatChanged(e: React.FormEvent<HTMLInputElement>) {
        const newCategoryName = e.currentTarget.value;
        this.setState({ newCategoryName });
    }

    submitNewCategory() {
        const { newCategoryName } = this.state;
        addCategory(newCategoryName).then(newCategory => {
            this.props.loadCategory(newCategory);
        });
        this.setState({ newCategoryName: "" });
    }

    newCatKeyUp(e: any) {
        if (e.which === 13) {
            this.submitNewCategory();
        }
    }

    selectCategory(category: Category) {
        this.props.setSelectedCategory(category);
    }

    render() {
        const { categories, selectedCategory } = this.props;
        const { newCategoryName } = this.state;

        return (
            <section>
                <h2>Categories</h2>
                <div>
                    { categories.map(cat => {
                        const className = selectedCategory && cat.id === selectedCategory.id ? "active" : "";
                        return <div key={cat.id}
                                    onClick={this.selectCategory.bind(this, cat)}
                                    className={className}
                        >{cat.name}</div>;
                    })}
                </div>
                <div>
                    <input type="text"
                           value={newCategoryName}
                           placeholder={"New category..."}
                           onChange={this.newCatChanged}
                           onKeyPress={this.newCatKeyUp}
                    />
                </div>
            </section>
        );
    }
}

interface CategoriesCompOwnProps extends DispatchFromProps {
    categories: Category[];
    selectedCategory?: Category;
}
interface DispatchFromProps {
    loadCategory: (category: Category) => void;
    setSelectedCategory: (category: Category) => void;
}

const mapStateToProps = (state: GlobalState, ownProps: CategoriesCompOwnProps) => ({
    categories: getCategories(state),
    loadCategory: ownProps.loadCategory,
    setSelectedCategory: ownProps.setSelectedCategory,
    selectedCategory: getSelectedCategory(state)
});


const mapDispatchToProps = (dispatch: Dispatch) => ({
    loadCategory(category: Category) { dispatch(loadCategory(category)); },
    setSelectedCategory(category: Category) { dispatch(setSelectedCategory(category)); }
});

export default connect<CategoriesCompOwnProps, DispatchFromProps>(
    mapStateToProps,
    mapDispatchToProps
)(CategoriesComp);
