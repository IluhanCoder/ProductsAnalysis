import { useState } from "react";
import { ITransaction, Purchase, Transaction } from "./transaction-types";
import transactionService from "./transaction-service";
import ProductsCatalogue from "../products/products-catalogue";
import { IProduct, Product } from "../products/product-types";
import ReactDatePicker from "react-datepicker";
import { inputStyle } from "../styles/form-styles";
import { buttonStyle, deleteButtonStyle } from "../styles/button-styles";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type ProductToDisplay = {
  id: string;
  name: string;
  quantity: number;
};

const NewTransactionPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [productsToDisplay, setProductsToDisplay] = useState<
    ProductToDisplay[]
  >([]);
  const navigate = useNavigate();

  const handlePush = async (product: Product) => {
    const productToDisplay = {
      id: product.id,
      name: product.name,
      quantity: 1,
    };
    if (
      productsToDisplay.some(
        (product: ProductToDisplay) => product.id === productToDisplay.id,
      )
    )
      return;
    setProductsToDisplay([...productsToDisplay, productToDisplay]);
  };

  const handleSubmit = async () => {
    const products: Purchase[] = [];
    productsToDisplay.map((product: ProductToDisplay) => {
      products.push({ productId: product.id, quantity: product.quantity });
    });
    const newTransaction: ITransaction = {
      date,
      products,
    };
    await transactionService.createTransaction(newTransaction);
    toast.success("транзацію успішно створено");
    setProductsToDisplay([]);
  };

  const handleQuantityChange = (e: any) => {
    const { id, value } = e.target;
    const tempArray = productsToDisplay;
    const index = tempArray.findIndex(
      (element: ProductToDisplay) => element.id === id,
    );
    productsToDisplay[index].quantity = Number(value);
    setProductsToDisplay([...tempArray]);
  };

  const handleDelete = (index: number) => {
    const temp = productsToDisplay;
    temp.splice(index, 1);
    setProductsToDisplay([...temp]);
  };

  return (
    <div className="flex flex-col gap-3">
      <ToastContainer />
      <div className="flex justify-center text text-2xl font-bold">
        cтворення транзакції
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex justify-center gap-2">
          <div>Дата транзакції</div>
          <ReactDatePicker
            className={inputStyle}
            dateFormat="dd/MM/yyyy"
            selected={date}
            onChange={(date: Date) => setDate(date)}
            locale={"ua"}
          />
        </div>
        <div className="flex flex-col py-3">
          <div className="flex justify-center">Товари в транзакції:</div>
          <div className="flex justify-center">
            {(productsToDisplay.length > 0 && (
              <table className="w-1/3">
                <tr>
                  <th className="border-2">Товар</th>
                  <th className="border-2">Кількість</th>
                </tr>
                {productsToDisplay.map(
                  (product: ProductToDisplay, i: number) => {
                    return (
                      <tr key={i}>
                        <td className="border-2 p-2">
                          <div className="flex justify-center">
                            {product.name}
                          </div>
                        </td>
                        <td className="border-2 p-2">
                          <div className="flex justify-center">
                            <input
                              className={inputStyle}
                              min={1}
                              id={product.id}
                              type="number"
                              value={product.quantity}
                              onChange={handleQuantityChange}
                            />
                          </div>
                        </td>
                        <td className="p-2">
                          <button
                            className={deleteButtonStyle}
                            onClick={() => handleDelete(i)}
                            type="button"
                          >
                            прибрати
                          </button>
                        </td>
                      </tr>
                    );
                  },
                )}
              </table>
            )) || <div>ви поки що не додавали товарів до транзакції</div>}
          </div>
        </div>
        <div className="flex justify-center">
          <button className={buttonStyle} type="button" onClick={handleSubmit}>
            створити транзакцію
          </button>
        </div>
        <div className="flex justify-center flex-col gap-2 mt-10">
          <div className="text-center text-xl">
            оберіть товари, що входитимуть до транзакції:
          </div>
          <ProductsCatalogue isPicker onPick={handlePush} />
        </div>
      </div>
    </div>
  );
};

export default NewTransactionPage;
