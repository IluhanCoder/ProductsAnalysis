import { useState } from "react";
import RangePicker from "./search-bar-components/range-picker";
import { ProductFilter } from "./product-types";

type LocalParams = {
    onSubmit: (filter: ProductFilter) => {}
}

const ProductSearchBar = (params: LocalParams) => {
    const minState = useState<number>(0);
    const maxState = useState<number>(0);

    const [category, setCategory] = useState<string>("");
    const [name, setName] = useState<string>("");

    const { onSubmit } = params;

    const handleSubmit = () => {
        const filter: ProductFilter = {}
        if(!(minState[0] === 0 && maxState[0] === 0))
            filter.price = {
                gt: minState[0],
                lt: maxState[0]
            }
        if(name.length > 0) {
            filter["name"] = { contains: name };
        }
        if(category.length > 0) {
            filter["category"] = { contains: category };
        }
        onSubmit(filter);
    }

    return <div>
        <form>
            <div>
                <label>Назва товару</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}/>
            </div>
            <div>
                <label>Категорія</label>
                <input type="text" value={category} onChange={e => setCategory(e.target.value)}/>
            </div>
            <div>
                <label>Діaпазон ціни:</label>
                <RangePicker minState={minState} maxState={maxState}/>
            </div>
            <button type="button" onClick={handleSubmit}>знайти</button>
        </form>
    </div>
}

export default ProductSearchBar;