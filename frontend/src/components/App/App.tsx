import React, {useEffect, useRef, useState} from 'react';
import {Route, Routes} from "react-router-dom";
import {LandingPage} from "../../pages/LandingPage";
import UserForm from "../../pages/UserForm";
import {SideNav} from "../../pages/SideNav";
import {LogIn} from "../../pages/LogIn";
import {Register} from "../../pages/Register";
import DocumentsPage from "../../pages/DocumentsPage";
import {useWindowDimensions} from "../../scripts/utils";
import JobForm from '../../pages/JobForm';
import Candidate from '../../pages/Candidate';
import JobSelect from '../../pages/JobSelect';
import JobEdit from '../../pages/JobEdit';
import ApplicationsPage from '../../pages/ApplicationsPage';

const App = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={containerRef}>
            <Routes>
                <Route path="" element={<LandingPage/>}/>
                <Route path="user" element={<SideNav/>}>
                    <Route path="profile" element={<UserForm />}/>
                    <Route path="documents" element={<DocumentsPage />}/>
                    <Route path="applications" element={<ApplicationsPage />}/>
                </Route>
                <Route path="job" element={<SideNav/>}>
                    <Route path="create" element={<JobForm />}/>
                    <Route path="JobSelect" element={<JobSelect pathSegment='candidates' />}/>
                    <Route path="candidates/:jobID" element={<Candidate />}/>
                    <Route path="JobEditSelect" element={<JobSelect pathSegment='edit' />}/>
                    <Route path="edit/:jobID" element={<JobEdit />}/>
                </Route>
                <Route path="login" element={<LogIn/>}/>
                <Route path="register" element={<Register/>}/>
            </Routes>
        </div>
    );
}

export default App;
