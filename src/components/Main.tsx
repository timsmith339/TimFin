import * as React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import CategoriesComp from "./CategoriesComp";
import { getAccounts, getCategories } from "../lib/comms";
import { Category, Account } from "../timfin-types";
import { loadCategories } from "../redux/category-module";
import {getSelectedAccount, loadAccounts} from "../redux/account-module";
import AccountsComp from "./AccountsComp";
import TransactionsList from "./TransactionsList";
import AddTransaction from "./AddTransaction";
import {GlobalState} from "../redux/store";
import StatisticsComp from "./Statistics";

class Main extends React.Component<MainCompProps, {}> {
    constructor(props: MainCompProps) {
        super(props);
    }

    componentWillMount() {
        getCategories().then(categories => {
            this.props.loadCategories(categories);
        });
        getAccounts().then((accounts) => {
            this.props.loadAccounts(accounts);
        });
    }

    render() {
        const { selectedAccount } = this.props;

        return (
            <div className={"main row"}>
                <div className="col-md-3">
                    <AccountsComp />
                    <CategoriesComp />
                </div>

                {selectedAccount &&
                <div className="col-md-4">
                    <AddTransaction/>
                    <TransactionsList/>
                </div>
                }

                {selectedAccount &&
                <div className="col-md-5">
                    <StatisticsComp/>
                </div>
                }
            </div>
        );
    }
}

interface MainCompProps extends MainCompOwnProps, DispatchFromProps {}
interface MainCompOwnProps {
    selectedAccount?: Account;
}

interface DispatchFromProps {
    loadCategories: (categories: Category[]) => void;
    loadAccounts: (accounts: Account[]) => void;
}

const mapStateToProps = (state: GlobalState) => ({
    selectedAccount: getSelectedAccount(state)
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
    loadCategories: (categories: Category[]) => dispatch(loadCategories(categories)),
    loadAccounts: (accounts: Account[]) => dispatch(loadAccounts(accounts))
});

export default connect<MainCompOwnProps, DispatchFromProps>(
    mapStateToProps,
    mapDispatchToProps
)(Main);
