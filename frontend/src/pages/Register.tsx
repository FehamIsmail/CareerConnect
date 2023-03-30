import React, {useState} from "react";
import logo from "../assets/logo_nobg.svg";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

enum ErrorType {
    PASSWORD = "Please review your password",
    EMAIL = "Please review your email",
    BOTH = "Please resolve the remaining errors",
    UNKNOWN = "Unknown error has occurred"
}

interface ErrorProp {
    messages: string[]
}

const ErrorList = (props:ErrorProp) => {
    const {messages} = props
    return (
        <ul>
            {messages.map((message, index) => (
                <li className="mt-2" key={index}>• {message}</li>
            ))}
        </ul>
    );
};


export function Register() {
    const [error, setError] = useState<string>('')
    const [messages, setMessages] = useState<string[]>([])
    const [showAlert, setShowAlert] = useState<boolean>(false)
    const [isStudent, setIsStudent] = useState<boolean>(true)
    const navigate = useNavigate();

    const handleRegister = (e: any) => {
        e.preventDefault();
        const email = e.target['email'].value
        const password1 = e.target['password'].value
        const password2 = e.target['repeat-password'].value
        const first_name = e.target['first_name'].value
        const last_name = e.target['last_name'].value
        const organization = e.target['organization'].value
        const role = isStudent ? 'STUDENT' : 'EMPLOYER'
        let user_data: {[k: string]: any} = {
            email,
            first_name,
            last_name,
            password: password1,
            confirm_password: password2,
            role
        }
        if(isStudent)
            user_data.institution = organization
        else
            user_data.company_name = organization

        if (password1===password2) {
            axios.post('http://localhost:8000/api/register/', user_data)
            .then(res => {
                console.log(res)
                navigate('/login');
                setShowAlert(true)
            }).catch(err => {
                const res = err.response.data
                let messages:string[] = [];
                if(res.email && res.password){
                    messages = messages.concat(res.email)
                    messages = messages.concat(res.password)
                    setError(ErrorType.BOTH)
                }
                else if(res.email){
                    messages = messages.concat(res.email)
                    setError(ErrorType.EMAIL)
                }
                else if(res.password){
                    messages = messages.concat(res.password)
                    setError(ErrorType.PASSWORD)
                }
                else{
                    messages = messages.concat(err.statusText)
                    setError(ErrorType.UNKNOWN)
                }
                console.log(messages)
                setMessages(messages);
                setShowAlert(true);
            })
        } else {
            setError('Mismatched Password')
            setMessages(['Make sure the passwords are the same'])
            setShowAlert(true)
        }
    }

    const handleStudentChange = (e:any) => {
        setIsStudent(e.target.checked)
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
                        Register your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600"></p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    {showAlert && (
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
                                    <ErrorList messages={messages}/>
                                </div>
                            </div>
                        </div>)}
                    <div className="mt-4 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form onSubmit={handleRegister} className="space-y-6" action="/api/register" method="POST">
                            <div className="flex flex-row gap-3">
                                <div className="w-full">
                                    <label
                                        htmlFor="first_name"
                                        className={`block text-sm font-medium text-gray-700`}
                                    >
                                        First Name
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="first_name"
                                            name="first_name"
                                            type="text"
                                            autoComplete="given-name"
                                            required
                                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="w-full">
                                    <label
                                        htmlFor="last_name"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Last Name
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="last_name"
                                            name="last_name"
                                            type="text"
                                            autoComplete="family-name"
                                            required
                                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="email"
                                    className={` ${(showAlert && (error===ErrorType.EMAIL || error===ErrorType.BOTH)) ? 'text-red-600' : ''} block text-sm font-medium text-gray-700`}
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
                                        className={`${(showAlert && (error===ErrorType.EMAIL || error === ErrorType.BOTH)) ? 'border-red-600 border-[1px]' : ''} block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className={`${(showAlert && (error === ErrorType.PASSWORD || error === ErrorType.BOTH)) ? 'text-red-600' : ''} block text-sm font-medium text-gray-700`}
                                >
                                    Password
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="password"
                                        required
                                        className={`${(showAlert && (error === ErrorType.PASSWORD || error === ErrorType.BOTH)) ? 'border-red-600 border-[1px]' : ''} block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="repeat-password"
                                    className={`${(showAlert && (error === ErrorType.PASSWORD || error === ErrorType.BOTH)) ? 'text-red-600' : ''} block text-sm font-medium text-gray-700`}
                                >
                                    Confirm Password
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="repeat-password"
                                        name="repeat-password"
                                        type="password"
                                        autoComplete=""
                                        required
                                        className={`${(showAlert && (error === ErrorType.PASSWORD || error === ErrorType.BOTH)) ? 'border-red-600 border-[1px]' : ''} block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        checked={isStudent}
                                        onChange={handleStudentChange}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label
                                        htmlFor="remember-me"
                                        className="ml-2 block text-sm text-gray-900"
                                    >
                                        <span>I am a <b className="font-[500]">Student</b></span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="organization"
                                    className={`block text-sm font-medium text-gray-700`}
                                >
                                    {isStudent ? "Institution Name" : "Company Name"}
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="organization"
                                        name="organization"
                                        type="text"
                                        autoComplete=""
                                        required
                                        className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Register
                                </button>
                            </div>
                        </form>

                        <div className="mt-6">
                            <div className="relative hidden">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"/>
                                </div>
                                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">
                    Or continue with
                  </span>
                                </div>
                            </div>
                            <div
                                className="space-y-4 mt-2 text-sm text-gray-900 sm:flex sm:items-center sm:justify-center sm:space-y-0 sm:space-x-4">
                                <p className="text-center sm:text-left">
                                    Existing user?
                                </p>
                                <Link
                                    className="inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 text-slate-900 ring-1 ring-slate-900/10 hover:ring-slate-900/20"
                                    to="../login"
                                >
                                  <span>
                                    Login Now <span aria-hidden="true">→</span>
                                  </span>
                                </Link>
                            </div>
                            <div className="mt-6 grid grid-cols-3 gap-3 hidden">
                                <div>
                                    <a
                                        href="#"
                                        className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                                    >
                                        <span className="sr-only">Sign in with Facebook</span>
                                        <svg
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </a>
                                </div>
                                <div>
                                    <a
                                        href="#"
                                        className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                                    >
                                        <span className="sr-only">Sign in with Twitter</span>
                                        <svg
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"/>
                                        </svg>
                                    </a>
                                </div>
                                <div>
                                    <a
                                        href="#"
                                        className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                                    >
                                        <span className="sr-only">Sign in with GitHub</span>
                                        <svg
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}