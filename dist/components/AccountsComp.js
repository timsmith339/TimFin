"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const account_module_1 = require("../redux/account-module");
const react_redux_1 = require("react-redux");
const comms_1 = require("../lib/comms");
const transaction_module_1 = require("../redux/transaction-module");
class AccountsComp extends React.Component {
    constructor(props) {
        super(props);
    }
    selectAccount(account) {
        this.props.setSelectedAccount(account);
        comms_1.getTransactions(account).then(transactions => this.props.loadTransactions(transactions));
    }
    render() {
        const { accounts, selectedAccount } = this.props;
        return React.createElement("div", null,
            React.createElement("h2", null, "Accounts"),
            React.createElement("div", null, accounts.map(account => {
                const className = selectedAccount && account.id === selectedAccount.id ? "active" : "";
                return React.createElement("div", { key: account.id, onClick: this.selectAccount.bind(this, account), className: className }, account.name);
            })));
    }
}
const mapStateToProps = (state, ownProps) => ({
    accounts: account_module_1.getAllAccounts(state),
    selectedAccount: account_module_1.getSelectedAccount(state),
    setSelectedAccount: ownProps.setSelectedAccount,
    loadTransactions: ownProps.loadTransactions
});
const mapDispatchToProps = (dispatch) => ({
    setSelectedAccount(account) { dispatch(account_module_1.setSelectedAccount(account)); },
    loadTransactions(transactions) { dispatch(transaction_module_1.loadTransactions(transactions)); }
});
exports.default = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(AccountsComp);
//# sourceMappingURL=AccountsComp.js.map