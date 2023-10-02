import { Express, Request, Response, Router } from "express";
import productController from "./product/product-controller";
import signup from "./user/auth-controller";
import authController from "./user/auth-controller";
import multer from "multer";
import path from "path";

const router = Router();
const upload = multer();

router.get('/', (req: Request, res: Response) => {
    return res.send("get success");
})

router.post('/', authController.userVerification);

//todo: images storing
router.post('/product', upload.single("file"), productController.createProduct);
router.get('/product', productController.fetchProducts);
router.put('/product/:productId', productController.updateProduct);
router.delete('/product/:productId', productController.deleteProduct);
router.post('/filter-products', productController.filterProducts);

router.post('/signup', authController.signup);
router.post('/login', authController.login);

export default router;