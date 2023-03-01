import React, {useEffect, useRef} from 'react'
import { JobType, JOB_TYPE_METADATA } from "../../constants/types";
import {getDarkerColor} from "../../scripts/utils";

type JobLabelProps = {
    jobType: JobType
}

const JobLabel = (props: JobLabelProps) => {

    const { name, color } = JOB_TYPE_METADATA[props.jobType];
    const labelDivRef = useRef<HTMLDivElement>(null)
    const labelNameDivRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if(labelDivRef.current){
            labelDivRef.current.style.backgroundColor = color;
        }
        if (labelNameDivRef.current){
            labelNameDivRef.current.style.color = getDarkerColor(color);
        }
    }, []);


    return (
        <div ref={labelDivRef} className={`relative right-[2px] flex items-center px-2.5 h-6 rounded-full w-fit text-xs`}>
            <div ref={labelNameDivRef} className="saturate-[6] font-[300] ">
                {name}
            </div>
        </div>
    )
}

export default JobLabel;