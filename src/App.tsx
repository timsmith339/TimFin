import * as React from "react";
import {Provider} from "react-redux";
import {store} from "./redux/store";
import Main from "./components/Main";

import * as moment from "moment";
import * as tz from "moment-timezone";

require("./style/main.scss");

class App extends React.Component<{}, {}> {

    constructor(props: any) {
        super(props);

        const timezone = tz.tz.guess();
        moment.tz.setDefault( timezone );
    }

    render() {
        return (
            <Provider store={store}>
                <Main />
            </Provider>
        );
    }

}

export default App;
