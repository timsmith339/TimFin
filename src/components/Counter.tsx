import * as React from "react";
import {connect} from "react-redux";
import {GlobalState} from "../redux/store";
import {getAccounts, getCategories} from "../lib/comms";

interface CounterCompProps {
    onDecrement: () => void;
    onIncrement: () => void;
}

class CounterComp extends React.Component<CounterCompOwnProps, {}> {
    constructor(props: CounterCompOwnProps) {
        super(props);
    }

    render() {
        const { currentCount, onDecrement, onIncrement } = this.props;

        return (
            <div>
                <button onClick={onDecrement}> - </button>
                <span style={{paddingLeft: "10px", paddingRight: "10px"}}> { currentCount } </span>
                <button onClick={onIncrement}> + </button>
            </div>
        );
    }
}

interface CounterCompOwnProps extends CounterCompProps {
    currentCount: number;
}

function mapStateToProps(state: GlobalState, ownProps: CounterCompProps): CounterCompOwnProps {
    return {
        currentCount: state.app.count,
        onDecrement: ownProps.onDecrement,
        onIncrement: ownProps.onIncrement,
    };
}

export default connect(mapStateToProps)(CounterComp);
