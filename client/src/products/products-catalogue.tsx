import { useState, useEffect } from "react";
import { Product, ProductFilter } from "./product-types";
import productService from "./product-service";
import { Buffer } from "buffer";
import ProductSearchBar from "./product-search-bar";
import CharacteristicsMapper from "./characteristics-mapper";

type LocalParams = {
    isPicker?: boolean,
    onPick?: (picketProduct: Product) => {}
    deleteAvailable?: boolean
}
const ProductsCatalogue = (params: LocalParams) => {
    const {isPicker, onPick, deleteAvailable} = params;

    const [products, setProducts] = useState<Product[]>([]);

    async function fetchProducts () {
        const fetchResult: Product[] = await productService.fetchProducts();
        setProducts(fetchResult);
    }

    const convertImage = (image: any) => {
        return `data:image/jpeg;base64,${Buffer.from(image.data).toString('base64')}`;
    }

    const handleFilter = async (filter: ProductFilter) => {
        const newProducts = await productService.filterProducts(filter);
        setProducts(newProducts);
    }

    const handleDelete = async (productId: string) => {
        await productService.deleteProduct(productId);
    }

    useEffect(() => {
        fetchProducts();
    }, [])

    return <div>
        <div>
            <ProductSearchBar onSubmit={handleFilter}/>
        </div>
        <div>
        {
            products.map((product: Product) => {
                return <div key={product.id}>
                    <div>
                        <img src={convertImage(product.image)}/>
                    </div>
                    <div>{product.name}</div>
                    <div>{product.category}</div>
                    <div>{product.description}</div>
                    <div>{`${product.price} грн`}</div>
                    <div>
                        <CharacteristicsMapper characteristics={product.characteristics}/>
                    </div>
                    { isPicker &&
                        <div>
                            <button type="button" onClick={() => onPick!(product)}>додати товар</button>
                        </div>
                    }
                    {
                        deleteAvailable &&
                        <div>
                            <button type="button" onClick={() => handleDelete(product.id)}>видалити продукт</button>
                        </div> 
                    }
                </div>
            })
        }
        </div>
    </div>
}

export default ProductsCatalogue;