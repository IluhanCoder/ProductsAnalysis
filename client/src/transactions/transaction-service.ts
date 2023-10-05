import $api from "../axios-setup";
import { ITransaction } from "./transaction-types";

export default new class TransactionService {
    async createTransaction (data: ITransaction) {
        await $api.post("/transaction", data);
    }

    async fetchTransactions() {
        return (await $api.get("/transactions")).data;
    }

    async deleteTransactions(transactionId: string) {
        await $api.delete(`/transaction/${transactionId}`);
    }
}