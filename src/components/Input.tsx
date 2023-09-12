import React from "react";

interface IProps{
    value:string
    label: string
    setValue:  React.Dispatch<React.SetStateAction<string>>
    fetchData : ()=>void
}
const Input = ({value,setValue,label,fetchData}:IProps) => {
    return (
        <div className="flex flex-col items-center">
            <label htmlFor='idInput' className="text-right mb-2 font-semibold text-1xl">{label}
            </label>
            <input
                className="text-center bg-gray-500 w-1/2"
                id="idInput"
                type="text"
                value={value}
                onChange={e => {
                    const val = e.target.value;
                    // Проверка на валидность числа
                    if (/^\d*\.?\d*$/.test(val) || val === '') {
                        if (val === '0'){
                            setValue('');
                        }else {
                            setValue(val);
                        };
                    }}}
                onKeyDown={(e)=>{
                    if(e.key=== 'Escape'){
                        setValue('')}
                    if(e.key=== 'Enter'){
                        fetchData()}
                }}/>


        </div>
    );
};

export default Input;


