import {useState, useEffect} from "react";
import { PairsResponse } from "./pairs-types";
import pairsService from "./pairs-service";
import { Buffer } from "buffer";
import { cardStyle } from "../styles/card-styles";
import { buttonStyle } from "../styles/button-styles";
import { inputStyle } from "../styles/form-styles";

const PairsPage = () => {
    const [minSupport, setMinSupport] = useState<number>(0.1);
    const [maxSupport, setMaxSupport] = useState<number>(9);
    const [minConfidence, setMinConfidence] = useState<number>(0.1);
    const [maxConfidence, setMaxConfidence] = useState<number>(0.9);
    const [category, setCategory] = useState<string>("");
    const [results, setResults] = useState<PairsResponse[]>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        const result = await pairsService.getPares(minSupport, maxSupport, minConfidence, maxConfidence, category);
        setIsLoading(false);
        setResults(result);
    }

    const convertImage = (image: any) => {
        return `data:image/jpeg;base64,${Buffer.from(image.data).toString('base64')}`;
    }

    return <div className="flex flex-col p-4">
        <div className="flex justify-center">
            <form className={cardStyle + "py-2 px-4 gap-2 flex flex-col justify-center"}>
                <div className="flex justify-center">Параметри пошуку:</div>
                <div className="flex gap-2">
                    <label>Мінімальна підтримка:</label>
                    <input className={inputStyle} type="number" value={minSupport} onChange={e => setMinSupport(Number(e.target.value))}/>
                </div>
                <div className="flex gap-2">
                    <label>Максимальна підтримка:</label>
                    <input className={inputStyle} type="number" value={maxSupport} onChange={e => setMaxSupport(Number(e.target.value))}/>
                </div>
                <div className="flex gap-2">
                    <label>Мінімальна достовірність:</label>
                    <input className={inputStyle} type="number" value={minConfidence} onChange={e => setMinConfidence(Number(e.target.value))}/>
                </div>
                <div className="flex gap-2">
                    <label>Максимальна достовірність:</label>
                    <input className={inputStyle} type="number" value={maxConfidence} onChange={e => setMaxConfidence(Number(e.target.value))}/>
                </div>
                <div className="flex gap-2">
                    <label>Категорія товару</label>
                    <input className={inputStyle} type="text" value={category} onChange={e => setCategory(e.target.value)}/>
                </div>
                <div className="flex justify-center">
                    <button className={buttonStyle} type="button" onClick={handleSubmit}>Здійснити аналіз</button>
                </div>
            </form>
        </div>
        <div className="flex flex-col gap-3 py-5">
            <div className="flex justify-center text-2xl">Таблиця шаблоних покупок:</div>
            {results && (results.length > 0 && <table>
            <tr className="text-xl">
                <th className="border-2">Продукт 1</th>
                <th className="border-2">Продукт 2</th>
                <th className="border-2">Підтримка</th>
                <th className="border-2">достовірність</th>
            </tr>
            {
                results.map((result: PairsResponse) => {
                    return <tr>
                        <td className="border-2">
                            <div className="flex justify-around">
                                <div><img className="w-24" src={convertImage(result.pair[0].image)}/></div>
                                <div className="flex flex-col justify-center text-2xl">{result.pair[0].name}</div>
                            </div>
                        </td>
                        <td className="border-2">
                            <div className="flex justify-around">    
                                <div><img className="w-24" src={convertImage(result.pair[1].image)}/></div>
                                <div className="flex flex-col justify-center text-2xl">{result.pair[1].name}</div>
                            </div>
                        </td>                 
                        <td className="border-2">
                            <div className="flex justify-center text-2xl">{result.support}</div>
                        </td>
                        <td className="border-2">
                            <div className="flex justify-center text-2xl">{result.confidence}</div>
                        </td>
                    </tr>
                })
            }
            </table> || (!isLoading && <div className="flex justify-center">
                    <div className="mt-16 text-center text-3xl">Пари не було знайдено</div>
            </div>)) || <div className="flex justify-center">
                    <div className="mt-16 text-center text-3xl">Введіть параметри, та натисніть "здійснити аналіз"</div>
            </div>}
            {isLoading && 
                <div className="flex justify-center">
                    <div className="mt-16 text-center text-3xl">Завантаження аналітики...</div>
            </div>}
        </div>
    </div>
}

export default PairsPage;