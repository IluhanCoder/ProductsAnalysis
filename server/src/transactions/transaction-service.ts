import prismaClient from "../prisma-client";
import { ITransaction, Transaction, TransactionFilter } from "./transaction-types";

export default new class TransactionService {
    async createTransaction (data: Transaction) {
        return await prismaClient.transaction.create({ data });
    }

    async fetchTransactions () {
        try {   
            return await prismaClient.transaction.findMany();
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    }

    async updateTransaction (transactionId: string, newData: ITransaction) {
        try {
            return await prismaClient.transaction.update({
                where: { id: transactionId },
                data: newData
            })
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    }

    async deleteTransaction (transactionId: string) {
        try {
            return await prismaClient.transaction.delete({
                where: { id: transactionId }
            })
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    }

    async filterTransactions (filter: TransactionFilter) {
        try {
            return await prismaClient.transaction.findMany({
                where: {
                    ...filter
                }
            })
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    }
}