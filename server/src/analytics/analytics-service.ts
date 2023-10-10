import { Transaction } from '@prisma/client';
import transactionService from '../transactions/transaction-service';
import { MonthlySalesPrediction } from './analytics-types';
import simpleStats from 'simple-statistics';
import prismaClient from '../prisma-client';

export default new class AnalyticsService {
  async transactionsApriori(transactions: Transaction[], minSupport: number, maxSupport: number, minConfidence: number, maxConfidence: number, category: string) {
      async function fetchTransactions(): Promise<string[][]> {
          const transactionData: string[][] = [];
          transactions.forEach((transaction: any) => {
            let items: string[] = transaction.products.filter((product: any) => !category || product.product.category === category);
            items = items.map((product: any) => product.product.id);
            if(items.length > 0) transactionData.push(items);
          });
          return transactionData;
      }

    interface FrequentPair {
      pair: [string, string];
      support: number;
      confidence: number;
    }
    
    function findFrequentPairs(
      data: string[][], 
      minSupport: number, 
      minConfidence: number,
      maxSupport: number,
      maxConfidence: number
    ): FrequentPair[] {
        // Step 1: Count item frequencies
        const itemFrequencies = new Map<string, number>();
        for (const transaction of data) {
            for (const item of transaction) {
                if (!itemFrequencies.has(item)) {
                    itemFrequencies.set(item, 0);
                }
                itemFrequencies.set(item, itemFrequencies.get(item)! + 1);
            }
        }
    
        // Step 2: Generate frequent pairs (itemsets of size 2)
        const frequentPairs: [string, string][] = [];
        for (const item1 of itemFrequencies.keys()) {
            if (itemFrequencies.get(item1)! >= minSupport && itemFrequencies.get(item1)! <= maxSupport) {
                for (const item2 of itemFrequencies.keys()) {
                    if (item1 !== item2 && itemFrequencies.get(item2)! >= minSupport && itemFrequencies.get(item2)! <= maxSupport) {
                        frequentPairs.push([item1, item2]);
                    }
                }
            }
        }
    
        // Step 3: Calculate support for frequent pairs
        const pairSupport = new Map<[string, string], number>();
        for (const transaction of data) {
            for (const pair of frequentPairs) {
                if (transaction.includes(pair[0]) && transaction.includes(pair[1])) {
                    if (!pairSupport.has(pair)) {
                        pairSupport.set(pair, 0);
                    }
                    pairSupport.set(pair, pairSupport.get(pair)! + 1);
                }
            }
        }
    
        // Step 4: Generate association rules and calculate confidence
        const frequentPairsWithInfo: FrequentPair[] = [];
        for (const pair of frequentPairs) {
            const support = pairSupport.get(pair)!;
            const confidence = support / itemFrequencies.get(pair[0])!;
            if (confidence >= minConfidence && confidence <= maxConfidence) {
                frequentPairsWithInfo.push({
                    pair,
                    support,
                    confidence,
                });
            }
        }
    
        // Step 5: Sort the rules by support and confidence
        frequentPairsWithInfo.sort((a, b) => {
            if (a.support !== b.support) {
                return b.support - a.support;
            }
            return b.confidence - a.confidence;
        });
    
        return frequentPairsWithInfo;
    }
    
    const dataset = await fetchTransactions();
    
    const frequentPairs = findFrequentPairs(dataset, minSupport, minConfidence, maxSupport, maxConfidence);
    return(frequentPairs);

    }

async predictSales(productId: string, monthToPredict: number) {
  const fetchHistoricalSales = async (productId: string) => {
    return await transactionService.fetchRangeSales(productId);
  }

  async function predictMonthlyProductSales(
    productId: string,
    monthsToPredict: number ) {
      // Fetch historical sales data for the specified product
      const historicalSales: { month: string; sales: number }[] = await fetchHistoricalSales(productId);

      // Extract sales data into arrays
      const months: string[] = historicalSales.map((entry) => entry.month);
      const sales: number[] = historicalSales.map((entry) => entry.sales);

      // Create a regression model
      const monthIndexes = months.map((month: string) => Number(month.slice(-2)));
      const dataToLearn: number[][] = monthIndexes.map((index: number, i: number = 0) => [index, sales[i++]]);

      const regressionModel = simpleStats.linearRegression(dataToLearn);

      // Predict sales for future months
      const predictedSales: MonthlySalesPrediction[] = [];
      for (let i = 0; i < monthsToPredict; i++) {
        const nextMonthIndex = months.length + i + 1;
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + i + 1);
        const predictedSale = regressionModel.m * nextMonthIndex + regressionModel.b;
        predictedSales.push({
          month: formatDate(nextMonth),
          sales: Math.max(0, predictedSale), // Ensure predictions are non-negative
        });
      }

      function formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${year}-${month}`;
      }

      return predictedSales;
    } 

    return predictMonthlyProductSales(productId, monthToPredict);
  }

  

  async monthlyTransactions(startMonth: string, endMonth: string) {
    function incrementDateByOneMonth(dateString: string): string {
      // Split the date string into year and month parts
      const [year, month] = dateString.split('-').map(Number);
    
      // Create a Date object with the provided year and month
      const currentDate = new Date(year, month - 1); // Subtract 1 from month since it's 0-based
    
      // Add one month to the current date
      currentDate.setMonth(currentDate.getMonth() + 1);
    
      // Extract the updated year and month
      const updatedYear = currentDate.getFullYear();
      const updatedMonth = currentDate.getMonth() + 1; // Add 1 back to month to match the format
    
      // Format the updated year and month as "YYYY-MM" and return it
      const updatedDateString = `${updatedYear}-${updatedMonth.toString().padStart(2, '0')}`;
      
      return updatedDateString;
    }

    interface MonthlyTransactionInfo {
      month: string;
      transactions: number;
    }
    
    async function getMonthlyTransactionInfo(startMonth: string, endMonth: string): Promise<MonthlyTransactionInfo[]> {
      const transactions = await prismaClient.transaction.findMany({
        select: {
          date: true,
        },
        where: {
          date: {
            gte: new Date(startMonth),
            lte: new Date(incrementDateByOneMonth(endMonth)),
          },
        },
      });

      console.log(transactions);
    
      const monthlyInfoMap: Record<string, number> = {};
    
      transactions.forEach((transaction) => {
        if (transaction.date) {
          const monthYear = transaction.date.toISOString().slice(0, 7); // Extract YYYY-MM from the date
          if (monthlyInfoMap[monthYear]) {
            monthlyInfoMap[monthYear]++;
          } else {
            monthlyInfoMap[monthYear] = 1;
          }
        }
      });
    
      const monthlyTransactionInfo: MonthlyTransactionInfo[] = [];
    
      for (const monthYear in monthlyInfoMap) {
        monthlyTransactionInfo.push({
          month: monthYear,
          transactions: monthlyInfoMap[monthYear],
        });
      }
    
      return monthlyTransactionInfo;
    }

    return await getMonthlyTransactionInfo(startMonth, endMonth);
  }

  async averageTransaction(startMonth: string, endMonth: string) {
    interface MonthlyAverageCost {
      month: string;
      averageCost: number;
    }
    
    async function getMonthlyAverageTransactionCost(startMonth: string, endMonth: string): Promise<MonthlyAverageCost[]> {
      const monthlyData: Record<string, { totalCost: number; transactionCount: number }> = {};
    
      const transactions = await prismaClient.transaction.findMany({
        select: {
          date: true,
          products: {
            select: {
              quantity: true,
              product: {
                select: {
                  price: true,
                },
              },
            },
          },
        },
        where: {
          date: {
            gte: new Date(startMonth),
            lte: new Date(endMonth),
          },
        },
      });
    
      transactions.forEach((transaction) => {
        if (transaction.date) {
          const monthYear = transaction.date.toISOString().slice(0, 7);
          if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = { totalCost: 0, transactionCount: 0 };
          }
          const transactionCost = transaction.products.reduce((acc, product) => {
            if (product.product && product.quantity) {
              return acc + product.product.price * product.quantity;
            }
            return acc;
          }, 0);
          monthlyData[monthYear].totalCost += transactionCost;
          monthlyData[monthYear].transactionCount += 1;
        }
      });
    
      const monthlyAverageCost: MonthlyAverageCost[] = [];
    
      for (const monthYear in monthlyData) {
        const { totalCost, transactionCount } = monthlyData[monthYear];
        const averageCost = transactionCount === 0 ? 0 : totalCost / transactionCount;
        monthlyAverageCost.push({
          month: monthYear,
          averageCost,
        });
      }
    
      return monthlyAverageCost;
    }
    
    return await getMonthlyAverageTransactionCost(startMonth, endMonth);
  }
}