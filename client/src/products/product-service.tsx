import $api from "../axios-setup"
import { IProduct } from "./product-types";

export type newProductRequestData = {
    product: IProduct,
    formData: FormData
}

export default new class ProductService {
    async fetchProducts () {
        return (await $api.get('/product')).data;
    }

    async newProduct (product: IProduct, image: File) {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('product', JSON.stringify(product));
        const config = {     
            headers: { 'content-type': 'application/json' }
        }
        return (await $api.post('/product', formData));
    }
}