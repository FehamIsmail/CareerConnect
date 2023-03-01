import React from 'react';
import {RecoilRoot} from 'recoil'
import Header from '../Header/Header';
import Banner from '../Banner/Banner';
import JobList from "../JobList/JobList";
import JobFilterSorting from "../JobFilterSorting/JobFilterSorting";
import JobDescription from "../JobDescription/JobDescription";
import Search from '../SearchBar/search';

const App = () => {
    return (
        <RecoilRoot>
            <Header isStudent={true} loggedIn={false}/>
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
        </RecoilRoot>
    )
}

export default App;
