import React, { useEffect, useState } from "react";
import { getAccessToken } from "../scripts/utils";
import axios from "axios";
import { Document, IJob } from "../constants/types";
import JobsAppliedTo from "./JobsAppliedTo";
import ExpandableDiv from "../components/ExpandableDiv/ExpandableDiv";
import JobsView from "./JobView";

type extraJobInfo = {
  status: string;
  updated_at: Date;
}

export default function ApplicationsPage() {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [jobsInfo, setJobsInfo] = useState<extraJobInfo[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    const headers: any = { "Content-Type": "application/json" };
    headers.Authorization = `Bearer ${getAccessToken()}`;

    axios({
      method: "get",
      url: "http://localhost:8000/api/application/",
      headers,
    })
      .then((res) => {
        console.log(res);
        const createDocuments = (data: any) => {
          return data.map((info: any) => {
            return {
              id: info.application_package.id,
              file: info.application_package.curriculum_vitae
                .curriculum_vitae,
              file2: info.application_package.cover_letter?.cover_letter,
              title: "N/A",
              default: false,
              type: "APP_PKG",
            };
          });
        };
        
        setJobs(res.data?.map((d: any) => d.job));
        setJobsInfo(res.data?.map((d: any) => ({status: d.status, updated_at: new Date(d.updated_at)})));
        setDocuments(createDocuments(res.data))
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className="space-y-6 sm:px-6 md:col-span-9 md:px-0 mr-0 md:mr-4 mb-4">
    <div className="overflow-hidden bg-white shadow sm:rounded-md mt-4">
      <ul role="list" className="divide-y divide-gray-200">
        {jobs.map((job, i) => (
          <ExpandableDiv
            key={i}
            candidate={<JobsAppliedTo job={job} status={jobsInfo[i].status} updated_at={jobsInfo[i].updated_at} />}
            candidateDetail={
              <JobsView
                job={job}
                document={documents[i]}
              />
            }
          />
        ))}
      </ul>
    </div>
  </div>
  );
}
