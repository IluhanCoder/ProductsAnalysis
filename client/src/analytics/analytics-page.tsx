import {useState, useEffect} from "react";
import { AnalyticsResult } from "./analytics-types";
import analyticsService from "./analytics-service";
import { convertAnalyticsForGraphs } from "./analytics-helpers";
import AnalyticsGraph from "./analytics-graph";

const AnalyticsPage = () => {
    const [analytics, setAnalytics] = useState<AnalyticsResult>();
    const [startDate, setStartDate] = useState<Date>(new Date("2022-12-01"));
    const [endDate, setEndDate] = useState<Date>(new Date("2023-12-01"));

    const getData = async () => {
        const result = await analyticsService.getAnalyticsData(startDate, endDate);
        setAnalytics(result);
    }

    useEffect(() => {
        if(!analytics) getData();
    },[analytics])

    return <div>
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