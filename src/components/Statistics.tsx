import * as React from "react";
import {GlobalState} from "../redux/store";
import {connect} from "react-redux";
import {Category, Transaction, TransactionStatistics} from "../timfin-types";
import {getTransactionStats} from "../redux/transaction-module";
import Statistics from "../lib/statistics";
import ProgressBar from "./ProgressBar";

class StatisticsComp extends React.Component<StatisticsCompProps, {}> {
    render() {
        const { categories, stats: { count, total, categorySubtotals, categoryIncome, categoryExpenses } } = this.props;

        const totalReducer = (total: number, txn: Transaction) => txn.amount + total;
        const totalExpense = categoryExpenses.reduce(totalReducer, 0);
        const totalIncome = categoryIncome.reduce(totalReducer, 0);

        return <section className="statistics">
            <h3>Stats</h3>
            <div>
                <div className="statistics__group">
                    <div>
                        <span className="statistics__title"># Transactions </span><span>{count}</span>
                    </div>
                    <div>
                        <span className="statistics__title">Total Expenses </span><span>{totalExpense}</span>
                    </div>
                    <div>
                        <span className="statistics__title">Total Income </span><span>{totalIncome}</span>
                    </div>
                    <div>
                        <span className="statistics__title">Grand Total </span><span>{total}</span>
                    </div>
                </div>
                <div>
                    { Object.keys(categorySubtotals).map(categoryId => {
                        const category = categories.find(c => c.id === categoryId);
                        const current = categorySubtotals[categoryId];
                        return <div className="statistics__group" key={`cat-stat-${category.id}`}>
                            <span className="statistics__title">{category.name}</span>
                            <div>
                                <span>total: {current}</span>
                                {category.budget && category.budget > 0 &&
                                <ProgressBar total={category.budget} current={current}/>
                                }
                            </div>
                        </div>;
                    })}
                </div>
            </div>
        </section>;
    }
}

interface StatisticsCompProps extends StateMappedProps {}

interface StateMappedProps {
    stats: TransactionStatistics;
    categories: Category[];
}

const mapStateToProps = (state: GlobalState) => ({
    stats: getTransactionStats(state),
    categories: state.categories.categories
});

export default connect<StateMappedProps, void>(mapStateToProps, null)(StatisticsComp);
