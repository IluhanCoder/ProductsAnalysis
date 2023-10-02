import { Characteristic } from "../product-types"

type Params = {
    characteristics: Array<Characteristic>,
    onRemove: Function
}

const CharacteristicsMapper = (params: Params) => {
    const {characteristics, onRemove} = params;

    const handleRemove = (index: number) => {
        const temp = characteristics;
        temp.splice(index, 1);
        onRemove(temp);
    }

    return <div>
        {
            characteristics.map((item: Characteristic) => {
                return <div key={item.label}>
                        <div>{
                                item.label
                            }</div>
                        <div>{
                                item.value
                            }</div>
                        <div>
                            <button type="button" onClick={() => handleRemove(
                                characteristics.indexOf(item)
                            )}>видалити</button>
                        </div>
                    </div>
            })
        }
    </div>
}

export default CharacteristicsMapper