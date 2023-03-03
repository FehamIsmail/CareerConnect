import React, {useEffect, useState} from 'react'
import {IJob} from "../../constants/types";
import {useRecoilValue} from "recoil";
import {jobOnPreview, jobOnPreviewIDAtom} from "../../constants/atoms";
import {getJobTypesString, useWindowDimensions} from "../../scripts/utils";
import job_logo from "../../assets/sample logo.png";
import {HeartIcon} from "@heroicons/react/24/outline";
import {thinScrollBarStyle} from "../../constants/styles";

type JobDescriptionProps = {
    job?: IJob;
    isFromJobItem: boolean;
}

const JobDescription = (props: JobDescriptionProps) => {
    // jobOnFocus variable will be used only in desktop mode
    const jobOnFocus: IJob | null = useRecoilValue(jobOnPreview);
    const {job, isFromJobItem} = props;
    const {width} = useWindowDimensions();
    const [className, setClassName] = useState<string>('');
    const jobOnPreviewId = useRecoilValue(jobOnPreviewIDAtom);
    const [previewed, setPreviewed] = useState<boolean>(false);
    const [fade, setFade] = useState<boolean>(false);
    const fadeStyle = `${fade ? 'opacity-50' : 'opacity-1 transition-opacity duration-200 ease-linear'}`

    useEffect(() => {
        if (job) {
            setPreviewed(jobOnPreviewId == job.id);
        } else
            setPreviewed(false);
    }, [jobOnPreviewId]);


    useEffect(() => {
        if (width <= 1060) {
            setClassName(`${thinScrollBarStyle} md:h-0 overflow-y-auto duration-[500ms] ease-out transition-[max-height] ${previewed ? 'max-h-[800px]' : 'max-h-0'}`)
        } else {
            setClassName(`${thinScrollBarStyle} sticky top-4 lg:top-5  h-[96vh] bg-white border-[1px] border-gray-200 w-full 1600:max-w-3xl shadow-default rounded-md `)
        }
        if (!isFromJobItem && width >= 1060) {
            setClassName("hidden")
        }
    }, [jobOnPreviewId, previewed, width]);

    useEffect(() => {
        setFade(true);
        setTimeout(() => {
            setFade(false);
        }, 100);
    }, [jobOnFocus]);

    return (
        <>
            <div className={`${className} cursor-default`}>
                {jobOnFocus && (<>
                    <div className={`top h-[188px] p-6 bg-white shadow-bottom ${fadeStyle}`}>
                        <div className="logo-top h-8 flex items-center gap-3">
                            <img
                                alt="Job Logo"
                                src={job_logo}
                                className={`w-8 h-8 object-cover`}/>
                            <div
                                className="w-full flex flex-col ss:gap-1.5 ss:flex-row ss:items-center overflow-hidden ">
                                <div className="job-title overflow-ellipsis overflow-hidden text-lg font-bold">
                                    {jobOnFocus.title}
                                </div>
                            </div>
                            <HeartIcon className="relative h-6 top-[2px]"/>
                        </div>
                        <div className={`flex flex-col gap-[2px] text-top h-fit mt-2`}>
                            {jobOnFocus.website && (<p className="text-[#085FF7] font-medium text-sm"><a
                                href={jobOnFocus.website}>{jobOnFocus.company}</a></p>)}
                            <p className="text-black font-[500] text-xs">{jobOnFocus.location}</p>
                            <p className="text-black font-[500] text-xs">{getJobTypesString(jobOnFocus.types)}</p>
                        </div>
                        <button
                            className="mt-2 font-[300] opacity-1 hover:bg-primary_dark bg-primary text-white text-sm py-2.5 px-[28px] rounded-md">
                            Apply
                        </button>
                    </div>
                    <div className={`job-description-content divide-gray-300 divide-y h-fit ${fadeStyle}`}>
                        <div className="job-details p-6 h-fit w-full">
                            <p className="text-lg font-[500]">Job Details</p>
                            {jobOnFocus.salary && (<>
                                <p className="mt-2 text-sm font-[500]">Salary</p>
                                <p className="mt-[1px] text-[#3F3F46] text-xs font-[500]">{jobOnFocus.salary}</p>
                            </>)}
                            <p className="mt-2 text-sm font-[500]">Job Type</p>
                            <p className="mt-[1px] text-[#3F3F46] text-xs font-[500]">{getJobTypesString(jobOnFocus.types)}</p>
                        </div>
                        <div className="actual-job-description p-6 h-fit w-full">
                            <p className="text-lg font-[500]">Job Description</p>
                            <p className="mt-4 text-sm text-[13px] font-[400]">
                                {jobOnFocus.description}
                            </p>
                        </div>
                    </div>
                </>)}
            </div>
        </>

    )
}
export default JobDescription
