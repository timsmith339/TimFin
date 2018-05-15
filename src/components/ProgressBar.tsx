import * as React from "react";

interface ProgressBarProps {
    total: number;
    current: number
}

class ProgressBar extends React.Component<ProgressBarProps, {}> {
    render() {
        const { total, current } = this.props;
        const percentage = (current / total) * 100;

        return <div className="prog-bar">
            <div className="prog-bar__completed" style={{ width: `${percentage}%` }} />
        </div>
    }
}

export default ProgressBar;
