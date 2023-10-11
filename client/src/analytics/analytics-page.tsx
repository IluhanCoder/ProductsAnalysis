import {useState, useEffect} from "react";
import { AnalyticsResult } from "./analytics-types";
import analyticsService from "./analytics-service";
import { convertAnalyticsForGraphs } from "./analytics-helpers";
import AnalyticsGraph from "./analytics-graph";
import ReactDatePicker from "react-datepicker";

const AnalyticsPage = () => {
    const [analytics, setAnalytics] = useState<AnalyticsResult>();
    const [startDate, setStartDate] = useState<Date>(new Date("2022-12-01"));
    const [endDate, setEndDate] = useState<Date>(new Date("2023-12-01"));

    const getData = async (startDate: Date, endDate: Date) => {
        const result = await analyticsService.getAnalyticsData(startDate, endDate);
        setAnalytics(result);
    }

    const handleStart = (newDate: Date) => {
        if(newDate >= endDate) return;
        setStartDate(newDate); 
        getData(newDate, endDate)
    }

    const handleEnd = (newDate: Date) => {
        if(newDate <= startDate) return;
        setEndDate(newDate);
        getData(startDate, newDate);
    }
 
    useEffect(() => {
        if(!analytics) getData(startDate, endDate);
    },[setAnalytics])

    return <div>
        <div>
            <div>Діапазон дат</div>
            <div>
                <label>Від:</label>
                <ReactDatePicker selected={startDate} onChange={handleStart} locale={"ua"}/>
            </div>
            <div>
                <label>До:</label>
                <ReactDatePicker selected={endDate} onChange={handleEnd} locale={"ua"}/>
            </div>
        </div>
        {
            analytics && 
                <div>
                    <AnalyticsGraph data={convertAnalyticsForGraphs(analytics!).monthlyTransactionSum.data} name={convertAnalyticsForGraphs(analytics!).monthlyTransactionSum.name}/>
                    <AnalyticsGraph data={convertAnalyticsForGraphs(analytics!).averageTransactions.data} name={convertAnalyticsForGraphs(analytics!).averageTransactions.name}/>
                    <AnalyticsGraph data={convertAnalyticsForGraphs(analytics!).monthlyTransactionAmount.data} name={convertAnalyticsForGraphs(analytics!).monthlyTransactionAmount.name}/>
                </div>
        }
    </div>
}

export default AnalyticsPage;