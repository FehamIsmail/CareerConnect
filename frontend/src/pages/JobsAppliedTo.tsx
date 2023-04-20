import React, {  } from "react";
import {
  IJob,
} from "../constants/types";
import {  
    CheckCircleIcon,
    ChevronRightIcon,
    DocumentCheckIcon,
    ClockIcon,
    ChatBubbleLeftEllipsisIcon,
    XMarkIcon,
    BriefcaseIcon,
} from "@heroicons/react/24/outline";
import DefaultProfileImage from "../assets/default_profile_pic.png";

type JobsAppliedToPropsType={
    job: IJob;
    status: string;
    updated_at: Date;
}

export default function JobsAppliedTo(props: JobsAppliedToPropsType) {
  const {job, status, updated_at} = props;

  return (
    <li key={job?.id}>
    <div className="block hover:bg-gray-50">
      <div className="flex items-center px-4 py-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center">
          <div className="flex-shrink-0">
            <img
              className="h-12 w-12 object-cover rounded-full"
              src={
                job && job.company_logo
                ? job.company_logo
                : DefaultProfileImage
              }
              alt=""
            />
          </div>
          <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
            <div>
              <p className="truncate text-sm font-medium text-indigo-600">
              {job && job.title ? job.title : "No Title Found"}
              </p>
              <p className="mt-2 flex items-center text-sm text-gray-500">
                <BriefcaseIcon
                  className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                <span className="truncate">{job && job.employer_profile.company ? job.employer_profile: "Unknown Company"}</span>
              </p>
            </div>
            <div className="flex">
              <div>
                <p className="text-sm text-gray-900">
                  Applied on{" "}
                  <time
                    dateTime={updated_at?.toISOString()?.slice(0, 10)}
                  >
                    {updated_at?.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </p>
                <p className="mt-2 flex items-center text-sm text-gray-500">
                  {(() => {
                    const styling = "mr-1.5 h-5 w-5 flex-shrink-0 "
                    switch (status) {
                      case 'APPLIED':
                        return <DocumentCheckIcon className={styling + 'text-green-700'} />
                      case 'INTERVIEW':
                        return <ChatBubbleLeftEllipsisIcon className={styling + 'text-amber-300'} />
                      case 'PROCESSING':
                        return <ClockIcon className={styling + 'text-amber-500'} />
                      case 'OFFER':
                        return <CheckCircleIcon className={styling + 'text-green-600'} />
                      case 'REJECTED':
                        return <XMarkIcon className={styling + 'text-red-400'} />
                      default:
                        return <></>
                    }
                  })()}
                  {status}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <ChevronRightIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  </li>
  );
}
