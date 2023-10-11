import {useState, useEffect} from "react";
import { PairsResponse } from "./pairs-types";
import pairsService from "./pairs-service";

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
                <button onClick={handleSubmit}>Підтвердити</button>
            </form>
        </div>
        <div>
            {
                results.map((result) => {
                    return <div>{JSON.stringify(result)}</div>
                })
            }
        </div>
    </div>
}

export default PairsPage;