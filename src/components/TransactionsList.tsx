import * as React from "react";
import {Transaction, Account, Category} from "../timfin-types";
import {GlobalState} from "../redux/store";
import {
    clearSelectedTransaction,
    getSelectedTransaction,
    getTransactionsReversed, loadTransaction,
    loadTransactions, removeTransaction,
    setSelectedTransaction, setTransactionSearchCriteria
} from "../redux/transaction-module";
import {connect} from "react-redux";
import * as moment from "moment";
import * as tz from "moment-timezone";
import {getSelectedAccount} from "../redux/account-module";
import {Dispatch} from "redux";
import {
    deleteTransaction,
    getTransactions,
    TransactionSearchCriteria,
    updateTransaction
} from "../lib/comms";
import * as Modal from "react-modal";
import EditTransaction from "./EditTransaction";
import {getCategories, getSelectedCategory} from "../redux/category-module";

interface TransactionsListCompProps extends TransactionsListCompOwnProps, TransactionsListDispatchProps {}

interface TransactionsListCompOwnProps {
    transactions: Transaction[];
    selectedAccount?: Account;
    selectedTransaction?: Transaction;
    selectedCategory?: Category;
    transactionSearchCriteria: TransactionSearchCriteria;
    categories: Category[];
}
interface TransactionsListDispatchProps {
    loadTransaction: (transaction: Transaction) => void;
    loadTransactions: (transactions: Transaction[]) => void;
    setSelectedTransaction: (transaction: Transaction) => void;
    clearSelectedTransaction: () => void;
    removeTransaction: (transaction: Transaction) => void;
    setTransactionSearchCriteria: (criteria: TransactionSearchCriteria) => void;
}

interface TransactionListState {
    tz: string;
    modalOpen: boolean;
}

class TransactionsList extends React.Component<TransactionsListCompProps, TransactionListState> {
    constructor(props: TransactionsListCompProps) {
        super(props);

        this.state = {
            tz: tz.tz.guess(),
            modalOpen: false
        };

        this.changedStartDate = this.changedStartDate.bind(this);
        this.changedEndDate = this.changedEndDate.bind(this);
        this.openEditTransactionModal = this.openEditTransactionModal.bind(this);
        this.closeEditModal = this.closeEditModal.bind(this);
        this.onModalSubmit = this.onModalSubmit.bind(this);
        this.deleteTransaction = this.deleteTransaction.bind(this);
        this.buildRow = this.buildRow.bind(this);
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
        this.props.setSelectedTransaction(transaction);
        // const { selectedTransaction } = this.props;
        // if (selectedTransaction && selectedTransaction.id === transaction.id) {
        //     this.props.clearSelectedTransaction();
        // } else {
        //     this.props.setSelectedTransaction(transaction);
        // }
    }

    openEditTransactionModal() {
        this.setState({ modalOpen: true });
    }
    closeEditModal() {
        this.setState({ modalOpen: false });
    }
    onModalSubmit(transaction: Transaction) {
        this.setState({ modalOpen: false });
        updateTransaction(transaction).then(newTransaction => {
            this.props.loadTransaction(newTransaction);
        });
    }
    deleteTransaction(transaction: Transaction) {
        this.setState({ modalOpen: false });
        deleteTransaction(transaction)
            .then(() => {
                this.props.removeTransaction(transaction);
            })
            .catch(error => {
                alert("Error deleting transaction..." + error.toString());
            });
    }

    buildRow(transaction: Transaction) {
        const { selectedCategory } = this.props;
        const { id, amount, timestamp, category, description } = transaction;
        const date = moment(timestamp)
            .tz(this.state.tz)
            .format("MMM D");
        const className = `transaction ${transaction.category.id === selectedCategory.id ? 'transaction--cat-active' : ''}`;

        return <tr key={id} onClick={this.setSelectedTransaction.bind(this, transaction)}
                   className={className}>
            <td onClick={this.openEditTransactionModal.bind(this, transaction)}>📝</td>
            <td className={""}>{ date }</td>
            <td className={""}>{ category.name }</td>
            <td className={""}>{ description }</td>
            <td className={`transaction--${transaction.transaction_type}`}>{ amount }</td>
        </tr>;
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
        const { transactions, selectedTransaction, categories } = this.props;
        const { startDate, endDate } = this.props.transactionSearchCriteria;

        return <React.Fragment>
            <section>
                <h2>Transactions</h2>
                <div className="form-group row">
                    <div className="col-xs-2">
                        <input className="form-control form-control-sm" type={"date"} value={startDate.format("YYYY-MM-DD")} onChange={this.changedStartDate} />
                    </div>
                    <div className="col-xs-2">
                        <input className="form-control form-control-sm" type={"date"} value={endDate.format("YYYY-MM-DD")} onChange={this.changedEndDate} />
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <td> </td>
                            <td>Date</td>
                            <td>Category</td>
                            <td>Desc</td>
                            <td>Amount</td>
                        </tr>
                    </thead>
                    <tbody className={"transactions-list"}>
                        {
                            transactions.map((transaction) => this.buildRow(transaction))
                        }
                    </tbody>
                </table>
            </section>
            <Modal isOpen={this.state.modalOpen}
                   onRequestClose={this.closeEditModal}
                   ariaHideApp={false}>
                   <EditTransaction transaction={selectedTransaction}
                                    categories={categories}
                                    onSubmit={this.onModalSubmit}
                                    onClose={this.closeEditModal}
                                    onDelete={this.deleteTransaction} />
            </Modal>
        </React.Fragment>;
    }
}

const mapStateToProps = (state: GlobalState) => ({
    transactions: getTransactionsReversed(state),
    selectedAccount: getSelectedAccount(state),
    selectedTransaction: getSelectedTransaction(state),
    transactionSearchCriteria: state.transactions.searchCriteria,
    categories: getCategories(state),
    selectedCategory: getSelectedCategory(state)
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
    loadTransaction(transaction: Transaction) { dispatch(loadTransaction(transaction)); },
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
