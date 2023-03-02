import React from 'react';
import {Route, Routes} from "react-router-dom";
import {LandingPage} from "../../pages/LandingPage";
import UserForm from "../../pages/UserForm";
import {UserNav} from "../../pages/UserNav";
import {LogIn} from "../../pages/LogIn";
import {Register} from "../../pages/Register";

const App = () => {
    return (
        <div>
            <Routes>
                <Route path="" element={<LandingPage/>}/>
                <Route path="job" element={<UserNav />}>
                    <Route path="create" element={<UserForm />}/>
                </Route>
                <Route path="login" element={<LogIn/>}/>
                <Route path="register" element={<Register/>}/>
            </Routes>
        </div>
    )
}

export default App;
