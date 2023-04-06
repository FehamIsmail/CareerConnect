import React, {useCallback, useEffect, useRef, useState} from 'react'
import {IJob, DefaultJobPic} from "../../constants/types";
import { HeartIcon } from "@heroicons/react/24/outline";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {jobOnPreviewIDAtom} from "../../constants/atoms";
import JobDescription from "../JobDescription/JobDescription";
import JobLabel from "./JobLabel";
import {getAccessToken, useWindowDimensions} from "../../scripts/utils";
import axios from 'axios';
import { useNavigate } from 'react-router';

type JobItemProps = {
    job: IJob;
    cb?: (jobId: number) => void;
    showControls?: boolean;
}

const JobItem = (props: JobItemProps) => {
    const {job, cb, showControls} = props;
    const jobOnPreviewSetter = useSetRecoilState(jobOnPreviewIDAtom);
    const jobOnPreviewId = useRecoilValue(jobOnPreviewIDAtom);
    const [previewed, setPreviewed] = useState<boolean>(false);
    const jobItemRef = useRef<HTMLDivElement>(null)
    const { width } = useWindowDimensions();
    const navigate = useNavigate();

    useEffect(() => {
        //Changes the jobOnPreview
        setPreviewed(jobOnPreviewId == job.id);
        //Scrolls on top of the job item when the job is previewed after 500ms
        const timer = setTimeout(() => {
            if(previewed && jobItemRef.current && width <= 1060){
                // jobItemRef.current.scrollIntoView({behavior: "smooth"})
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [jobOnPreviewId]);

    const setJobOnPreview = useCallback(() => {
        if (cb) {
            cb(job.id);
        } else {
            //Sets the new jobOnPreviewID
            jobOnPreviewSetter(() => job.id)
        }
    }, [job.id, jobOnPreviewSetter]);

    const onDelete=(e:React.MouseEvent<HTMLButtonElement, MouseEvent>) =>{
        e.stopPropagation();
        axios
            .delete(`http://localhost:8000/api/jobs/${job.id}/`, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((res) => {
             console.log(res);
             navigate(0);
            })
            .catch((err) => {
             console.log(err);
            });
    }

    const JobItemBorder=()=>{
       if (showControls || previewed){
        return "hover:border-gray-300 border-transparent"
       }
        return "border-gray-400 drop-shadow-md"
    }

    return (
        <div ref={jobItemRef} onClick={setJobOnPreview} className="cursor-pointer w-full">
            <div className={`h-fit bg-white overflow-visible transition-[border-color] transition-shadow ${JobItemBorder()} border-[1px] p-6 duration-100 ease-linear`}>
                <div className="logo-top h-8 flex items-center gap-3">
                    <img
                        alt="Job Logo"
                        src={job.company_logo || DefaultJobPic}
                        className="w-8 h-8 object-cover"/>
                    <div className="w-full flex flex-col ss:gap-1.5 ss:flex-row ss:items-center overflow-hidden ">
                        <div className="job-title font-normal text-[#3F3F46] text-base sm:leading-5 whitespace-nowrap overflow-hidden overflow-ellipsis">
                            {job.company}
                        </div>
                        <div className="hidden ss:block relative top-[1px] job-location font-normal text-[#A1A1AA] text-xs">
                            •
                        </div>
                        <div
                            className="relative top-[1px] job-location font-normal text-[#A1A1AA] text-xs whitespace-nowrap overflow-hidden overflow-ellipsis">
                            {job.street_address}
                        </div>
                    </div>
                    <div
                        className="hidden text-[#6D28D9] text-xs ml-auto ">
                        New
                    </div>
                    <div
                        className="text-[#A1A1AA] text-xs ml-auto whitespace-nowrap ">
                        1 d
                    </div>
                </div>
                <div
                    className="job-title overflow-ellipsis overflow-hidden mt-2 text-lg font-bold">
                    {job.title}
                </div>
                <div
                    className="job-description text-sm text-[#71717A]">
                    {job.short_description}
                </div>
                <div className="mt-2 items-center justify-end flex flex-row gap-2">
                    {job.types && job.types.map((type, index) => (
                        <JobLabel key={index} jobType={type}/>
                    ))}
                    {showControls &&<div>
                        <button onClick={e=>{e.stopPropagation(); navigate(`/job/edit/${job.id}`)}} className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l'>Edit</button>
                        <button onClick={e=>onDelete(e)} className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r'>Delete</button>
                    </div>}
                    <HeartIcon className="h-4 ml-[10x]"/>
                </div>
            </div>
            <JobDescription job={job} isFromJobItem={false} />
        </div>
    )
}


export default JobItem;