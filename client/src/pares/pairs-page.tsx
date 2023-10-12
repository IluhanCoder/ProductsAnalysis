import {useState, useEffect} from "react";
import { PairsResponse } from "./pairs-types";
import pairsService from "./pairs-service";
import { Buffer } from "buffer";

const PairsPage = () => {
    const [minSupport, setMinSupport] = useState<number>(0.1);
    const [maxSupport, setMaxSupport] = useState<number>(9);
    const [minConfidence, setMinConfidence] = useState<number>(0.1);
    const [maxConfidence, setMaxConfidence] = useState<number>(0.9);
    const [category, setCategory] = useState<string>("");
    const [results, setResults] = useState<PairsResponse[]>([]);

    const handleSubmit = async () => {
        const result = await pairsService.getPares(minSupport, maxSupport, minConfidence, maxConfidence, category);
        setResults(result);
    }

    const convertImage = (image: any) => {
        return `data:image/jpeg;base64,${Buffer.from(image.data).toString('base64')}`;
    }

    return <div>
        <div>
            <form>
                <div>
                    <label>Мінімальна підтримка:</label>
                    <input type="number" value={minSupport} onChange={e => setMinSupport(Number(e.target.value))}/>
                </div>
                <div>
                    <label>Максимальна підтримка:</label>
                    <input type="number" value={maxSupport} onChange={e => setMaxSupport(Number(e.target.value))}/>
                </div>
                <div>
                    <label>Мінімальна достовірність:</label>
                    <input type="number" value={minConfidence} onChange={e => setMinConfidence(Number(e.target.value))}/>
                </div>
                <div>
                    <label>Максимальна достовірність:</label>
                    <input type="number" value={maxConfidence} onChange={e => setMaxConfidence(Number(e.target.value))}/>
                </div>
                <div>
                    <label>Категорія товару</label>
                    <input type="text" value={category} onChange={e => setCategory(e.target.value)}/>
                </div>
                <button type="button" onClick={handleSubmit}>Підтвердити</button>
            </form>
        </div>
        <div>
            <table>
            <tr>
                <th>Продукт 1</th>
                <th>Продукт 2</th>
                <th>Підтримка</th>
                <th>достовірність</th>
            </tr>
            {
                results.map((result: PairsResponse) => {
                    return <tr>
                        <td>
                            <div>
                                <div>{result.pair[0].name}</div>
                                <div><img height={70} src={convertImage(result.pair[0].image)}/></div>
                            </div>
                        </td>
                        <td>
                            <div>
                                <div>{result.pair[1].name}</div>
                                <div><img height={70} src={convertImage(result.pair[1].image)}/></div>
                            </div>
                        </td>                 
                        <td>
                            <div>{result.support}</div>
                        </td>
                        <td>
                            <div>{result.confidence}</div>
                        </td>
                    </tr>
                })
            }
            </table>
        </div>
    </div>
}

export default PairsPage;