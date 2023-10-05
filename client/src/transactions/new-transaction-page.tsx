import { useState } from "react";
import { ITransaction, Purchase, Transaction } from "./transaction-types";
import transactionService from "./transaction-service";
import ProductsCatalogue from "../products/products-catalogue";
import { Product } from "../products/product-types";
import ReactDatePicker from "react-datepicker";

type ProductToDisplay = {
    id: string, name: string, quantity: number
}

const NewTransactionPage = () => {
    const [date, setDate] = useState<Date>(new Date());
    const [productsToDisplay, setProductsToDisplay] = useState<ProductToDisplay[]>([]);

    const handlePush = async (product: Product) => {
        const productToDisplay = {
            id: product.id,
            name: product.name,
            quantity: 1
        }
        setProductsToDisplay([...productsToDisplay, productToDisplay]);
    }

    const handleSubmit = async () => {
        const products: Purchase[] = [];
        productsToDisplay.map((product: ProductToDisplay) => {
            products.push({productId: product.id, quantity: product.quantity});
        });
        const newTransaction: ITransaction = {
            date,
            products
        };
        console.log(products);
        await transactionService.createTransaction(newTransaction);
    }

    const handleQuantityChange = (e: any) => {
        const {id, value} = e.target;
        const tempArray = productsToDisplay;
        const index = tempArray.findIndex((element: ProductToDisplay) => element.id === id);
        productsToDisplay[index].quantity = Number(value);
        setProductsToDisplay([...tempArray]);
    }

    return <div>
        <div>
            <div>
                <ReactDatePicker selected={date} onChange={(date: Date) => setDate(date)} locale={"ua"}/>
            </div>
            <div>
                {
                    productsToDisplay.map((product: ProductToDisplay) => {
                        return <div key={product.id}>
                            <div>{product.name}</div>
                            <div>
                                <input min={1} id={product.id} type="number" value={product.quantity} onChange={handleQuantityChange}/>
                            </div>
                        </div>
                    })
                }
            </div>
            <button type="button" onClick={handleSubmit}>створити транзакцію</button>
            <ProductsCatalogue isPicker onPick={handlePush}/>
        </div>
    </div>
}

export default NewTransactionPage;