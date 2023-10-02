import { useState, useEffect } from "react";
import { Product } from "./product-types";
import productService from "./product-service";
import { Buffer } from "buffer";

const ProductsCatalogue = () => {
    const [products, setProducts] = useState<Product[]>([]);

    async function fetchProducts () {
        const fetchResult: Product[] = await productService.fetchProducts();
        setProducts(fetchResult);
    }

    const convertImage = (image: any) => {
        return `data:image/jpeg;base64,${Buffer.from(image.data).toString('base64')}`;
    }

    useEffect(() => {
        fetchProducts();
    }, [])

    return <>
        {
            products.map((product: Product) => {
                return <div key={product.id}>
                    <div>
                        <img src={convertImage(product.image)}/>
                    </div>
                    <div>{product.name}</div>
                </div>
            })
        }
    </>
}

export default ProductsCatalogue;