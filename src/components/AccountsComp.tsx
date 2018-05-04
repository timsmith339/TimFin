import * as React from "react";
import { GlobalState } from "../redux/store";
import { getAllAccounts, getSelectedAccount, setSelectedAccount } from "../redux/account-module";
import { connect} from "react-redux";
import {Account, Transaction} from "../timfin-types";
import { Dispatch } from "redux";
import {getTransactions} from "../lib/comms";
import {loadTransactions} from "../redux/transaction-module";

class AccountsComp extends React.Component<AccountsCompOwnProps, {}> {
    constructor(props: AccountsCompOwnProps) {
        super(props);
    }

    selectAccount(account: Account) {
        this.props.setSelectedAccount(account);
        getTransactions(account).then(transactions => this.props.loadTransactions(transactions));
    }

    render() {
        const { accounts, selectedAccount } = this.props;

        return <div>
            <h2>Accounts</h2>
            <div>
                { accounts.map(account => {
                    const className = selectedAccount && account.id === selectedAccount.id ? "active" : "";
                    return <div key={account.id}
                                onClick={this.selectAccount.bind(this, account)}
                                className={className}
                    >{account.name}</div>;
                })}
            </div>
        </div>;
    }
}

interface AccountsCompOwnProps extends DispatchFromProps {
    accounts: Account[];
    selectedAccount?: Account;
}

interface DispatchFromProps {
    setSelectedAccount: (account: Account) => void;
    loadTransactions: (transactions: Transaction[]) => void;
}

const mapStateToProps = (state: GlobalState, ownProps: AccountsCompOwnProps) => ({
    accounts: getAllAccounts(state),
    selectedAccount: getSelectedAccount(state),
    setSelectedAccount: ownProps.setSelectedAccount,
    loadTransactions: ownProps.loadTransactions
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    setSelectedAccount(account: Account) { dispatch(setSelectedAccount(account)); },
    loadTransactions(transactions: Transaction[]) { dispatch(loadTransactions(transactions)); }
});

export default connect<AccountsCompOwnProps, DispatchFromProps>(
    mapStateToProps,
    mapDispatchToProps
)(AccountsComp);
