import * as React from "react";
import {connect} from "react-redux";
import {GlobalState} from "../redux/store";
import {Category} from "../timfin-types";
import {addCategory, updateCategory} from "../lib/comms";
import {getCategories, getSelectedCategory, loadCategory, setSelectedCategory} from "../redux/category-module";
import {Dispatch} from "redux";
import * as Modal from "react-modal";
import {MouseEvent} from "react";
import EditCategory from "./EditCategory";

interface CategoriesCompState {
    newCategoryName: string;
    modalOpen: boolean;
}

class CategoriesComp extends React.Component<CategoriesCompOwnProps, CategoriesCompState> {
    constructor(props: CategoriesCompOwnProps) {
        super(props);

        this.state = { newCategoryName: "", modalOpen: false };

        this.newCatChanged = this.newCatChanged.bind(this);
        this.newCatKeyUp = this.newCatKeyUp.bind(this);
        this.submitNewCategory = this.submitNewCategory.bind(this);
        this.openEditModal = this.openEditModal.bind(this);
        this.closeEditModal = this.closeEditModal.bind(this);
        this.onModalSubmit = this.onModalSubmit.bind(this);
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

    openEditModal(e: MouseEvent<HTMLSpanElement>) {
        this.setState({ modalOpen: true });
    }
    closeEditModal() {
        this.setState({ modalOpen: false });
    }
    onModalSubmit(category: Category) {
        this.setState({ modalOpen: false });
        updateCategory(category).then(newCategory => {
            this.props.loadCategory(newCategory);
        });
    }

    render() {
        const { categories, selectedCategory } = this.props;
        const { newCategoryName, modalOpen } = this.state;

        return (
            <React.Fragment>
                <section>
                    <h2>Categories</h2>
                    <table>
                        <thead>
                        <tr>
                            <td> </td>
                            <td>Name</td>
                            <td>Budget</td>
                        </tr>
                        </thead>
                        <tbody>
                        { categories.map(cat => {
                            const className = selectedCategory && cat.id === selectedCategory.id ? "active" : "";
                            return <tr key={cat.id}
                                        onClick={this.selectCategory.bind(this, cat)}
                                        className={className}>
                                    <td onClick={this.openEditModal}>📝</td>
                                    <td> {cat.name} </td>
                                    <td> {cat.budget || "-"} </td>
                                </tr>;
                        })}
                        </tbody>
                    </table>
                    <div className="form-group">
                        <input type="text"
                               className={"form-control form-control-sm"}
                               value={newCategoryName}
                               placeholder={"New category..."}
                               onChange={this.newCatChanged}
                               onKeyPress={this.newCatKeyUp}
                        />
                    </div>
                </section>
                <Modal isOpen={modalOpen}
                       onRequestClose={this.closeEditModal}>
                    <EditCategory category={selectedCategory}
                                  onSubmit={this.onModalSubmit}
                                  onClose={this.closeEditModal}/>
                </Modal>
            </React.Fragment>
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
