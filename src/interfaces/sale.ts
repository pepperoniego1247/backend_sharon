export interface ICreateSale {
    date: string,
    paymentMethod: string,
    totalAmount: number,
    reservaId: any,
    asignedEmployee: any
}

export interface ICreateSaleProduct {
    date: string,
    paymentMethod: string,
    employee?: any,
    totalAmount: number
}

export interface SaleProductSunat {
    name: string,
    price: number,
    quantity: number,
    type: "NIU" | "ZZ"
}

export interface ICreateSaleProductDetail {
    name: string,
    quantity: number,
    price: number,
    subTotal: number,
    producto: any,
    productSale: any
}

