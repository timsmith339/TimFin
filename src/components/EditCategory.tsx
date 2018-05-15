import * as React from "react";
import {Category} from "../timfin-types";

interface EditCategoryComps {
    category: Category;
    onSubmit: (newCategory: Category) => void;
    onClose: () => void;
}
interface EditCategoryState {
    name: string;
    budget: number;
}

class EditCategory extends React.Component<EditCategoryComps, EditCategoryState> {
    constructor(props: EditCategoryComps) {
        super(props);
        const { category } = props;

        this.state = {
            name: category.name,
            budget: category.budget || 0
        };

        this.handleNameChanged = this.handleNameChanged.bind(this);
        this.handleBudgetChanged = this.handleBudgetChanged.bind(this);
        this.handleDone = this.handleDone.bind(this);
    }

    handleNameChanged(e: React.FormEvent<HTMLInputElement>) {
        this.setState({ name: e.currentTarget.value });
    }
    handleBudgetChanged(e: React.FormEvent<HTMLInputElement>) {
        this.setState({ budget: Number(e.currentTarget.value) });
    }
    handleDone() {
        const { category: { id }, onSubmit } = this.props;
        onSubmit(Object.assign({}, this.state, { id }) as Category);
    }

    render() {
        const { name, budget } = this.state;

        return <div>
            <div>
                <input type={"text"}
                       value={name}
                       onChange={this.handleNameChanged} />
                <input type={"number"}
                       value={budget}
                       min="0" max="9999"
                       onChange={this.handleBudgetChanged}  />
            </div>
            <div>
                <button className={"btn btn-primary"} onClick={this.handleDone}>Done</button>
                <button className={"btn btn-danger"} onClick={this.props.onClose}>cancel</button>
            </div>
        </div>;
    }
}

export default EditCategory;
