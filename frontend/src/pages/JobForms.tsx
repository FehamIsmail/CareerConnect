import React, {useEffect, useState} from "react";
import { jobFormOptions } from "../constants/FormConstants";
import { IJob, JobType, status, dict } from "../constants/types";
import * as utils from "../scripts/UserFormUtils";
import { thinScrollBarStyle } from "../constants/styles";
import {createArrayFromStrings, ErrorList, getAccessToken} from "../scripts/utils";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DefaultJobPic = "https://media.istockphoto.com/id/1249853728/vector/briefcase-suitcase-business-portfolio-bag-icon-logo.jpg?s=612x612&w=0&k=20&c=cdkn01u3B6m6LpsXijNnNdPjNGindHrUMmEyd2tHbwE="
const defaultJobInfo: IJob = {
    id: 0,
    title: '',
    types: [],
    company: '',
    short_description: '',
    description: '',
    street_address: '',
    city: '',
    province_territory: '',
    postal_code: '',
    relocation: false,
    salary: null,
    posted_date: new Date(Date.now()),
    apply_by_date: null,
    contact_email: '',
    contact_phone: null,
    website_url:  null,
    company_logo: null,
}

export default function JobForms(){
    const [profile_picture, setProfile_picture] = useState<File | null>(null);
    const [jobInfo, setJobInfo] = useState<IJob>(defaultJobInfo)
    const [status, setStatus] = useState<status>({
        type: "nothing",
        message: " ",
      });
      const navigate = useNavigate();

    const inputValue: dict = {
        title: {
            value: jobInfo.title || '',
            onChange: (e: any) => utils.handleJobChange(e, setJobInfo),
          },
          relocation: {
            value: jobInfo.relocation || '',
            onChange: (e: any) => utils.handleJobChange(e, setJobInfo),
            selectOptions: ['true', 'false']
          },
          types: {
            value: jobInfo.types || '',
            onChange: (e: any) => utils.handleJobChange(e, setJobInfo),
            selectOptions: Object.values(JobType)
          },
          salary: {
            value: jobInfo.salary,
            onChange: (e: any) => utils.handleJobChange(e, setJobInfo),
          },
          short_description:{
            value: jobInfo.short_description || '',
            onChange: (e: any) => utils.handleJobChange(e, setJobInfo),
          },
        apply_by_date: {
            value: jobInfo.apply_by_date,
            onChange: (e: any) => utils.handleJobChange(e, setJobInfo),
        },
         description:{
            value: jobInfo.description || '',
            onChange: (e: any) => utils.handleJobChange(e, setJobInfo),
          },
          company:{
            value: jobInfo.company || '',
            onChange: (e: any) => utils.handleJobChange(e, setJobInfo),
          },
          street_address:{
            value: jobInfo.street_address || '',
            onChange: (e: any) => utils.handleJobChange(e, setJobInfo),
          },
          city:{
            value: jobInfo.city || '',
            onChange: (e: any) => utils.handleJobChange(e, setJobInfo),
          },
          province_territory:{
            value: jobInfo.province_territory || '',
            onChange: (e: any) => utils.handleJobChange(e, setJobInfo),
          },
          postal_code:{
            value: jobInfo.postal_code || '',
            onChange: (e: any) => utils.handleJobChange(e, setJobInfo),
          },
          contact_email:{
            value: jobInfo.contact_email || '',
            onChange: (e: any) => utils.handleJobChange(e, setJobInfo),
          },
          contact_phone:{
            value: jobInfo.contact_phone || '',
            onChange: (e: any) => utils.handleJobChange(e, setJobInfo),
          },
          website_url:{
            value: jobInfo.website_url || '',
            onChange: (e: any) => utils.handleJobChange(e, setJobInfo),
          },

    }

    useEffect(() => {
        if (profile_picture) {
          const reader = new FileReader();
          reader.readAsDataURL(profile_picture);
          reader.onload = () => {
            const imageUrl = reader.result as string; // The data URL
            // Set the source of your <img> element to the data URL
            const img = document.getElementById(
              "profile-picture-img"
            ) as HTMLImageElement;
            img.src = imageUrl;
          };
        }
      }, [profile_picture]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        let data;
        if(profile_picture)
            data = {...jobInfo, company_logo: profile_picture}
        else{
            const DefaultJobPictureFILE = await utils.createFileObjectFromImageUrl(DefaultJobPic, 'default_job_picture.jpg');
            data = {...jobInfo, company_logo: DefaultJobPictureFILE}
        }
        console.log(data)
        axios
            .post("http://localhost:8000/api/jobs/", data, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((res) => {
                if (res.status == 201)
                    setStatus({ type: "success", message: "Job created successfully" });
                setJobInfo(defaultJobInfo);
                navigate(".", { replace: true });
            })
            .catch((err) => {
                console.log(err.response.data);
                const response_messages: string[] = createArrayFromStrings(
                    err.response.data
                );
                setStatus({
                    type: "error",
                    message: "Ensure that these requirements are met:",
                    messages: response_messages,
                });
            });
      };

    return (
        <div className="space-y-6 sm:px-6 md:col-span-9 md:px-0 mr-0 md:mr-4 mb-4">
            <fieldset className="mt-4">
            <div className="shadow sm:overflow-hidden sm:rounded-md">
              <div className="space-y-6 bg-white py-6 px-4 sm:p-6">
                <div>
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    Company logo
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Edit your company logo
                  </p>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Photo
                    </label>
                    <div className="mt-1 flex items-center">
                      <span className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100 border border-gray-300">
                        <img
                          id="profile-picture-img"
                          alt="profile picture"
                          className="h-full w-full text-gray-300 object-cover"
                          src={
                            jobInfo.company_logo || DefaultJobPic
                          }
                        />
                      </span>
                      <label
                        htmlFor="photo-upload"
                        className="ml-5 h-fit w-fit relative "
                      >
                        <span className="cursor-pointer transition-shadow rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-100 rounded-md bg-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:drop-shadow-sm">
                          Change
                        </span>
                        <input
                          id="photo-upload"
                          name="photo-upload"
                          type="file"
                          onChange={(e) =>
                            utils.handleFileChange(
                              e,
                              setProfile_picture,
                              "IMAGE",
                              3
                            )
                          }
                          className={`sr-only`}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </fieldset>
          <form onSubmit={handleSubmit} action="#" method="POST">
            {jobFormOptions.map((opt, index) => {
              return (
                <fieldset>
                  <div className="mt-4 mb-4 shadow sm:overflow-hidden sm:rounded-md">
                    <div className="space-y-6 bg-white py-6 px-4 sm:p-6">
                      <div>
                        <h3 className="text-base font-semibold leading-6 text-gray-900">
                          {opt.header}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {opt.subheader}
                        </p>
                      </div>
                      <div className="grid grid-cols-6 gap-6">
                        {opt.inputs.map((i, index) => {
                          return (
                            <div key={index} className={"col-span-6 " + (i.name !== "description" && "sm:col-span-3")}>
                              <label
                                htmlFor={i.name}
                                className="block text-sm font-medium text-gray-700"
                              >
                                {i.label}
                              </label>
                              {i.element == "input" ? (
                                <input
                                  type={i.type}
                                  name={i.name}
                                  id={i.id}
                                  value={inputValue[i.name].value}
                                  onChange={inputValue[i.name].onChange}
                                  autoComplete={i.autoComplete}
                                  className={i.className}
                                />
                              ) : i.element == 'select'? (
                                <select
                                  id={i.id}
                                  name={i.name}
                                  value={inputValue[i.name].value}
                                  onChange={inputValue[i.name].onChange}
                                  autoComplete={i.autoComplete}
                                  className={i.className}
                                >
                                  {inputValue[i.name].selectOptions.map(
                                    (value: any) =>
                                        <option key={value} className={thinScrollBarStyle}>{value}</option>
                                  )}
                                </select>
                              ) : (
                                <textarea
                                  id={i.id}
                                  name={i.name}
                                  value={inputValue[i.name].value}
                                  onChange={inputValue[i.name].onChange}
                                  autoComplete={i.autoComplete}
                                  className={i.className}
                                  />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  {index + 1 === jobFormOptions.length && (
                    <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary_dark focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </fieldset>
              );
            })}
          </form>
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