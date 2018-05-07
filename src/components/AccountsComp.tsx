import * as React from "react";
import { GlobalState } from "../redux/store";
import { getAllAccounts, getSelectedAccount, setSelectedAccount } from "../redux/account-module";
import { connect} from "react-redux";
import {Account, Transaction} from "../timfin-types";
import { Dispatch } from "redux";
import {getTransactions, TransactionSearchCriteria} from "../lib/comms";
import {loadTransactions, setTransactionSearchCriteria} from "../redux/transaction-module";

class AccountsComp extends React.Component<AccountsCompOwnProps, {}> {
    constructor(props: AccountsCompOwnProps) {
        super(props);

        this.selectAccount = this.selectAccount.bind(this);
    }

    selectAccount(account: Account) {
        const { transactionSearchCriteria } = this.props;
        this.props.setSelectedAccount(account);
        const criteria: TransactionSearchCriteria = Object.assign({}, transactionSearchCriteria, { account });
        getTransactions(criteria).then(transactions => this.props.loadTransactions(transactions));
        this.props.setSearchCritiera(criteria);
    }

    render() {
        const { accounts, selectedAccount } = this.props;

        return <section>
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
        </section>;
    }
}

interface AccountsCompOwnProps extends DispatchFromProps {
    accounts: Account[];
    selectedAccount?: Account;
    transactionSearchCriteria: TransactionSearchCriteria;
}

interface DispatchFromProps {
    setSelectedAccount: (account: Account) => void;
    loadTransactions: (transactions: Transaction[]) => void;
    setSearchCritiera: (criteria: TransactionSearchCriteria) => void;
}

const mapStateToProps = (state: GlobalState, ownProps: AccountsCompOwnProps) => ({
    accounts: getAllAccounts(state),
    selectedAccount: getSelectedAccount(state),
    setSelectedAccount: ownProps.setSelectedAccount,
    loadTransactions: ownProps.loadTransactions,
    setSearchCritiera: ownProps.setSearchCritiera,
    transactionSearchCriteria: state.transactions.searchCriteria
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    setSelectedAccount(account: Account) { dispatch(setSelectedAccount(account)); },
    loadTransactions(transactions: Transaction[]) { dispatch(loadTransactions(transactions)); },
    setSearchCritiera(criteria: TransactionSearchCriteria) { dispatch(setTransactionSearchCriteria(criteria)); }
});

export default connect<AccountsCompOwnProps, DispatchFromProps>(
    mapStateToProps,
    mapDispatchToProps
)(AccountsComp);
