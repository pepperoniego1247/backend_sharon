import {Product}  from '../entities/product';
import {OrderEntry}  from '../entities/orderEntry';

export interface ICreateOrderEntryDetail { 
    name: string,
    quantity: string,
    orderEntry: OrderEntry,
    product: Product
}
