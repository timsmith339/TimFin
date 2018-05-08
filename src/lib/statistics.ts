import {CategorySubtotal, Transaction, TransactionStatistics} from "../timfin-types";

export default class Statistics {
    static calculateStats(transactions: Transaction[]): TransactionStatistics {
        return {
            count: transactions.length,
            total: transactions.reduce(Statistics.totalReducer, 0),
            categorySubtotals: transactions.reduce(Statistics.categorySubtotalsReducer, {})
        };
    }

    private static totalReducer(total: number, transaction: Transaction): number {
        const { amount, transaction_type } = transaction;
        return (transaction_type === "credit") ? total + amount : total - amount;
    }
    private static categorySubtotalsReducer(total: CategorySubtotal, transaction: Transaction) {
        const { amount, transaction_type, category } = transaction;
        return Object.assign({}, total, {
            [category.id]: (total[category.id] || 0) + (amount * (transaction_type === "credit" ? 1 : -1))
        });
    }
}
