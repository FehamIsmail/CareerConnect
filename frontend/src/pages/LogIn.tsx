import React, {useState} from "react";
import logo from "../assets/logo_nobg.svg";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {setAccessToken, setAuthenticated, setRefreshToken} from "../scripts/utils";
import {useSetRecoilState} from "recoil";
import {authAtom, userTypeAtom} from "../constants/atoms";
import { useGoogleLogin } from '@react-oauth/google';
// @ts-ignore
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
// @ts-ignore
import GitHubLogin from 'react-github-login';



export function LogIn() {
    const [error, setError] = useState<string>(' ')
    const [message, setMessage] = useState<string>(' ')
    const [showAlert, setShowAlert] = useState<boolean>(false)
    const setAuth = useSetRecoilState(authAtom);
    const setUserType = useSetRecoilState(userTypeAtom);
    const navigate = useNavigate();

    const googleLogin = useGoogleLogin({
        onSuccess: tokenResponse => loginWithGoogle(tokenResponse),
    });

    const responseFacebook = (response: any) => {
        loginWithFacebook(response);
    }


    const onSuccessGithub = (response: any) => {
        console.log("SUCCESS")
        // console.log(response);
        const code = response.code
        axios.get('http://localhost:8000/api/github_oauth/', {params: {code}})
            .then(r =>{
                console.log("YOUR ACCESS TOKEN:" + r.data.access_token)
                loginWithGithub(r.data.access_token)
            });
    }
    const onFailureGithub = (response: any) => {
        console.log("FAIL")
        console.log(response);
    }

    const defaultLogin = (e: any) => {
        e.preventDefault();
        const email = e.target['email'].value
        const password = e.target['password'].value
        const data = {
            grant_type: 'password',
            username: email,
            password: password,
            client_id: process.env.REACT_APP_CLIENT_ID,
            client_secret: process.env.REACT_APP_CLIENT_SECRET,
        }
        requestLogin(data, 'auth/token')
    }

    const loginWithGoogle = (response: any) => {
        const data = {
            token: response.access_token,
            backend: 'google-oauth2',
            grant_type: 'convert_token',
            client_id: process.env.REACT_APP_CLIENT_ID,
            client_secret: process.env.REACT_APP_CLIENT_SECRET,
        }
        console.log(data)
        requestLogin(data, 'auth/convert-token')
    };

    const loginWithFacebook = (response: any) => {
        const data = {
            token: response.accessToken,
            backend: 'facebook',
            grant_type: 'convert_token',
            client_id: process.env.REACT_APP_CLIENT_ID,
            client_secret: process.env.REACT_APP_CLIENT_SECRET,
        }
        console.log(data)
        requestLogin(data, 'auth/convert-token')
    };

    const loginWithGithub = (response: any) => {
        console.log(response)
        const data = {
            token: response,
            backend: 'github',
            grant_type: 'convert_token',
            client_id: process.env.REACT_APP_CLIENT_ID,
            client_secret: process.env.REACT_APP_CLIENT_SECRET,
        }
        console.log(data)
        requestLogin(data, 'auth/convert-token')
    };

    function requestLogin(data:any, endpoint:string){
        axios.post(`http://localhost:8000/${endpoint}`, data)
            .then(res => {
                if (res.status == 200) {
                    console.log(res)
                    setAccessToken(res.data.access_token)
                    setRefreshToken(res.data.refresh_token)
                    setAuth({ isAuthenticated: true });
                    setAuthenticated(true)
                    // Fetch user profile after successful login
                    return axios.get('http://localhost:8000/api/profile/', {
                        headers: {
                            Authorization: `Bearer ${res.data.access_token}`,
                        },
                    });
                }
            })
            .then((response: any) => {
                console.log(response)
                const role = response.data.user.role
                setUserType(role)
                if (role === "STUDENT")
                    localStorage.setItem('role', 'STUDENT')
                if (role === "EMPLOYER")
                    localStorage.setItem('role', 'EMPLOYER')
                navigate('/');
            })
            .catch(err => {
                console.log(err)
                setError('Invalid Credentials')
                setMessage('Make sure the email and password are valid')
                setShowAlert(true)
            });
    }

    return (
        <>
            <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 ">
                <div className="sm:mx-auto sm:w-full sm:max-w-md flex justify-center items-center flex-col mt-20">
                    <Link to="../">
                        <div className="px-2.5 py-3 rounded-lg bg-indigo-600 w-20 ">
                            <img
                                className="mx-auto h-12 w-auto svg-white"
                                src={logo}
                                alt="Your Company"
                            />
                        </div>
                    </Link>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600"></p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    { showAlert && (
                    <div className="bg-red-100 border-t-4 border-red-500 rounded-b text-red-900 px-4 py-3 shadow-default"
                         role="alert">
                        <div className="flex">
                            <div className="py-1">
                                <svg className="fill-current h-6 w-6 text-red-500 mr-4"
                                     xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path
                                        d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
                                </svg>
                            </div>
                            <div>
                                <p className="font-bold">{error}</p>
                                <p className="text-sm">{message}</p>
                            </div>
                        </div>
                    </div>)}
                    <div className="mt-4 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form onSubmit={defaultLogin} className="space-y-6" action="#" method="POST">
                            <div>
                                <label
                                    htmlFor="email"
                                    className={`${showAlert ? 'text-red-600' : ''} block text-sm font-medium text-gray-700`}
                                >
                                    Email address
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className={`${showAlert ? 'border-red-600 border-[1px]' : ''} block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className={`${showAlert ? 'text-red-600' : ''} block text-sm font-medium text-gray-700`}
                                >
                                    Password
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className={`${showAlert ? 'border-red-600 border-[1px]' : ''} block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label
                                        htmlFor="remember-me"
                                        className="ml-2 block text-sm text-gray-900"
                                    >
                                        Remember me
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <a
                                        href="#"
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Sign in
                                </button>
                            </div>
                        </form>
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                  <span className="bg-white px-2 text-gray-500">
                                    Or continue with
                                  </span>
                                </div>
                            </div>
                            <div className="mt-6 grid grid-cols-3 gap-3">
                                <div style={{cursor:"pointer"}}>
                                    <div
                                        onClick={() => googleLogin()}
                                        className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                                    >
                                        <span className="sr-only">Sign in with Google</span>
                                        <img
                                            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                                            alt="Google logo"
                                            className="h-5 w-5"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <FacebookLogin
                                      appId="1628327201021031"
                                      callback={responseFacebook}
                                      render={(renderProps: any) => (
                                            <div
                                                onClick={renderProps.onClick}
                                                className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                                            >
                                                <span className="sr-only">Sign in with Facebook</span>
                                                <img
                                                    src="https://upload.wikimedia.org/wikipedia/commons/9/91/036-facebook.png"
                                                    alt="Facebook logo"
                                                    className="h-5 w-5"
                                                />
                                            </div>
                                      )}
                                    />
                                </div>
                                <div>
                                    <GitHubLogin
                                        clientId="13dc470a1b66e85f483e"
                                        redirectUri=""
                                        onSuccess={onSuccessGithub}
                                        onFailure={onFailureGithub}
                                        className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                                        buttonText={
                                            (
                                                <div>
                                                    <span className="sr-only">Sign in with GitHub</span>
                                                    <img
                                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/640px-Octicons-mark-github.svg.png"
                                                    alt="GitHub logo"
                                                    className="h-5 w-5"
                                                />
                                                </div>
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <div className="space-y-4 mt-4 text-sm text-gray-900 sm:flex sm:items-center sm:justify-center sm:space-y-0 sm:space-x-4">
                                <p className="text-center sm:text-left">
                                    Don't have an account?
                                </p>
                                <Link
                                    className="inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 text-slate-900 ring-1 ring-slate-900/10 hover:ring-slate-900/20"
                                    to="../register"
                                >
                                  <span>
                                    Register now <span aria-hidden="true">→</span>
                                  </span>
                                </Link>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
