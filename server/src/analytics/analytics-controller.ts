import transactionService from "../transactions/transaction-service";
import analyticsService from "./analytics-service";
import {Request, Response} from "express";

export default new class AnalyticsController {
    async transactionsApriori(req: Request, res: Response) {
        const { minSupport, maxSupport, minConfidence, maxConfidence, category } = req.body
        const result = await analyticsService.transactionsApriori(minSupport, maxSupport, minConfidence, maxConfidence, category);
        return res.status(200).send(result);
    }

    async predictSales(req: Request, res: Response) {
        const { productId, months } = req.body;
        const result = await analyticsService.predictSales(productId, months);
        return res.status(200).send(result);
    }

    async monthlySales(req: Request, res: Response) {
        const {startMonth, endMonth} = req.body;
        
        const result = await analyticsService.monthlyTransactions(startMonth, endMonth);
        return res.status(200).send(result);
    }

    async averageTransaction(req: Request, res: Response) {
        const {startMonth, endMonth} = req.body;
        const result = await analyticsService.averageTransaction(startMonth, endMonth);
        return res.status(200).send(result);
    }

    async monthlyTransactionCost(req: Request, res: Response) {
        const {startMonth, endMonth} = req.body;
        console.log(startMonth);
        console.log(endMonth);
        const result = await analyticsService.monthlyTransactionSum(startMonth, endMonth);
        return res.status(200).send(result);
    }

    async monthlyProductSales(req: Request, res: Response) {
        const {productId} = req.body;
        const result = await analyticsService.monthlyProductSales(productId); 
        return res.status(200).send(result);
    }
}