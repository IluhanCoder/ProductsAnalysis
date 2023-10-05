import {useEffect, useState} from "react";
import { Purchase, PurchaseResponse, Transaction, TransactionResponse } from "./transaction-types";
import transactionService from "./transaction-service";

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState<TransactionResponse[]>([]);

    const fetchTransactions = async () => {
        const result = await transactionService.fetchTransactions();
        setTransactions(result);
    }

    const handleDelete = async (transactionId: string) => {
        await transactionService.deleteTransactions(transactionId);
    }

    useEffect(() => {
        fetchTransactions();
    }, [])

    return <div>
        {
            transactions.map((transaction: TransactionResponse) => {
                return <div>
                    <div>
                        {
                            transaction.date.toString()
                        }
                    </div>
                    <div>
                        {transaction.products.map((prod: PurchaseResponse) => {
                            return <div>
                                {prod.product && 
                                    <div>  
                                        <div>{prod.product.name}</div>
                                    </div> || <div>продукту не існує, або інформація про продукт була видалена</div>
                                }
                                <div>{prod.quantity}</div>
                            </div>
                        })}
                    </div>
                    <div>
                        <button type="button" onClick={() => handleDelete(transaction.id)}>видалити транзакцію</button>
                    </div>
                </div>
            })
        }
    </div>
}

export default TransactionsPage;