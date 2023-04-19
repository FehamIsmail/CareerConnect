import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App/App';
import {BrowserRouter} from "react-router-dom";
import {RecoilRoot} from "recoil";
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <RecoilRoot>
                <GoogleOAuthProvider clientId="72616245809-t112onl2fg6ds0tso4fmoeqrer7pfjnn.apps.googleusercontent.com"><App/></GoogleOAuthProvider>;
            </RecoilRoot>
        </BrowserRouter>
    </React.StrictMode>
);

