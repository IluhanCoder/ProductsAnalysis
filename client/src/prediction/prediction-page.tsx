import {useState, useEffect} from "react";
import { MonthlySalesResponseUnit, PredictionResponseUnit } from "./prediction-types";
import predictionService from "./prediction-service";
import PredictionGraph from "./prediction-graph";
import { ConvertMonthlySalesForGraphs, ConvertPredictionsForGraphs } from "./predictions-helpers";
import ProductsCatalogue from "../products/products-catalogue";
import { Product } from "../products/product-types";

const PredictionPage = () => {
    const [prediction, setPrediction] = useState<PredictionResponseUnit[]>([]);
    const [productSales, setProductSales] = useState<MonthlySalesResponseUnit[]>([]);
    const [currentProduct, setCurrentProduct] = useState<Product>();
    const [months, setMonths] = useState<number>(20);

    const getData = async () => {
        const data = await predictionService.getPrediction(currentProduct!.id, months);
        const monthly = await predictionService.getMonthlySales(currentProduct!.id);
        setPrediction(data);
        setProductSales(monthly);
    }

    const handlePick = async (product: Product) => {
        setCurrentProduct(product);
    }

    useEffect(() => {
        if(currentProduct) getData();
    }, [setPrediction, currentProduct])

    return <div>
        <div>
            <label>Кількість місяців</label>
            <input type="number" value={months} onChange={e => setMonths(Number(e.target.value))}/>
            <button type="button" onClick={() => {if(currentProduct) getData()}}>Встановити</button>
        </div>
        <ProductsCatalogue onPick={handlePick} isPicker/>
        <PredictionGraph data={ConvertMonthlySalesForGraphs(productSales)}/>
        <PredictionGraph data={ConvertPredictionsForGraphs(prediction)}/>
    </div>
}

export default PredictionPage;