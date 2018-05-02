import * as React from "react";
import {Provider} from "react-redux";
import {store} from "./redux/store";
import Main from "./components/Main";
import { BrowserRouter } from "react-router-dom";
require("./style/main.scss");

class App extends React.Component<{}, {}> {

    render() {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <Main />
                </BrowserRouter>
            </Provider>
        );
    }

}

export default App;
