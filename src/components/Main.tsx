import * as React from 'react';
import { Dispatch } from 'redux';
import Counter from './Counter'
import { incCount, decCount } from "../redux/app-module";
import { connect } from "react-redux";

class Main extends React.Component<DispatchFromProps, {}> {
    constructor(props: DispatchFromProps) {
        super(props);

        this.inc = this.inc.bind(this);
        this.dec = this.dec.bind(this);
    }

    inc () { this.props.increment(); }
    dec () { this.props.decrement(); }

    render () {
        return <div>
                Now this works.... Welcome to {name}
                <Counter
                    onDecrement={this.dec}
                    onIncrement={this.inc}
                />
            </div>
    }
}

interface DispatchFromProps {
    increment: () => void,
    decrement: () => void,
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
    increment: () => dispatch(incCount()),
    decrement: () => dispatch(decCount())
});

export default connect<void, DispatchFromProps>(
    null,
    mapDispatchToProps
)(Main);
