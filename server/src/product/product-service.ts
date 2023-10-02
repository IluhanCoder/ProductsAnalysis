import { error } from "console";
import { IProduct, ProductFilter, Product } from "./types";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export default new class ProductService {
    async deleteAvatar(productId: string) {
        try {
          const product: Product | null = await prisma.product.findUnique({where: {id: productId}});
          if (product === null || product.image === undefined) throw new Error("deleting image error");
          await prisma.product.update({where: { id: product.id }, data: {image: undefined}});
          return product;
        } catch (error) {
          throw error;
        }
    }

    async createProduct (data: IProduct) {
        try {   
            return await prisma.product.create({ data });
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    }

    async fetchProducts () {
        try {   
            return await prisma.product.findMany();
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    }

    async updateProduct (productId: string, newData: IProduct) {
        try {
            return await prisma.product.update({
                where: { id: productId },
                data: newData
            })
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    }

    async deleteProduct (productId: string) {
        try {
            return await prisma.product.delete({
                where: { id: productId }
            })
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    }

    async filterProducts (filter: ProductFilter) {
        try {
            return await prisma.product.findMany({
                where: {
                    ...filter
                }
            })
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    }
}