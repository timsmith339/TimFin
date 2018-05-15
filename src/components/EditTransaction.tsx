import * as React from "react";
import {Category, Transaction, TransactionType} from "../timfin-types";
import * as moment from "moment";

interface EditTransactionComps {
    transaction: Transaction;
    onSubmit: (newTransaction: Transaction) => void;
    onDelete: (newTransaction: Transaction) => void;
    categories: Category[];
    onClose: () => void;
}
interface EditTransactionState {
    transaction: Transaction;
}

class EditTransaction extends React.Component<EditTransactionComps, EditTransactionState> {
    constructor(props: EditTransactionComps) {
        super(props);
        const { transaction } = props;

        this.state = { transaction: Object.assign({}, transaction) };

        this.onSelectCategory = this.onSelectCategory.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeAmount = this.onChangeAmount.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
        this.handleDone = this.handleDone.bind(this);
        this.delete = this.delete.bind(this);
    }

    onSelectCategory(e: React.FormEvent<HTMLSelectElement>) {
        const copy = Object.assign({}, this.state.transaction, { category: JSON.parse(e.currentTarget.value) });
        this.setState({ transaction: copy});
    }
    onChangeDate(e: React.FormEvent<HTMLInputElement>) {
        const copy = Object.assign({}, this.state.transaction, { date: moment(e.currentTarget.value) });
        this.setState({ transaction: copy});
    }
    onChangeDescription(e: React.FormEvent<HTMLInputElement>) {
        const copy = Object.assign({}, this.state.transaction, { description: e.currentTarget.value });
        this.setState({ transaction: copy});
    }
    onChangeAmount(e: React.FormEvent<HTMLInputElement>) {
        const copy = Object.assign({}, this.state.transaction, { amount: Number(e.currentTarget.value) });
        this.setState({ transaction: copy});
    }
    onChangeType(e: React.FormEvent<HTMLButtonElement>) {
        const copy = Object.assign({}, this.state.transaction, { transaction_type: e.currentTarget.value as TransactionType });
        this.setState({ transaction: copy});
    }
    handleDone() {
        const { transaction: { id }, onSubmit } = this.props;
        onSubmit(Object.assign({}, this.state.transaction, { id }) as Transaction);
    }
    delete() {
        this.props.onDelete(this.props.transaction);
    }

    render() {
        const { category, timestamp, description, amount, transaction_type } = this.state.transaction;
        const { categories } = this.props;

        const debitButtonClass = transaction_type === "debit" ? "danger" : "default";
        const creditButtonClass = transaction_type === "credit" ? "success" : "default";

        return <div>
            <div className="form-group row">
                <div className="col-xs-2">
                    <select className="form-control form-control-sm"
                            value={JSON.stringify(category)}
                            onChange={this.onSelectCategory} >
                        <option value="">category...</option>
                        {
                            categories.map((cat) => {
                                return <option key={cat.id} value={JSON.stringify(cat)}>{cat.name}</option>;
                            })
                        }
                    </select>
                </div>
                <div className="col-xs-2">
                    <input className="form-control form-control-sm" type="date" value={timestamp.format("YYYY-MM-DD")} onChange={this.onChangeDate} />
                </div>
                <div className="col-xs-2">
                    <input className="form-control form-control-sm" type="text" placeholder="description" value={description} onChange={this.onChangeDescription} />
                </div>
                <div className="col-xs-2">
                    <span onChange={this.onChangeType}>
                         <button onClick={this.onChangeType} value="debit" className={`btn btn-${debitButtonClass} btn-sm`}> D </button>
                         <button onClick={this.onChangeType} value="credit" className={`btn btn-${creditButtonClass} btn-sm`}> C </button>
                    </span>
                </div>
                <div className="col-xs-2">
                    <input className="form-control form-control-sm" type="number" min="0" max="9999" value={amount} onChange={this.onChangeAmount} />
                </div>
            </div>
            <div>
                <button className={"btn btn-primary"} onClick={this.handleDone}>Done</button>
                <button className={"btn btn-danger"} onClick={this.props.onClose}>cancel</button>
            </div>
            <div>
                <div onClick={this.delete}>Delete</div>
            </div>
        </div>;
    }
}

export default EditTransaction;
