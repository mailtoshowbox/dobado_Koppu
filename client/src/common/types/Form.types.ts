import { IProduct } from "../../store/models/product.interface";

export type OnChangeModel = {
    value: string | number | boolean,
    error: string,
    touched: boolean,
    field: string,
    name: string,
};

export interface IFormStateField<T> {error: string, value: T};

export interface IProductFormState {
    _id: IFormStateField<string>;
    name: IFormStateField<string>;
    description: IFormStateField<string>;
    box: IFormStateField<string>;
    rack: IFormStateField<string>;
    category: IFormStateField<string>;
     
}
export interface IBoxFormState {
    _id: IFormStateField<string>;
    name: IFormStateField<string>;
    description: IFormStateField<string>;
    racks: IFormStateField<number>;  
}
export  interface IOrderFormState {
    name: IFormStateField<string>;
    product: IFormStateField<IProduct | null>;
    amount: IFormStateField<number>;
    totalPrice: IFormStateField<number>;
};

export interface IDocCategoryFormState {
    _id: IFormStateField<string>;
    name: IFormStateField<string>;
    description: IFormStateField<string>;
}