import React, {useCallback, useEffect, useState} from 'react'
import {JobType, Option} from "../../constants/types";
import RadioButtonGroup from "./RadioButtonGroup";
import FilteredComboBox from "./FilteredComboBox";
import ListBox from "./ListBox";
import {filterRadioOptions, sortByOptions, industryOptions} from "../../constants/filter_constants";
import {useWindowDimensions} from "../../scripts/utils";
import {ToggleButton} from "./ToggleButton";

const JobFilterSorting = () => {
    const [workOptions, setWorkOptions] = useState<Option[]>([{id: -1, name: "test"}])
    const [radioOptions] = useState<Option[]>(filterRadioOptions)
    const [open, setOpen] = useState<boolean>(false)
    const {width} = useWindowDimensions()

    const initializeWorkOptions = useCallback(() => {
        setWorkOptions(Object.values(JobType).map((value, index) => ({
            id: index,
            name: value
        })))
    }, []);

    useEffect(() => {
        initializeWorkOptions();
    }, []);

    const handleOpen = () => {
        setOpen(!open)
    }

    return (
        <div
            className={`${(!open && width <= 1060) ? 'h-[50px]' : 'h-[500px]'} transition-height duration-300 md:h-fit md:p-4 md:p-0 w-full md:w-[43%] py-[3px]`}>
            {!open && width <= 1060 && (
                <div onClick={handleOpen}
                     className="flex items-center font-[500] justify-center py-3 bg-white border-[1px] cursor-pointer shadow-default rounded-md border-gray-700">
                    Filter
                </div>
            )}
            {(open || width >= 1060) && (
                <>
                    <p className="text-base font-bold">Sort By:</p>
                    <ListBox options={sortByOptions} placeholder="Sort By: "/>
                    <p className="mt-4 text-base font-bold">Filters</p>
                    <RadioButtonGroup placeholder="" options={radioOptions}/>
                    <p className="mt-1 text-base font-bold">Type of Work</p>
                    <FilteredComboBox placeholder="" options={workOptions}/>
                    <p className="mt-2 text-base font-bold">Industries</p>
                    <FilteredComboBox placeholder="" options={industryOptions}/>
                    <ToggleButton placeholder={"Remote"} options={[{id: 0, name: 'isRemote'}]}/>
                    <ToggleButton placeholder={"Favorite"} options={[{id: 0, name: 'isFavorite'}]}/>
                    {width <= 1060 && (
                        <div onClick={handleOpen}
                             className="flex cursor-pointer justify-center items-center mt-6 text-base font-bold">
                            Done
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default JobFilterSorting;