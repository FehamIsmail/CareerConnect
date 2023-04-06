import React, { useEffect, useRef } from "react";
import JobItem from "./JobItem";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  filteredJobListSelector,
  jobListAtom,
  jobOnPreviewIDAtom,
} from "../../constants/atoms";

type JobListProps = {
  cb?: (jobId: number) => void;
  showControls?: boolean;
};

const JobList = (props: JobListProps) => {
  const jobList = useRecoilValue(jobListAtom);
  const jobListDivRef = useRef<HTMLDivElement>(null);
  const jobOnPreviewId = useRecoilValue(jobOnPreviewIDAtom);
  const jobOnPreviewSetter = useSetRecoilState(jobOnPreviewIDAtom);
  const filteredJobList = useRecoilValue(filteredJobListSelector);

  useEffect(() => {
    //Previews the first jobItem
    if (jobOnPreviewId == -1 && jobList.length > 0)
      jobOnPreviewSetter(jobList[0].id);
    //Adds top border to the first jobItem and bottom border to the last jobItem
    if (jobListDivRef.current && jobListDivRef.current.firstChild) {
      const firstJobItem =
        jobListDivRef.current.querySelector<HTMLElement>(":first-child");
      const lastJobItem = jobListDivRef.current.querySelector<HTMLElement>(
        `:nth-child(${jobList.length})`
      );
      if (firstJobItem && lastJobItem) {
        const firstElement =
          firstJobItem.querySelector<HTMLElement>(":first-child");
        const lastElement =
          lastJobItem.querySelector<HTMLElement>(":first-child");
        if (firstElement && lastElement) {
          firstElement.style.borderTopLeftRadius = "0.375rem";
          firstElement.style.borderTopRightRadius = "0.375rem";
          lastElement.style.borderBottomLeftRadius = "0.375rem";
          lastElement.style.borderBottomRightRadius = "0.375rem";
        }
      }
    }
  }, [jobList, jobOnPreviewId]);

  return (
    <>
      {" "}
      {filteredJobList.length > 0 && (
        <div
          ref={jobListDivRef}
          className="job-item w-full h-fit bg-white min-w-0 divide-y divide-gray-200 border-[1px] border-gray-200 rounded-md shadow-default w-full"
        >
          {filteredJobList.map((job) => (
            <JobItem
              key={job.id}
              job={job}
              cb={props.cb}
              showControls={props.showControls}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default JobList;
