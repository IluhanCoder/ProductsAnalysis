import $api from "../axios-setup";
import { ITransaction } from "./transaction-types";

export default new (class TransactionService {
  async createTransaction(data: ITransaction) {
    await $api.post("/transaction", data);
  }

  async fetchTransactions(
    filter: { date: { gte: Date; lte: Date } },
    productName: string,
  ) {
    const startDate = filter.date.gte;
    const endDate = filter.date.lte;
    filter.date.gte.setUTCHours(
      startDate.getHours(),
      startDate.getMinutes(),
      startDate.getSeconds(),
    );
    filter.date.lte.setUTCHours(
      endDate.getHours(),
      endDate.getMinutes(),
      endDate.getSeconds(),
    );
    return (await $api.post("/fetch-transactions", { filter, productName }))
      .data;
  }

  async deleteTransactions(transactionId: string) {
    await $api.delete(`/transaction/${transactionId}`);
  }
})();
