import { buttonStyle } from "../styles/button-styles";
import ProductsCatalogue from "./products-catalogue";
import { Link } from "react-router-dom";

const ProductsPage = () => {
    return <div className="flex flex-col gap-5 pt-4">
        <div className="flex flex-col gap-4">
            <div className="flex justify-center text-5xl font-bold">
                товари
            </div>
            <div className="flex justify-center">
                <Link to="/new-product" className={buttonStyle}>Створити товар</Link>
            </div>
        </div>
        <ProductsCatalogue deleteAvailable/>
    </div>
}

export default ProductsPage;