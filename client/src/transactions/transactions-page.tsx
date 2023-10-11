import {useEffect, useState} from "react";
import { Purchase, PurchaseResponse, Transaction, TransactionResponse } from "./transaction-types";
import transactionService from "./transaction-service";
import ReactDatePicker from "react-datepicker";
import TimePicker from "./time-picker";
import convertTime from "./convert-time";

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
    const [productName, setProductName] = useState<string>("");
    const [startDate, setStartDate] = useState<Date>(new Date("2023-02-01 00:00"));
    const [endDate, setEndDate] = useState<Date>(new Date("2023-12-01 23:00"));

    const filterTransactions = async (stDate?: Date, enDate?: Date) => {
        const dateFilter = {
            date: {
                gte: stDate,
                lte: enDate
            }
        }
        console.log(dateFilter);
        const result = await transactionService.fetchTransactions(dateFilter, productName);
        setTransactions([...result]);
    }

    const handleDelete = async (transactionId: string) => {
        await transactionService.deleteTransactions(transactionId);
    }

    const handleStart = (newDate: Date) => {
        const temp = startDate;
        temp.setFullYear(newDate.getFullYear());
        temp.setMonth(newDate.getMonth());
        temp.setDate(newDate.getDate());
        if(temp >= endDate!) return;
        setStartDate(temp); 
    }

    const handleStartTimeChange = (hours: string, minutes: string) => {
        const newDate = convertTime(hours, minutes, startDate);
        if(newDate >= endDate) return;
        setStartDate(newDate);
    }

    const handleEnd = (newDate: Date) => {
        const temp = endDate;
        temp.setFullYear(newDate.getFullYear());
        temp.setMonth(newDate.getMonth());
        temp.setDate(newDate.getDate());
        if(temp <= startDate) return;
        setEndDate(temp);
    }

    const handleEndTimeChange = (hours: string, minutes: string) => {
        const newDate = convertTime(hours, minutes, endDate);
        if(newDate <= startDate) return;
        console.log(newDate);
        setEndDate(newDate);
    }

    function formatDateTime(date: Date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
      
        return `${year}-${month}-${day} ${hours}:${minutes}`;
      }

    useEffect(() => {
        filterTransactions(startDate, endDate);
    }, [])

    return <div>
        <div>
            <div>
                <label>Діопазон дати і часу</label>
                <div>
                    <label>Від:</label>
                    <ReactDatePicker selected={startDate} onChange={handleStart} locale={"ua"}/>
                    <TimePicker onChange={handleStartTimeChange} defaultHour="00"/>
                </div>
                <div>
                    <label>До:</label>
                    <ReactDatePicker selected={endDate} onChange={handleEnd} locale={"ua"}/>
                    <TimePicker onChange={handleEndTimeChange} defaultHour="23"/>
                </div>
            </div>
            <label>Назва продукту:</label>
            <input type="text" value={productName} onChange={e => setProductName(e.target.value)}/>
            <button type="button" onClick={() => filterTransactions(startDate, endDate)}>знайти</button>
        </div>
        {   
            transactions.map((transaction: TransactionResponse) => {
                return <div>
                    <div>
                        {
                            new Date(transaction.date).toString()
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
                                <div>{prod.product.price}</div>
                            </div>
                        })}
                    </div>
                    <div>
                        {transaction.totalCost}
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