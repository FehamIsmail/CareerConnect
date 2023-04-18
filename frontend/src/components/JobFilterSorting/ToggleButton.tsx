import React, {useEffect, useState} from 'react'
import {Switch} from '@headlessui/react'
import {FilterProps} from "../../constants/types";
import {filterSortingAtom} from "../../constants/atoms";
import {useRecoilValue, useSetRecoilState} from "recoil";

export function ToggleButton(props: FilterProps) {
    const {placeholder, options} = props
    const [enabled, setEnabled] = useState(false)
    const setFilterSorting = useSetRecoilState(filterSortingAtom);
    const filter = useRecoilValue(filterSortingAtom)

    const handleFilterChange = (value: boolean) => {

        console.log(value)
        setFilterSorting((prevFilterSorting) => ({
            ...prevFilterSorting,
            [options[0]?.name]: value,
        }));
    };

    useEffect(() => {
        console.log(filter)
        handleFilterChange(enabled)
    }, [enabled]);

    return (
        <div className="flex flex-row items-center mt-4">
            <Switch
                checked={enabled}
                onChange={setEnabled}
                className={`${
                    enabled ? 'bg-primary' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
                <span className="sr-only">Enable notifications</span>
                <span
                    className={`${
                        enabled ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
            </Switch>
            <div className="ml-2 ">{placeholder}</div>
        </div>
    )
}