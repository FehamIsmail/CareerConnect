import Header from "../components/Header/Header";
import Banner from "../components/Banner/Banner";
import Search from "../components/SearchBar/Search";
import JobFilterSorting from "../components/JobFilterSorting/JobFilterSorting";
import JobList from "../components/JobList/JobList";
import JobDescription from "../components/JobDescription/JobDescription";
import React, {useEffect} from "react";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {authAtom, filteredJobListSelector, jobListAtom} from "../constants/atoms";
import axios from "axios";
import {getAccessToken} from "../scripts/utils";
import {JobType} from "../constants/types";

export const LandingPage = () => {
    const jobListSetter = useSetRecoilState(jobListAtom)
    const {isAuthenticated} = useRecoilValue(authAtom)
    const filteredJobList = useRecoilValue(filteredJobListSelector)

    useEffect(() => {
        const headers:any = { 'Content-Type': 'application/json' };
        if (isAuthenticated) {
            console.log('here')
            headers.Authorization = `Bearer ${getAccessToken()}`;
        }
        axios({
                method: 'get',
                url: 'http://localhost:8000/api/jobs/',
                params: {
                    self_only: false
                },
                headers
            }
        ).then(res => {
            const updatedJobs = res.data.map((job:any) => {
                return {
                    ...job,
                    types: job.types?.split(',').map((type:string) => JobType[type.trim() as keyof typeof JobType])
                };
            });
            jobListSetter(() => updatedJobs)
        }).catch(err => {
            console.log(err)
        })

    }, [])

    return (
        <>
            <Header/>
            <Banner/>
            <Search/>
            <div className="flex flex-row gap-6 px-6 md:px-[2.7%] pb-4 overflow-x-clip ">
                <div className="flex w-full flex-col md:flex-row gap-6 md:gap-[6.2%] md:w-1/2">
                    <JobFilterSorting />
                    {filteredJobList.length > 0 ? <JobList/> : <h1 className="relative translate-x-[18.5rem] translate-y-[1.5rem] text-[2rem] text-center font-semibold">No jobs found/posted</h1>}
                </div>
                <div className="hidden md:flex md:w-1/2">
                    {filteredJobList.length > 0 && <JobDescription job={undefined} isFromJobItem={true}/>}
                </div>
            </div>
        </>
    );
};