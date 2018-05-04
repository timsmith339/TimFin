"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const transaction_module_1 = require("../redux/transaction-module");
const react_redux_1 = require("react-redux");
const moment = require("moment");
const tz = require("moment-timezone");
const account_module_1 = require("../redux/account-module");
const comms_1 = require("../lib/comms");
class TransactionsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tz: tz.tz.guess()
        };
    }
    componentWillMount() {
        const { selectedAccount } = this.props;
        if (selectedAccount) {
            comms_1.getTransactions(selectedAccount).then(transactions => this.props.loadTransactions(transactions));
        }
    }
    render() {
        const { transactions } = this.props;
        return React.createElement("div", { className: "transactions-list" },
            React.createElement("h2", null, "Transactions"),
            React.createElement("div", null,
                React.createElement("table", null,
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Date"),
                            React.createElement("th", null, "Category"),
                            React.createElement("th", null, "Desc"),
                            React.createElement("th", null, "Amount"))),
                    React.createElement("tbody", null, transactions.map(({ id, amount, timestamp, category, description }) => {
                        const date = moment(timestamp).tz(this.state.tz).format("YY/M/D");
                        return React.createElement("tr", { key: id },
                            React.createElement("td", null, date),
                            React.createElement("td", null, category.name),
                            React.createElement("td", null, description),
                            React.createElement("td", null, amount));
                    })))));
    }
}
const mapStateToProps = (state) => ({
    transactions: transaction_module_1.getTransactionsReversed(state),
    selectedAccount: account_module_1.getSelectedAccount(state)
});
const mapDispatchToProps = (dispatch) => ({
    loadTransactions(transactions) { dispatch(transaction_module_1.loadTransactions(transactions)); }
});
exports.default = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(TransactionsList);
//# sourceMappingURL=TransactionsList.js.map