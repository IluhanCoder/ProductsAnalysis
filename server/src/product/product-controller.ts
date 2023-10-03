import { Request, Response } from "express";
import ProductService from "./product-service";
import { IProduct, Product } from "./product-types";
import productService from "./product-service";

export default new class ProductController {
    async createProduct (req: Request, res: Response) {
        const productData: IProduct = JSON.parse(req.body.product);
        const file = req.file;
        productData.image = file?.buffer!;
        const product: Product = await ProductService.createProduct(productData);
        return res.status(200).json(product);
    }

    async fetchProducts (req: Request, res: Response) {
        const products = await productService.fetchProducts();
        return res.status(200).json(products);
    }

    async updateProduct (req: Request, res: Response) {
        const { productData } = req.body;
        const { productId } = req.params;
        const product = await productService.updateProduct(productId, productData);
        return res.status(200).json(product);
    }

    async deleteProduct (req: Request, res: Response) {
        const { productId } = req.params;
        await productService.deleteProduct(productId);
        return res.status(200).send("product has been deleted succesfully");
    }

    async filterProducts (req: Request, res: Response) {
        const filter = req.body;
        const products = await productService.filterProducts(filter);
        return res.status(200).json(products);
    }
}