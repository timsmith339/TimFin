import * as React from "react";
import {Provider} from "react-redux";
import {store} from "./redux/store";
import Main from "./components/Main";

class App extends React.Component<{}, {}> {

    render() {
        return (
            <Provider store={store}>
                <Main />
            </Provider>
        )
    }

}

export default App;
