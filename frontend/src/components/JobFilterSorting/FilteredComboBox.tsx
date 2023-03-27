import React, {Fragment, useEffect, useState} from 'react'
import {Combobox, Transition} from '@headlessui/react'
import {CheckIcon, ChevronDownIcon} from '@heroicons/react/20/solid'
import {Option, FilterProps} from "../../constants/types";
import {thinScrollBarStyle} from "../../constants/styles";
import {useSetRecoilState} from "recoil";
import {filterSortingAtom} from "../../constants/atoms";

export default function FilteredComboBox(props: FilterProps) {
    const {options, placeholder} = props;
    const [selected, setSelected] = useState(options[0])
    const [query, setQuery] = useState('')
    const setFilterSorting = useSetRecoilState(filterSortingAtom);

    const filteredOption =
        query === ''
            ? options
            : options.filter((option) =>
                option.name
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .includes(query.toLowerCase().replace(/\s+/g, ''))
            )

    const handleFilterChange = (value: string) => {
        const filterType = options[0].name === 'Accounting' ? 'selectedIndustry' : 'selectedType'
        setFilterSorting((prevFilterSorting) => ({
            ...prevFilterSorting,
            [filterType]: value,
        }));
    };

    useEffect(() => {
        handleFilterChange(selected.name)
    }, [selected]);

    useEffect(() => {
        if(selected.name !== '')
            setSelected({id:-1, name: placeholder})
    }, [options]);

    return (
        <div className="w-full">
            <Combobox value={selected} onChange={setSelected}>
                <div className="relative mt-1">
                    <div
                        className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border-gray-300 border-[1px] shadow-light focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                        <Combobox.Input
                            className="w-full border-none outline-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                            displayValue={(option: Option) => option ? option.name : ''}
                            onChange={(event) => setQuery(event.target.value)}
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronDownIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </Combobox.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery('')}
                    >
                        <Combobox.Options
                            className={`${thinScrollBarStyle} z-20 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm`}>
                            {filteredOption.length === 0 && query !== '' ? (
                                <div className="relative select-none py-2 px-4 text-gray-700">
                                    Nothing found.
                                </div>
                            ) : (
                                filteredOption.map((option) => (
                                    <Combobox.Option
                                        key={option.id}
                                        className={({active}) =>
                                            `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                                active ? 'bg-teal-600 text-white' : 'text-gray-900'
                                            }`
                                        }
                                        value={option}
                                    >
                                        {({selected, active}) => (
                                            <>
                        <span
                            className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                            }`}
                        >
                          {option.name}
                        </span>
                                                {selected ? (
                                                    <span
                                                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                            active ? 'text-white' : 'text-teal-600'
                                                        }`}
                                                    >
                                    <CheckIcon className="h-5 w-5" aria-hidden="true"/>
                                </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Combobox.Option>
                                ))
                            )}
                        </Combobox.Options>
                    </Transition>
                </div>
            </Combobox>
        </div>
    )
}