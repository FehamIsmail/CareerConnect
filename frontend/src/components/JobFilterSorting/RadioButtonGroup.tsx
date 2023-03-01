import React, {useState} from 'react'
import {FilterProps} from "../../constants/types";

export default function RadioButtonGroup(props: FilterProps) {
    const {options} = props
    const [selected, setSelected] = useState<number>(options[0].id);

    const handleOptionChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        setSelected(parseInt(event.target.value))
    };

    return (
        <div>
            <fieldset className="mt-4">
                {options && options.map((option) => (
                    <div key={option.id} className="flex items-center mb-4">
                        <input
                            id={option.id.toString()}
                            type="radio"
                            value={option.id}
                            name="radio-button-group"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                            checked={option.id === selected}
                            onChange={handleOptionChange}
                        />
                        <label htmlFor={option.id.toString()} className="ml-2 text-sm font-[400] text-[#44444a]">
                            {option.name}
                        </label>
                    </div>
                ))}
            </fieldset>
        </div>
    )
}
