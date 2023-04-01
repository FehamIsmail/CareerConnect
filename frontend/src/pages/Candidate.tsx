import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getAccessToken } from "../scripts/utils";
import axios from "axios";
import { CandidateType, Document, StudentProfile } from "../constants/types";
import ExpandableDiv from "../components/ExpandableDiv/ExpandableDiv";
import { Applicant } from "../components/Candidate/Applicant";
import CandidateView from "./CandidateView";

export default function Candidate() {
  const [applicants, setApplicants] = useState<CandidateType[]>([]);
  const [studentProfiles, setStudentProfiles] = useState<StudentProfile[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const params = useParams();
  const { jobID } = params;

  useEffect(() => {
    const headers: any = { "Content-Type": "application/json" };
    headers.Authorization = `Bearer ${getAccessToken()}`;

    axios({
      method: "get",
      url: `http://localhost:8000/api/jobs/${jobID}/1/`,
      headers,
    })
      .then((res) => {
        const createCandidates = (data: any) => {
          return data.map((candidate: any) => {
            return {
              id: candidate.id,
              name: `${candidate.application_package.user.first_name} ${candidate.application_package.user.last_name}`,
              email: candidate.application_package.user.email,
              profile_picture:
                candidate.application_package.student_profile.profile_picture,
              applied_date: new Date(candidate.updated_at),
              status: candidate.status,
            };
          });
        };

        const createDocuments = (data: any) => {
            return data.map((candidate: any) =>{
                return{
                    id: candidate.application_package.id, 
                    file: candidate.application_package.curriculum_vitae.curriculum_vitae,
                    file2: candidate.application_package.cover_letter.cover_letter,
                    title: "N/A",
                    default: false,
                    type: 'APP_PKG' 
                }
            } )
        }

        setApplicants(createCandidates(res.data.candidates));
        setStudentProfiles(res.data.candidates.map((candidate: any) => candidate.application_package.student_profile));
        setDocuments(createDocuments(res.data.candidates));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="space-y-6 sm:px-6 md:col-span-9 md:px-0 mr-0 md:mr-4 mb-4">
      <div className="overflow-hidden bg-white shadow sm:rounded-md mt-4">
        <ul role="list" className="divide-y divide-gray-200">
          {applicants.map((applicant, i) => (
            <ExpandableDiv candidate={<Applicant applicant={applicant} />} candidateDetial={<CandidateView applicant={applicant} studentProfile={studentProfiles[i]} document={documents[i]}/>}/>
          ))}
        </ul>
      </div>
    </div>
  );
}
