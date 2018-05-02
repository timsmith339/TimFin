import * as React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import {Switch, Route, Link} from "react-router-dom";
import Home from "./Home";
import CategoriesPage from "./CategoriesPage";

class Main extends React.Component<DispatchFromProps, {}> {
    constructor(props: DispatchFromProps) {
        super(props);
    }

    render() {
        return (
            <div className={"row main"}>
                <div className={"col-sm-2 sidebar"}>
                    <Link to={"/"}>Home</Link>
                    <Link to={"/categories"}>Categories</Link>
                </div>
                <div className={"col-sm-10"}>

                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route path="/categories" component={CategoriesPage}/>
                        {/* both /roster and /roster/:number begin with /roster */}
                        {/*<Route path="/roster" component={Roster}/>*/}
                    </Switch>

                </div>
            </div>
        );
    }
}

interface DispatchFromProps {
    // increment: () => void;
    // decrement: () => void;
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
    // decrement: () => dispatch(decCount()),
    // increment: () => dispatch(incCount())
});

export default connect<void, DispatchFromProps>(
    null,
    mapDispatchToProps
)(Main);
