import Header from "../components/Header/Header";
import Banner from "../components/Banner/Banner";
import Search from "../components/SearchBar/search";
import JobFilterSorting from "../components/JobFilterSorting/JobFilterSorting";
import JobList from "../components/JobList/JobList";
import JobDescription from "../components/JobDescription/JobDescription";
import React from "react";

export const LandingPage = () => {
    return (
        <>
            <Header/>
            <Banner/>
            <Search/>
            <div className="flex flex-row gap-6 px-6 md:px-[2.7%] pb-4 overflow-x-clip ">
                <div className="flex w-full flex-col md:flex-row gap-6 md:gap-[6.2%] md:w-1/2">
                    <JobFilterSorting/>
                    <JobList/>
                </div>
                <div className="hidden md:flex md:w-1/2">
                    <JobDescription job={undefined} isFromJobItem={true}/>
                </div>
            </div>
        </>
    );
};