import React, {useEffect, useRef,} from 'react'
import JobItem from "./JobItem";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {jobListAtom, jobOnPreviewIDAtom} from "../../constants/atoms";
import {mockJobs} from "../../constants/mockJobs";


const JobList = () => {
    const jobListSetter = useSetRecoilState(jobListAtom)
    const jobList = useRecoilValue(jobListAtom)
    const jobListDivRef = useRef<HTMLDivElement>(null)
    const jobOnPreviewId = useRecoilValue(jobOnPreviewIDAtom);
    const jobOnPreviewSetter = useSetRecoilState(jobOnPreviewIDAtom);

    useEffect(() => {
        //Initializes the jobList Atom
        jobListSetter(() => mockJobs)
        //Previews the first jobItem
        if (jobOnPreviewId == -1 && jobList.length > 0)
            jobOnPreviewSetter(jobList[0].id)
        //Adds top border to the first jobItem and bottom border to the last jobItem
        if (jobListDivRef.current && jobListDivRef.current.firstChild) {
            const firstJobItem = jobListDivRef.current.querySelector<HTMLElement>(':first-child');
            const lastJobItem = jobListDivRef.current.querySelector<HTMLElement>(`:nth-child(${jobList.length})`);
            if (firstJobItem && lastJobItem) {
                const firstElement = firstJobItem.querySelector<HTMLElement>(':first-child')
                const lastElement = lastJobItem.querySelector<HTMLElement>(':first-child')
                if (firstElement && lastElement) {
                    firstElement.style.borderTopLeftRadius = '0.375rem';
                    firstElement.style.borderTopRightRadius = '0.375rem';
                    lastElement.style.borderBottomLeftRadius = '0.375rem';
                    lastElement.style.borderBottomRightRadius = '0.375rem';
                }
            }
        }
    }, [jobList, jobOnPreviewId]);

    return (
        <div ref={jobListDivRef}
             className="job-item h-fit bg-white min-w-0 divide-y divide-gray-200 border-[1px] border-gray-200 rounded-md shadow-default w-full">
            {jobList.map((job) => (
                <JobItem key={job.id} job={job}/>
            ))}
        </div>

    )
}

export default JobList;