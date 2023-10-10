import {useState, useEffect} from "react";
import { MonthlySalesResponseUnit, PredictionResponseUnit } from "./prediction-types";
import predictionService from "./prediction-service";
import PredictionGraph from "./prediction-graph";
import { ConvertMonthlySalesForGraphs, ConvertPredictionsForGraphs } from "./predictions-helpers";

const PredictionPage = () => {
    const [prediction, setPrediction] = useState<PredictionResponseUnit[]>([]);
    const [productSales, setProductSales] = useState<MonthlySalesResponseUnit[]>([]);
    const [productId, setProductId] = useState<string>("651ea581caeb9c38bf9e0bec");
    const [months, setMonths] = useState<number>(20);

    const getData = async () => {
        const data = await predictionService.getPrediction(productId, months);
        const monthly = await predictionService.getMonthlySales(productId);
        setPrediction(data);
        setProductSales(monthly);
    }

    useEffect(() => {
        getData();
    }, [])

    return <div>
        <PredictionGraph data={ConvertMonthlySalesForGraphs(productSales)}/>
        <PredictionGraph data={ConvertPredictionsForGraphs(prediction)}/>
    </div>
}

export default PredictionPage;