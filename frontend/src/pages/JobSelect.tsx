import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { getAccessToken } from "../scripts/utils";
import axios from "axios";
import { JobType } from "../constants/types";
import { jobListAtom } from "../constants/atoms";
import JobList from "../components/JobList/JobList";
import { useNavigate } from "react-router";

const showCandidates = (jobId: Number) => {
//   const headers: any = { "Content-Type": "application/json" };
//   headers.Authorization = `Bearer ${getAccessToken()}`;
//   console.log(jobId);

//   axios({
//     method: "get",
//     url: `http://localhost:8000/api/jobs/${jobId}/1/`,
//     headers,
//   })
//     .then((res) => {
//       console.log(res);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
};

export default function JobSelect() {
  const jobListSetter = useSetRecoilState(jobListAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const headers: any = { "Content-Type": "application/json" };
    headers.Authorization = `Bearer ${getAccessToken()}`;

    axios({
      method: "get",
      url: "http://localhost:8000/api/jobs/",
      params: {
        self_only: true,
      },
      headers,
    })
      .then((res) => {
        const updatedJobs = res.data.map((job: any) => {
          return {
            ...job,
            types: job.types
              ?.split(",")
              .map(
                (type: string) => JobType[type.trim() as keyof typeof JobType]
              ),
          };
        });
        jobListSetter(() => updatedJobs);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className="space-y-6 sm:px-6 md:col-span-9 md:px-0 mr-0 md:mr-4 mb-4">
      <div className="overflow-hidden bg-white shadow sm:rounded-md mt-4">
        <JobList cb={jobId => navigate(`/job/candidates/${jobId}`)} />
      </div>
    </div>
  );
}
