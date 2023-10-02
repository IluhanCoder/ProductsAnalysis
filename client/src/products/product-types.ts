export type Characteristic = {
    label: string,
    value: string
}

export type Product = {
    id: string,
    category: string,
    name: string,
    description: string,
    price: number,
    characteristics: Characteristic[],
    image?: any
}

export interface IProduct {
    id?: string,
    category: string,
    name: string,
    description: string,
    price: number,
    characteristics: Characteristic[],
    image?: File
}

export interface ProductFilter {
    category?: string,
    name?: string,
    description?: string,
    price?: number
}