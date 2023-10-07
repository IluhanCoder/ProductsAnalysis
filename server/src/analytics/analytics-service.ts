import { Transaction } from '@prisma/client';
import transactionService from '../transactions/transaction-service';
import { MonthlySalesPrediction } from './analytics-types';
import simpleStats from 'simple-statistics';

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
}