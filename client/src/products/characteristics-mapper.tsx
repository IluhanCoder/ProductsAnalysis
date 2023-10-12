import { Characteristic } from "./product-types"

type Params = {
    characteristics: Array<Characteristic>,
    onRemove?: Function
}

const CharacteristicsMapper = (params: Params) => {
    const {characteristics, onRemove} = params;

    const handleRemove = (index: number) => {
        if(!onRemove) return;
        const temp = characteristics;
        temp.splice(index, 1);
        onRemove(temp);
    }

    return <div className="flex flex-col">
        {
            characteristics.map((item: Characteristic) => {
                return <div key={item.key} className="flex justify-between">
                        <div>{
                                item.key
                            }</div>
                        <div>{
                                item.value
                            }</div>
                        {onRemove && <div>
                            <button type="button" onClick={() => handleRemove(
                                characteristics.indexOf(item)
                            )}>видалити</button>
                        </div>}
                    </div>
            })
        }
    </div>
}

export default CharacteristicsMapper