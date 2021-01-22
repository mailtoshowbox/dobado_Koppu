import {
     
    IRootOption,
  } from "../../store/models/root.interface";

export type SelectProps = {
    required?: boolean,
    onChange: Function,
    id: string,
    label: string,
    value: string,
    inputClass?: string,
    options: IRootOption[],
    field: string,
    type: string,
    customError :string
};