import { MonthlySalesPrediction } from "../analytics/analytics-types";
import prismaClient from "../prisma-client";
import { ITransaction, Purchase, TransactionFilter } from "./transaction-types";
import { Product, Transaction } from "@prisma/client";

export default new class TransactionService {
    async createTransaction (date: Date, productData: Purchase[]) {
        const createdTransaction = await prismaClient.transaction.create({
            data: {
              date: date,
              products: {
                create: productData.map(({ productId, quantity }) => ({
                  product: {
                    connect: { id: productId },
                  },
                  quantity: quantity,
                })),
              },
            },
            include: {
              products: {
                include: {
                  product: true,
                },
              },
            },
          });
      
          return createdTransaction;
    }

    async fetchTransactions () {
        const transactions = await prismaClient.transaction.findMany({
            include: {
              products: {
                include: {
                  product: true,
                },
              },
            },
        });
      
        return transactions;
    }

    async updateTransaction (transactionId: string, newData: Transaction) {
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

    async filterTransactions (filter: Transaction) {
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

    async fetchRangeSales(productId: string) {
      const transactions = (await prismaClient.transaction.findMany({
        include: {
          products: {
            where: {
              productId
            }
          },
        },
      })).filter((transaction) => transaction.products.length > 0);

    const monthlySalesMap = new Map<string, number>();

    // Iterate through transactions and accumulate sales by month
    for (const transaction of transactions) {
      const transactionDate = transaction.date;
      if (transactionDate) {
        const monthYear = transactionDate.toISOString().slice(0, 7); // Format: "YYYY-MM"
        const productQuantity = transaction.products.find((p) => p.productId === productId)?.quantity || 0;
        if (!monthlySalesMap.has(monthYear)) {
          monthlySalesMap.set(monthYear, 0);
        }
        monthlySalesMap.set(monthYear, monthlySalesMap.get(monthYear)! + productQuantity);
      }
    }

    // Convert the map into an array of MonthlySales objects
    const monthlySales: MonthlySalesPrediction[] = Array.from(monthlySalesMap).map(([month, sales]) => ({
      month,
      sales,
    }));

    return monthlySales;
  }
}