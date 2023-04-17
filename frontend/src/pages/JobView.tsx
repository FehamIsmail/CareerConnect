import React from "react";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import {Document, IJob } from "../constants/types";

type CandidateViewProps = {
  job: IJob,
  document: Document
}

export default function JobsView(props: CandidateViewProps) {
  const {job, document} = props;

    function createAddress(job: IJob): string {
        let address = `${job.street_address}, ${job.city ? job.city : ""}, ${job.province_territory ? job.province_territory : ""}
        ${job.postal_code ? job.postal_code : ""} 
        `;

        if (address === "") {
            return "Not Provided"
        }

        return address;
    }

  return (
    <div className="space-y-6 md:col-span-9 md:px-0 mr-0">
      <div className="overflow-hidden bg-white mt-4">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Job Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Job and company details.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Job Description</dt>
              <dd className="mt-1 text-sm text-gray-900">{job.description ? job.description : "No Description Provided" }</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Contact Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{job.contact_email ? job.contact_email : "Not Provided" }</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Contact Phone
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{job.contact_phone ? job.contact_phone : "Not Provided" }</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Address
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {createAddress(job)}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Salary
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{job.salary ? job.salary : "Not provided"}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Website
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {job.website_url ? job.website_url : "Not provided"}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Industry
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {job.industry ? job.industry : "Not provided"}
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