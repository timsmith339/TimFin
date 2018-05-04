"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_redux_1 = require("react-redux");
const comms_1 = require("../lib/comms");
const category_module_1 = require("../redux/category-module");
class CategoriesComp extends React.Component {
    constructor(props) {
        super(props);
        this.state = { newCategoryName: "" };
        this.newCatChanged = this.newCatChanged.bind(this);
        this.newCatKeyUp = this.newCatKeyUp.bind(this);
        this.submitNewCategory = this.submitNewCategory.bind(this);
    }
    newCatChanged(e) {
        const newCategoryName = e.currentTarget.value;
        this.setState({ newCategoryName });
    }
    submitNewCategory() {
        const { newCategoryName } = this.state;
        comms_1.addCategory(newCategoryName).then(newCategory => {
            this.props.loadCategory(newCategory);
        });
        this.setState({ newCategoryName: "" });
    }
    newCatKeyUp(e) {
        if (e.which === 13) {
            this.submitNewCategory();
        }
    }
    selectCategory(category) {
        this.props.setSelectedCategory(category);
    }
    render() {
        const { categories, selectedCategory } = this.props;
        const { newCategoryName } = this.state;
        return (React.createElement("section", null,
            React.createElement("h2", null, "Categories"),
            React.createElement("div", null, categories.map(cat => {
                const className = selectedCategory && cat.id === selectedCategory.id ? "active" : "";
                return React.createElement("div", { key: cat.id, onClick: this.selectCategory.bind(this, cat), className: className }, cat.name);
            })),
            React.createElement("div", null,
                React.createElement("input", { type: "text", value: newCategoryName, placeholder: "New category...", onChange: this.newCatChanged, onKeyPress: this.newCatKeyUp }))));
    }
}
const mapStateToProps = (state, ownProps) => ({
    categories: category_module_1.getCategories(state),
    loadCategory: ownProps.loadCategory,
    setSelectedCategory: ownProps.setSelectedCategory,
    selectedCategory: category_module_1.getSelectedCategory(state)
});
const mapDispatchToProps = (dispatch) => ({
    loadCategory(category) { dispatch(category_module_1.loadCategory(category)); },
    setSelectedCategory(category) { dispatch(category_module_1.setSelectedCategory(category)); }
});
exports.default = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(CategoriesComp);
//# sourceMappingURL=CategoriesComp.js.map