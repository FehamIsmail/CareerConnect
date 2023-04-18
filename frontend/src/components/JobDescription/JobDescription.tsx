import React, {useEffect, useState} from 'react'
import {IJob, DefaultJobPic} from "../../constants/types";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {jobOnPreview, jobOnPreviewIDAtom, showApplyPopupState, userTypeAtom} from "../../constants/atoms";
import {getJobTypesString, simplifyURL, useWindowDimensions} from "../../scripts/utils";
import {thinScrollBarStyle} from "../../constants/styles";



type JobDescriptionProps = {
    job?: IJob;
    isFromJobItem: boolean;
}

const JobDescription = (props: JobDescriptionProps) => {
    // jobOnFocus variable will be used only in desktop mode
    const {job, isFromJobItem} = props;
    const jobOnFocus: IJob | null = useRecoilValue(jobOnPreview);
    const SetShowApplyPopup = useSetRecoilState(showApplyPopupState)
    const {width} = useWindowDimensions();
    const [className, setClassName] = useState<string>('');
    const jobOnPreviewId = useRecoilValue(jobOnPreviewIDAtom);
    const [previewed, setPreviewed] = useState<boolean>(false);
    const [fade, setFade] = useState<boolean>(false);
    const fadeStyle = `${fade ? 'opacity-50' : 'opacity-1 transition-opacity duration-200 ease-linear'}`
    const user = useRecoilValue(userTypeAtom)

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
                    <div className={`h-fit top p-6 bg-white shadow-bottom ${fadeStyle}`}>
                        <div className={`${width < 1060 ? 'hidden' : ''} logo-top h-8 flex items-center gap-3`}>
                            <img
                                alt="Job Logo"
                                src={job?.company_logo || DefaultJobPic}
                                className={`w-8 h-8 object-cover`}/>
                            <div
                                className="w-full flex flex-col ss:gap-1.5 ss:flex-row ss:items-center overflow-hidden ">
                                <div className="job-title overflow-ellipsis overflow-hidden text-lg font-bold">
                                    {jobOnFocus.title}
                                </div>
                            </div>
                        </div>
                        <div className={`flex flex-col gap-[2px] text-top h-fit ${width < 1060 ? '' : 'mt-2'} `}>
                            {jobOnFocus.website_url && (<p className="text-[#085FF7] font-medium text-md"><a className='block h-full w-fit'
                                href={jobOnFocus.website_url}>{simplifyURL(jobOnFocus.website_url)}</a></p>)}
                            <p className="text-black font-[500] text-sm">{jobOnFocus.street_address}</p>
                            <p className="text-black font-[500] mb-2 text-sm">{jobOnFocus.types && getJobTypesString(jobOnFocus.types)}</p>
                        </div>
                        {user === 'STUDENT' && <button
                            onClick={() => SetShowApplyPopup(true)}
                            className={` font-[400] opacity-1 hover:bg-primary_dark bg-primary text-white text-md py-2.5 px-[28px] rounded-md`}>
                            Apply
                        </button>}
                    </div>
                    <div className={`job-description-content divide-gray-300 divide-y h-fit ${fadeStyle}`}>
                        <div className="job-details p-6 h-fit w-full">
                            <p className="text-lg font-[500]">Job Details</p>
                            {jobOnFocus.salary && (<>
                                <p className="mt-2 text-md font-[500]">Salary</p>
                                <p className="mt-[1px] text-[#3F3F46] text-sm font-[500]">{jobOnFocus.salary}</p>
                            </>)}
                            <p className="mt-2 text-md font-[500]">Job Type</p>
                            <p className="mt-[1px] text-[#3F3F46] text-sm font-[500]">{jobOnFocus.types && getJobTypesString(jobOnFocus.types)}</p>
                        </div>
                        <div className="actual-job-description p-6 h-fit w-full">
                            <p className="text-lg font-[500]">Job Description</p>
                            <p className="mt-4 text-md text-[13px] font-[400]">
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
