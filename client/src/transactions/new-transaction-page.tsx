import { useState } from "react";
import { ITransaction } from "./transaction-types";
import transactionService from "./transaction-service";

const NewTransactionPage = () => {
    const [inputValue, setInputValue] = useState<ITransaction>({
        date: new Date(),
        products: []
    }); 
    const [id, setId] = useState<string>("");

    const handleOnChange = (event: any) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputValue(values => ({...values, [name]: value}))
    }

    const handlePush = async () => {
        setInputValue({
            date: inputValue.date,
            products: [...inputValue.products, {id, quantity: 1}]
        })
        setId("");
    }

    const handleSubmit = async () => {
        await transactionService.createTransaction(inputValue);
    }

    return <div>
        <form>
            <input type="text" value={id} onChange={(e) => setId(e.target.value)}/>
            <button type="button" onClick={handlePush}>додати товар</button>
            <button type="button" onClick={handleSubmit}>створити транзакцію</button>
        </form>
    </div>
}

export default NewTransactionPage;