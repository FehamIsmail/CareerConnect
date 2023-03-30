import React, {useEffect, useRef, useState} from 'react';
import {Route, Routes} from "react-router-dom";
import {LandingPage} from "../../pages/LandingPage";
import UserForm from "../../pages/UserForm";
import {UserNav} from "../../pages/UserNav";
import {LogIn} from "../../pages/LogIn";
import {Register} from "../../pages/Register";
import DocumentsPage from "../../pages/DocumentsPage";
// import ApplicationsPage from "../../pages/Applications";
import {useWindowDimensions} from "../../scripts/utils";
import JobForm from '../../pages/JobForm';

const App = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isOverflowing, setIsOverflowing] = useState<boolean>(false)
    const { height } = useWindowDimensions()

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        setIsOverflowing(container.scrollHeight > height)
    }, [containerRef.current?.scrollHeight, height]);

    return (
        <div ref={containerRef} className={`${!isOverflowing ? '-mr-4' : ''}`}>
            <Routes>
                <Route path="" element={<LandingPage/>}/>
                <Route path="user" element={<UserNav isUser={true}/>}>
                    <Route path="profile" element={<UserForm />}/>
                    <Route path="documents" element={<DocumentsPage />}/>
                    {/*<Route path="applications" element={<ApplicationsPage />}/>*/}
                </Route>
                <Route path="job" element={<UserNav isUser={false}/>}>
                    <Route path="create" element={<JobForm />}/>
                </Route>
                <Route path="login" element={<LogIn/>}/>
                <Route path="register" element={<Register/>}/>
            </Routes>
        </div>
    );
}

export default App;
