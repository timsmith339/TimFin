import * as React from "react";
import {GlobalState} from "../redux/store";
import {connect} from "react-redux";
import {Category, TransactionStatistics} from "../timfin-types";

class StatisticsComp extends React.Component<StatisticsCompProps, {}> {
    render() {
        const { categories, stats: { count, total, categorySubtotals } } = this.props;

        return <section className="statistics">
            <h3>Stats</h3>
            <div>
                <div className="statistics__group">
                    <div>
                        <span className="statistics__title">Count</span><span>{count}</span>
                    </div>
                    <div>
                        <span className="statistics__title">Total</span><span>{total}</span>
                    </div>
                </div>
                <div className="statistics__group">
                    { Object.keys(categorySubtotals).map(categoryId => {
                        const category = categories.find(c => c.id === categoryId);
                        return <div>
                            <span className="statistics__title">{category.name}</span>
                            <span>{categorySubtotals[categoryId]}</span>
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
    stats: state.transactions.stats,
    categories: state.categories.categories
});

export default connect<StateMappedProps, void>(mapStateToProps, null)(StatisticsComp);
