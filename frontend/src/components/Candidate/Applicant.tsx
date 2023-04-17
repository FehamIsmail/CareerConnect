import {  CheckCircleIcon,
          ChevronRightIcon,
          DocumentCheckIcon,
          ClockIcon,
          ChatBubbleLeftEllipsisIcon,
          XMarkIcon,
} from "@heroicons/react/24/outline";
import EnvelopeIcon from "@heroicons/react/24/outline/EnvelopeIcon";
import React from "react";
import { CandidateType } from "../../constants/types";
import DefaultProfileImage from "../../assets/default_profile_pic.png";

type ApplicantProps = {
  applicant: CandidateType;
};

export const Applicant = (props: ApplicantProps) => {
  const { applicant } = props;

  return (
    <li key={applicant.email}>
      <div className="block hover:bg-gray-50">
        <div className="flex items-center px-4 py-4 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center">
            <div className="flex-shrink-0">
              <img
                className="h-12 w-12 object-cover rounded-full"
                src={
                  applicant.profile_picture
                    ? 'http://localhost:8000' + applicant.profile_picture
                    : DefaultProfileImage
                }
                alt=""
              />
            </div>
            <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
              <div>
                <p className="truncate text-sm font-medium text-indigo-600">
                  {applicant.name}
                </p>
                <p className="mt-2 flex items-center text-sm text-gray-500">
                  <EnvelopeIcon
                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  <span className="truncate">{applicant.email}</span>
                </p>
              </div>
              <div className="flex">
                <div>
                  <p className="text-sm text-gray-900">
                    Applied on{" "}
                    <time
                      dateTime={applicant.applied_date
                        .toISOString()
                        .slice(0, 10)}
                    >
                      {applicant.applied_date.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                  </p>
                  <p className="mt-2 flex items-center text-sm text-gray-500">
                    {(() => {
                      const styling = "mr-1.5 h-5 w-5 flex-shrink-0 "
                      console.log(applicant.status)
                      switch (applicant.status) {
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
                    {applicant.status}
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
};
