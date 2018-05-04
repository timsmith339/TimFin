"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const moment = require("moment");
const tz = require("moment-timezone");
const category_module_1 = require("../redux/category-module");
const react_redux_1 = require("react-redux");
const account_module_1 = require("../redux/account-module");
const comms_1 = require("../lib/comms");
const transaction_module_1 = require("../redux/transaction-module");
class AddTransaction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timezone: tz.tz.guess(),
            category: props.selectedCategory ? props.selectedCategory : null,
            date: moment(Date()).format("YYYY-MM-DD"),
            description: "",
            amount: 0.00
        };
        this.submitTransaction = this.submitTransaction.bind(this);
        this.onSelectCategory = this.onSelectCategory.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeAmount = this.onChangeAmount.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedCategory !== this.props.selectedCategory) {
            this.setState({ category: nextProps.selectedCategory });
        }
    }
    submitTransaction() {
        const { category, date, description, amount } = this.state;
        const newTransaction = {
            timestamp: new Date(moment(date).tz(this.state.timezone).toString()),
            amount,
            description,
            account: this.props.selectedAccount,
            category
        };
        comms_1.postNewTransaction(newTransaction).then(transaction => {
            this.props.loadTransaction(transaction);
        });
    }
    onSelectCategory(e) {
        this.setState({ category: JSON.parse(e.currentTarget.value) });
    }
    onChangeDate(e) {
        this.setState({ date: e.currentTarget.value });
    }
    onChangeDescription(e) {
        this.setState({ description: e.currentTarget.value });
    }
    onChangeAmount(e) {
        this.setState({ amount: Number(e.currentTarget.value) });
    }
    render() {
        const { categories } = this.props;
        const { category, date, description, amount } = this.state;
        return React.createElement("section", null,
            React.createElement("h2", null, "Add Transaction"),
            React.createElement("div", null,
                React.createElement("select", { ref: ref => this.catSelect = ref, value: JSON.stringify(category), onChange: this.onSelectCategory },
                    React.createElement("option", { value: "" }, "category..."),
                    categories.map((cat) => {
                        return React.createElement("option", { key: cat.id, value: JSON.stringify(cat) }, cat.name);
                    })),
                React.createElement("input", { type: "date", value: date, onChange: this.onChangeDate }),
                React.createElement("input", { type: "text", placeholder: "description", value: description, onChange: this.onChangeDescription }),
                React.createElement("input", { type: "number", min: "0.01", step: "0.01", max: "9999", value: amount, onChange: this.onChangeAmount }),
                React.createElement("button", { onClick: this.submitTransaction }, "GO")));
    }
}
const mapStateToProps = (state) => ({
    categories: category_module_1.getCategories(state),
    selectedCategory: category_module_1.getSelectedCategory(state),
    selectedAccount: account_module_1.getSelectedAccount(state)
});
const mapDispatchToProps = (dispatch) => ({
    loadTransaction(transaction) { dispatch(transaction_module_1.loadTransaction(transaction)); },
});
exports.default = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(AddTransaction);
//# sourceMappingURL=AddTransaction.js.map