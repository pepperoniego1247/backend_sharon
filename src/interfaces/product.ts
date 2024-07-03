export interface ICreateProduct {
    name: string,
    category: string,
    image: string,
    description: string,
    price: number,
    cantidad: number,
    activo: boolean,
    comerciable: boolean
}