export type TextAreaInputProps = {
    required: boolean,
    onChange: Function,
    id: string,
    label: string,
    placeholder: string,
    value: string,
  
    maxLength: number,
    inputClass?: string,
    field: string
};