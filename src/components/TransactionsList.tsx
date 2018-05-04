import * as React from "react";
import {Transaction, Account} from "../timfin-types";
import {GlobalState} from "../redux/store";
import {getTransactionsReversed, loadTransactions} from "../redux/transaction-module";
import {connect} from "react-redux";
import * as moment from "moment";
import * as tz from "moment-timezone";
import {getSelectedAccount} from "../redux/account-module";
import {Dispatch} from "redux";
import {getTransactions} from "../lib/comms";

interface TransactionsListCompProps extends TransactionsListCompOwnProps, TransactionsListDispatchProps {}

interface TransactionsListCompOwnProps {
    transactions: Transaction[];
    selectedAccount?: Account;
}
interface TransactionsListDispatchProps {
    loadTransactions: (transactions: Transaction[]) => void;
}

class TransactionsList extends React.Component<TransactionsListCompProps, { tz: string; }> {
    constructor(props: TransactionsListCompProps) {
        super(props);

        this.state = {
            tz: tz.tz.guess()
        };
    }

    componentWillMount() {
        const { selectedAccount } = this.props;
        if (selectedAccount) {
            getTransactions(selectedAccount).then(transactions => this.props.loadTransactions(transactions));
        }
    }

    render() {
        const { transactions } = this.props;

        return <div className={"transactions-list"}>
            <h2>Transactions</h2>
            <div>
                <table>
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Desc</th>
                        <th>Amount</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        transactions.map(({ id, amount, timestamp, category, description }) => {
                            const date = moment(timestamp).tz(this.state.tz).format("YY/M/D");
                            return <tr key={id}>
                                <td>{ date }</td>
                                <td>{ category.name }</td>
                                <td>{ description }</td>
                                <td>{ amount }</td>
                            </tr>;
                        })
                    }
                    </tbody>
                </table>
            </div>
        </div>;
    }
}

const mapStateToProps = (state: GlobalState) => ({
    transactions: getTransactionsReversed(state),
    selectedAccount: getSelectedAccount(state)
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
    loadTransactions(transactions: Transaction[]) { dispatch(loadTransactions(transactions)); }
});

export default connect<TransactionsListCompOwnProps, TransactionsListDispatchProps>(
    mapStateToProps,
    mapDispatchToProps
)(TransactionsList);
