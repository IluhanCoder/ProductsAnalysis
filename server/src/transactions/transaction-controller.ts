import { Request, Response } from "express";
import prismaClient from "../prisma-client";
import transactionService from "./transaction-service";
import { ITransaction } from "./transaction-types";

export default new class TransactionController {
    async createTransaction(req: Request, res: Response) {
        const data: ITransaction = req.body;
        const result = await transactionService.createTransaction(data.date, data.products);
        return res.status(200).send(result);
    }

    async fetchTransactions (req: Request, res: Response) {
        const {filter, productName} = req.body;
        console.log(filter);
        const transactions = await transactionService.fetchTransactions(filter, productName);
        return res.status(200).json(transactions);
    }

    async updateTransaction (req: Request, res: Response) {
        const { transactionData } = req.body;
        const { transactionId } = req.params;
        const transaction = await transactionService.updateTransaction(transactionId, transactionData);
        return res.status(200).json(transaction);
    }

    async deleteTransaction (req: Request, res: Response) {
        const { transactionId } = req.params;
        await transactionService.deleteTransaction(transactionId);
        return res.status(200).send("transaction has been deleted succesfully");
    }

    async filterTransactions (req: Request, res: Response) {
        const { filter } = req.body;
        const transactions = await transactionService.filterTransactions(filter);
        return res.status(200).json(transactions);
    }
}