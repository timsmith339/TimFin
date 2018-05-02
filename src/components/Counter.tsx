import * as React from 'react';
import {connect} from "react-redux";
import {GlobalState} from "../redux/store";

interface CounterCompProps {
    onDecrement: () => void,
    onIncrement: () => void
}

class CounterComp extends React.Component<CounterCompOwnProps, {}> {
    constructor(props: CounterCompOwnProps) {
        super(props);
    }

    render () {
        const { currentCount, onDecrement, onIncrement } = this.props;

        return (
            <div>
                <button onClick={onDecrement}>DECREMENT</button>
                <span>{ currentCount } </span>
                <button onClick={onIncrement}>INCREMENT</button>
            </div>
        )
    }
}

interface CounterCompOwnProps extends CounterCompProps {
    currentCount: number
}

function mapStateToProps(state: GlobalState, ownProps: CounterCompProps): CounterCompOwnProps {
    return {
        onDecrement: ownProps.onDecrement,
        onIncrement: ownProps.onIncrement,
        currentCount: state.app.count
    }
}

export default connect(mapStateToProps)(CounterComp);
