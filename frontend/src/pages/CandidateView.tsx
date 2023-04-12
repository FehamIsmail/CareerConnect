import React from "react";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import { CandidateType, Document, StudentProfile } from "../constants/types";

type CandidateViewProps = {
  applicant: CandidateType,
  studentProfile: StudentProfile,
  document: Document
}

export default function CandidateView(props: CandidateViewProps) {
  const {applicant, studentProfile, document} = props;

  return (
    <div className="space-y-6 md:col-span-9 md:px-0 mr-0">
      <div className="overflow-hidden bg-white mt-4">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Applicant Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Personal details and application.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900">{applicant.name}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Current experience
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{studentProfile.institution ? studentProfile.institution : "Not provided"}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Email address
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {applicant.email}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Phone number
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{studentProfile.phone_number ? studentProfile.phone_number : "Not provided"}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Field of study
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {studentProfile.field_of_study ? studentProfile.field_of_study : "Not provided"}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Education level
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {studentProfile.education_level ? studentProfile.education_level : "Not provided"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Attachments</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <ul
                  role="list"
                  className="divide-y divide-gray-200 rounded-md border border-gray-200"
                >
                  <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                    <div className="flex w-0 flex-1 items-center">
                      <PaperClipIcon
                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <span className="ml-2 w-0 flex-1 truncate">
                        Resume: {document.file?.split('/').pop()}
                      </span>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <a
                        href={"http://localhost:8000" + document.file}
                        target="_blank"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Download
                      </a>
                    </div>
                  </li>
                  {document.file2 && <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                    <div className="flex w-0 flex-1 items-center">
                      <PaperClipIcon
                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <span className="ml-2 w-0 flex-1 truncate">
                      Cover Letter: {document.file2?.split('/').pop()}
                      </span>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <a
                        href={"http://localhost:8000" + document.file2}
                        target="_blank"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Download
                      </a>
                    </div>
                  </li>}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}