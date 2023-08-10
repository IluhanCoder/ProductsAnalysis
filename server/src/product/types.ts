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
    characteristics: Characteristic[]
}

export interface IProduct {
    id?: string,
    category: string,
    name: string,
    description: string,
    price: number,
    characteristics: Characteristic[]
}

export interface ProductFilter {
    category?: string,
    name?: string,
    description?: string,
    price?: number
}