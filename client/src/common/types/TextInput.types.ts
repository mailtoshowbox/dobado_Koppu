export type TextInputProps = {
    required: boolean,
    onChange: Function,
    id: string,
    label: string,
    placeholder: string,
    value: string,
    type?: string,
    minLength?: number,
    maxLength: number,
    inputClass?: string,
    field: string,
    customError :string ,
    disabled?: boolean,   

};