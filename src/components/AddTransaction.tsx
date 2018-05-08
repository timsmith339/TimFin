import * as React from "react";
import * as moment from "moment";
import * as tz from "moment-timezone";
import {Account, Category, Transaction, TransactionType} from "../timfin-types";
import {GlobalState} from "../redux/store";
import {getCategories, getSelectedCategory} from "../redux/category-module";
import {connect} from "react-redux";
import {getSelectedAccount} from "../redux/account-module";
import {postNewTransaction} from "../lib/comms";
import {Dispatch} from "redux";
import {loadTransaction} from "../redux/transaction-module";

interface AddTransactionState {
    timezone: string;
    transaction_type: TransactionType;
    category: Category;
    date: moment.Moment;
    description: string;
    amount: number;
}

class AddTransaction extends React.Component<AddTransactionCompProps, AddTransactionState> {
    private catSelect: HTMLSelectElement;

    constructor(props: AddTransactionCompProps) {
        super(props);

        this.state = {
            timezone: tz.tz.guess(),
            transaction_type: "debit",
            category: props.selectedCategory ? props.selectedCategory : null,
            date: moment().local(),
            description: "",
            amount: 0.00
        };

        this.submitTransaction = this.submitTransaction.bind(this);
        this.onSelectCategory = this.onSelectCategory.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeAmount = this.onChangeAmount.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
    }

    componentWillReceiveProps(nextProps: PropsFromState) {
        if (nextProps.selectedCategory !== this.props.selectedCategory) {
            this.setState({ category: nextProps.selectedCategory });
        }
    }

    submitTransaction() {
        const { category, date, description, amount, transaction_type } = this.state;
        const newTransaction: Transaction = {
            transaction_type,
            timestamp: date,
            amount,
            description,
            account: this.props.selectedAccount,
            category
        };
        postNewTransaction(newTransaction).then(transaction => {
            this.props.loadTransaction(transaction);
        });
    }

    onSelectCategory(e: React.FormEvent<HTMLSelectElement>) {
        this.setState({ category: JSON.parse(e.currentTarget.value) });
    }
    onChangeDate(e: React.FormEvent<HTMLInputElement>) {
        this.setState({ date: moment(e.currentTarget.value) });
    }
    onChangeDescription(e: React.FormEvent<HTMLInputElement>) {
        this.setState({ description: e.currentTarget.value });
    }
    onChangeAmount(e: React.FormEvent<HTMLInputElement>) {
        this.setState({ amount: Number(e.currentTarget.value) });
    }
    onChangeType(e: React.FormEvent<HTMLInputElement>) {
        /* I did (e.target as any) because .value doesn't exist on this interface.  I have the wrong event type,
           and I'm not sure what it's supposed to be*/
        this.setState({ transaction_type: (e.target as any).value });
    }

    render() {
        const { categories } = this.props;
        const { category, date, description, amount, transaction_type } = this.state;
        return <section>
            <h2>Add Transaction</h2>
            <div>
                <select ref={ref => this.catSelect = ref}
                        value={JSON.stringify(category)}
                        onChange={this.onSelectCategory} >
                    <option value="">category...</option>
                    {
                        categories.map((cat) => {
                            return <option key={cat.id} value={JSON.stringify(cat)}>{cat.name}</option>;
                        })
                    }
                </select>
                <input type="date" value={date.format("YYYY-MM-DD")} onChange={this.onChangeDate} />
                <input type="text" placeholder="description" value={description} onChange={this.onChangeDescription} />
                <span onChange={this.onChangeType}>
                    <label><span>D </span><input type="radio"
                                                 name="transaction_type"
                                                 value="debit"
                                                 defaultChecked={transaction_type === "debit"}/></label>
                    <label><span>C </span><input type="radio"
                                                 name="transaction_type"
                                                 value="credit"
                                                 defaultChecked={transaction_type === "credit"} /></label>
                </span>
                <input type="number" min="0" max="9999" value={amount} onChange={this.onChangeAmount} />
                <button onClick={this.submitTransaction}>GO</button>
            </div>
        </section>;
    }
}

interface AddTransactionCompProps extends PropsFromState, PropsFromDispatch {}

interface PropsFromState {
    categories: Category[];
    selectedCategory?: Category;
    selectedAccount: Account;
}
interface PropsFromDispatch {
    loadTransaction: (transaction: Transaction) => void;
}

const mapStateToProps = (state: GlobalState) => ({
    categories: getCategories(state),
    selectedCategory: getSelectedCategory(state),
    selectedAccount: getSelectedAccount(state)
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
    loadTransaction(transaction: Transaction) { dispatch(loadTransaction(transaction)); },
});

export default connect<PropsFromState, PropsFromDispatch>(
    mapStateToProps,
    mapDispatchToProps
)(AddTransaction);
