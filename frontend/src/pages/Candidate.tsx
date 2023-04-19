import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import {convertStatusToNumber, ErrorList, getAccessToken} from "../scripts/utils";
import axios from "axios";
import {
  CandidateType,
  Document,
  StatusType,
  StudentProfile,
} from "../constants/types";
import ExpandableDiv from "../components/ExpandableDiv/ExpandableDiv";
import { Applicant } from "../components/Candidate/Applicant";
import CandidateView from "./CandidateView";

export default function Candidate() {
  const [applicants, setApplicants] = useState<CandidateType[]>([]);
  const [studentProfiles, setStudentProfiles] = useState<StudentProfile[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [moveCandidateToNextState, setMoveCandidateToNextState] = useState<
    CandidateType[]
  >([]);
  const [status, setStatus] = useState<StatusType>({
    type: "nothing",
    message: " ",
  });
  const [forceRefresh, setForceRefresh] = useState<boolean>(false);
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
            console.log(candidate.updated_at)
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
          return data.map((candidate: any) => {
            return {
              id: candidate.application_package.id,
              file: candidate.application_package.curriculum_vitae
                .curriculum_vitae,
              file2: candidate.application_package.cover_letter?.cover_letter,
              title: "N/A",
              default: false,
              type: "APP_PKG",
            };
          });
        };

        setApplicants(createCandidates(res.data.candidates));
        setStudentProfiles(
          res.data.candidates.map(
            (candidate: any) => candidate.application_package.student_profile
          )
        );
        setDocuments(createDocuments(res.data.candidates));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [forceRefresh]);

  const onChangeHandler = (applicant: CandidateType) => {
    if (moveCandidateToNextState.length === 0) {
      setMoveCandidateToNextState([applicant]);
      return;
    }

    const index = moveCandidateToNextState.indexOf(applicant, 0);
    if (index > -1) {
      setMoveCandidateToNextState(
        moveCandidateToNextState.filter((a) => a.id !== applicant.id)
      );
      return;
    }

    const stage: string | undefined = moveCandidateToNextState.at(0)?.status;

    if (stage !== undefined && stage !== applicant.status) {
      setStatus({
        type: "error",
        message: "You can only select users from the same stage",
      });
      return;
    }

    setMoveCandidateToNextState([...moveCandidateToNextState, applicant]);
  };

  function moveToNextPhaseHandler(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    e.stopPropagation();
    const headers: any = { "Content-Type": "application/json" };
    headers.Authorization = `Bearer ${getAccessToken()}`;

    if (moveCandidateToNextState.length === 0) {
        return;
    }


    const body = {
      "selected_candidates": moveCandidateToNextState.map((a) => a.id)
    };
    const phase_number = convertStatusToNumber(moveCandidateToNextState[0].status)

    axios
      .post(`http://localhost:8000/api/jobs/${jobID}/${phase_number}/`, body, {headers})
      .then((res) => {
        console.log(res);
        setMoveCandidateToNextState([]);
        if (res.status == 200)
          setStatus({
            type: "success",
            message: "Candidates moved successfully",
          });
          setForceRefresh(!forceRefresh);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div id={'candidate-page'} className="space-y-6 sm:px-6 md:col-span-9 md:px-0 mr-0 md:mr-4 mb-4">
      <div className="overflow-hidden bg-white shadow sm:rounded-md mt-4">
        <ul role="list" className="divide-y divide-gray-200">
          {applicants.map((applicant, i) => (
            <ExpandableDiv
              key={i}
              cb={() => {
                onChangeHandler(applicant);
              }}
              candidate={<Applicant applicant={applicant} />}
              candidateDetail={
                <CandidateView
                  applicant={applicant}
                  studentProfile={studentProfiles[i]}
                  document={documents[i]}
                />
              }
            />
          ))}
        </ul>
      </div>
      {moveCandidateToNextState.length > 0 && (
        <button
          className="float-right inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
          onClick={moveToNextPhaseHandler}
        >
          Move to Next Phase
        </button>
      )}
           {status.type !== "nothing" && (
            <div
              className={`${
                status.type == "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              } mb-3 inline-flex w-full flex flex-col gap-1 rounded-lg py-5 px-6 text-base`}
            >
              <div className={`flex flex-row items-center `} role="alert">
                <span className="flex mr-2 items-center">
                  {status.type === "success" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" />
                    </svg>
                  ) : (
                    <svg
                      aria-hidden="true"
                      className="flex-shrink-0 inline w-5 h-5 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"></path>
                    </svg>
                  )}
                </span>
                <span className="font-[500]">{status.message}</span>
              </div>
              {status.type === "error" && (
                <div className="ml-10 mt-1">
                  <ErrorList messages={status.messages || ["Unexpected error"]} />
                </div>
              )}
            </div>
          )}
    </div>
  );
}
