import { useState } from "react";
import { ITransaction, Purchase, Transaction } from "./transaction-types";
import transactionService from "./transaction-service";
import ProductsCatalogue from "../products/products-catalogue";
import { Product } from "../products/product-types";
import PurchasesMapper from "./purchases-mapper";

const NewTransactionPage = () => {
    const [date, setDate] = useState<Date>(new Date());
    const [products, setProducts] = useState<Purchase[]>([]);
    const [transaction, setTransaction] = useState<Transaction[]>([]);

    const handlePush = async (product: Product) => {
        const newPurchase: Purchase = {
            id: product.id,
            quantity: 1
        };
        setProducts([...products, newPurchase]);
    }

    const handleSubmit = async () => {
        const newTransaction: ITransaction = {
            date,
            products
        };
        await transactionService.createTransaction(newTransaction);
    }

    return <div>
        <div>
            <button type="button" onClick={handleSubmit}>створити транзакцію</button>
            <PurchasesMapper transaction={transaction} setTransactions={setTransaction}/>
            <ProductsCatalogue isPicker onPick={handlePush}/>
        </div>
    </div>
}

export default NewTransactionPage;