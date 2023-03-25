import React from 'react';
import {Route, Routes} from "react-router-dom";
import {LandingPage} from "../../pages/LandingPage";
import UserForm from "../../pages/UserForm";
import {UserNav} from "../../pages/UserNav";
import {LogIn} from "../../pages/LogIn";
import {Register} from "../../pages/Register";
import JobForms from '../../pages/JobForms';

const App = () => {
    return (
        <div>
            <Routes>
                <Route path="" element={<LandingPage/>}/>
                <Route path="user" element={<UserNav isUser/>}>
                    <Route path="edit" element={<UserForm />}/>
                </Route>
                <Route path="Job" element={<UserNav isUser={false} />}>
                    <Route path="create" element={<JobForms />}/>
                </Route>
                <Route path="login" element={<LogIn/>}/>
                <Route path="register" element={<Register/>}/>
            </Routes>
        </div>
    )
}

export default App;
