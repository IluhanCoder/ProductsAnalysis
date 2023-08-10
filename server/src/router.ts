import { Express, Request, Response, Router } from "express";
import productController from "./product/product-controller";

const router = Router();

router.get('/', (req: Request, res: Response) => {
    return res.send("get success");
})

//todo: images storing
router.post('/product', productController.createProduct);
router.get('/product', productController.fetchProducts);
router.put('/product/:productId', productController.updateProduct);
router.delete('/product/:productId', productController.deleteProduct);
router.post('/filter-products', productController.filterProducts);

export default router;