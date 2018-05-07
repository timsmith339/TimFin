import * as React from "react";
import {Transaction, Account} from "../timfin-types";
import {GlobalState} from "../redux/store";
import {
    clearSelectedTransaction,
    getSelectedTransaction,
    getTransactionsReversed,
    loadTransactions, removeTransaction,
    setSelectedTransaction, setTransactionSearchCriteria
} from "../redux/transaction-module";
import {connect} from "react-redux";
import * as moment from "moment";
import * as tz from "moment-timezone";
import {getSelectedAccount} from "../redux/account-module";
import {Dispatch} from "redux";
import {deleteTransaction, getTransactions, TransactionSearchCriteria} from "../lib/comms";

interface TransactionsListCompProps extends TransactionsListCompOwnProps, TransactionsListDispatchProps {}

interface TransactionsListCompOwnProps {
    transactions: Transaction[];
    selectedAccount?: Account;
    selectedTransaction?: Transaction;
    transactionSearchCriteria: TransactionSearchCriteria;
}
interface TransactionsListDispatchProps {
    loadTransactions: (transactions: Transaction[]) => void;
    setSelectedTransaction: (transaction: Transaction) => void;
    clearSelectedTransaction: () => void;
    removeTransaction: (transaction: Transaction) => void;
    setTransactionSearchCriteria: (criteria: TransactionSearchCriteria) => void;
}

interface TransactionListState {
    tz: string;
}

class TransactionsList extends React.Component<TransactionsListCompProps, TransactionListState> {
    constructor(props: TransactionsListCompProps) {
        super(props);

        this.state = {
            tz: tz.tz.guess(),
        };

        this.changedStartDate = this.changedStartDate.bind(this);
        this.changedEndDate = this.changedEndDate.bind(this);
    }

    componentWillMount() {
        const { selectedAccount } = this.props;
        if (selectedAccount) {
            const criteria: TransactionSearchCriteria = {
                account: selectedAccount
            };
            getTransactions(criteria).then(transactions => this.props.loadTransactions(transactions));
        }
    }

    setSelectedTransaction(transaction: Transaction) {
        const { selectedTransaction } = this.props;

        if (selectedTransaction && selectedTransaction.id === transaction.id) {
            this.props.clearSelectedTransaction();
            return;
        }

        this.props.setSelectedTransaction(transaction);
    }

    deleteTransaction(transaction: Transaction) {
        deleteTransaction(transaction)
            .then(() => {
                this.props.removeTransaction(transaction);
            })
            .catch(error => {
                alert("Error deleting transaction..." + error.toString());
            });
    }

    buildRow(transaction: Transaction) {
        const { selectedTransaction } = this.props;
        const { id, amount, timestamp, category, description } = transaction;
        const date = moment(timestamp)
            .tz(this.state.tz)
            .format("MMM DD");
        const isSelectedTransaction = selectedTransaction ? transaction.id === selectedTransaction.id : false;

        return <React.Fragment key={id}>
            <tr onClick={this.setSelectedTransaction.bind(this, transaction)}
                className={`transactions-list--row transaction`}>
                <td className={"transactions-list--column"}>{ date }</td>
                <td className={"transactions-list--column"}>{ category.name }</td>
                <td className={"transactions-list--column"}>{ description }</td>
                <td className={`transactions-list--column transaction--${transaction.transaction_type}`}>{ amount }</td>
            </tr>
            {isSelectedTransaction &&
            <tr>
                <td>
                    <span onClick={this.deleteTransaction.bind(this, transaction)}>DELETE</span>
                </td>
            </tr>
            }
        </React.Fragment>;
    }

    changedStartDate(e: React.FormEvent<HTMLInputElement>) {
        const criteria = Object.assign({}, this.props.transactionSearchCriteria, { startDate: moment(e.currentTarget.value) });
        this.props.setTransactionSearchCriteria(criteria);
        getTransactions(criteria).then(transactions => this.props.loadTransactions(transactions));
    }
    changedEndDate(e: React.FormEvent<HTMLInputElement>) {
        const criteria = Object.assign({}, this.props.transactionSearchCriteria, { endDate: moment(e.currentTarget.value) });
        this.props.setTransactionSearchCriteria(criteria);
        getTransactions(criteria).then(transactions => this.props.loadTransactions(transactions));
    }

    render() {
        const { transactions } = this.props;
        const { startDate, endDate } = this.props.transactionSearchCriteria;

        return <section>
            <h2>Transactions</h2>
            <div>
                <input type={"date"} value={startDate.format("YYYY-MM-DD")} onChange={this.changedStartDate} />
                <input type={"date"} value={endDate.format("YYYY-MM-DD")} onChange={this.changedEndDate} />
            </div>
            <table>
                <tbody className={"transactions-list"}>
                    {
                        transactions.map((transaction) => this.buildRow(transaction))
                    }
                </tbody>
            </table>
        </section>;
    }
}

const mapStateToProps = (state: GlobalState) => ({
    transactions: getTransactionsReversed(state),
    selectedAccount: getSelectedAccount(state),
    selectedTransaction: getSelectedTransaction(state),
    transactionSearchCriteria: state.transactions.searchCriteria
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
    loadTransactions(transactions: Transaction[]) { dispatch(loadTransactions(transactions)); },
    setSelectedTransaction(transaction: Transaction) { dispatch(setSelectedTransaction(transaction)); },
    clearSelectedTransaction() { dispatch(clearSelectedTransaction()); },
    removeTransaction(transaction: Transaction) { dispatch(removeTransaction(transaction)); },
    setTransactionSearchCriteria(criteria: TransactionSearchCriteria) { dispatch(setTransactionSearchCriteria(criteria)); }
});

export default connect<TransactionsListCompOwnProps, TransactionsListDispatchProps>(
    mapStateToProps,
    mapDispatchToProps
)(TransactionsList);
