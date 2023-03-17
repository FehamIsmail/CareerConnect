import React, {useEffect, useState} from 'react'
import {countryList} from "../constants/constants";
import {thinScrollBarStyle} from "../constants/styles";
import axios from "axios";
import {createArrayFromStrings, ErrorList, getAccessToken} from "../scripts/utils";
import {useRecoilValue} from "recoil";
import {userTypeAtom} from "../constants/atoms";
import DefaultProfilePic from "../assets/default_profile_pic.png"
import {EducationLevel, EmployerProfile, StudentProfile, UserInfo} from "../constants/types";
import { useNavigate } from 'react-router-dom';
import * as utils from "../scripts/UserFormUtils";


const emptyUserInfo:UserInfo = {
    first_name: '',
    last_name: '',
    email: '',
}

const emptyStudentProfile:StudentProfile = {
    institution: '',
    education_level: '',
    phone_number: -1,
    street_address: '',
    postal_code: '',
    province_territory: '',
    city: '',
    country: '',
    relocation: false,
    show_number: false
}

const emptyEmployerProfile:EmployerProfile = {
    company: ''
}

type status = {
    type: 'success' | 'error' | 'nothing',
    message: string,
    messages?: string[]
}

export default function UserForm() {
    const [profile_picture, setProfile_picture] = useState<File | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfo>(emptyUserInfo);
    const [studentInfo, setStudentInfo] = useState<StudentProfile>(emptyStudentProfile);
    const [employerInfo, setEmployerInfo] = useState<EmployerProfile>(emptyEmployerProfile);
    const [status, setStatus] = useState<status>({type: 'nothing', message: ' '})
    const educationLevels = Object.values(EducationLevel);
    const navigate = useNavigate();
    const role = useRecoilValue(userTypeAtom);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        const data = role === "STUDENT" ? {...userInfo, ...studentInfo} : {...userInfo, ...employerInfo}
        axios.put('http://localhost:8000/api/profile/', data,{
            headers: { Authorization: `Bearer ${getAccessToken()}`,},
        }
        ).then(res => {
            if(res.status == 200)
                setStatus({type: 'success', message: 'Changes successfully saved'})
                navigate('.', {replace: true})
        }).catch(err => {
            console.log(err.response.data)
            const response_messages: string[] = createArrayFromStrings(err.response.data)
            setStatus({type:'error', message:'Ensure that these requirements are met:', messages: response_messages})
        })
    }

    const getUserInfo = () => {
        axios.get('http://localhost:8000/api/profile/', {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
            },
        })
            .then((response: any) => {
                const profile = response.data.profile
                const userInfo = response.data.user
                if(profile.id)
                    delete profile.id
                console.log(response)
                if(userInfo.role === "STUDENT")
                    setStudentInfo(prevState => ({...prevState, ...profile}))
                if(userInfo.role === "EMPLOYER")
                    setEmployerInfo(prevState => ({...prevState, ...profile}))
                setUserInfo(userInfo);
            })
            .catch(error => {
                console.error(error);
            });
    }

    useEffect(() => {
        getUserInfo();
    }, []);

    useEffect(() => {
        console.log(profile_picture)
    }, [profile_picture]);

    return (
        <div className="space-y-6 sm:px-6 md:col-span-9 md:px-0 mr-0 md:mr-4 mb-4">
            <form onSubmit={handleSubmit} action="#" method="POST">
                <fieldset className="mt-4">
                    <div className="shadow sm:overflow-hidden sm:rounded-md">
                        <div className="space-y-6 bg-white py-6 px-4 sm:p-6">
                            <div>
                                <h3 className="text-base font-semibold leading-6 text-gray-900">Profile</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Edit your profile
                                </p>
                            </div>
                            <div className="flex flex-col gap-6">
                                <div className="col-span-3">
                                    <label className="block text-sm font-medium text-gray-700">Photo</label>
                                    <div className="mt-1 flex items-center">
                                    <span className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                                        <img alt="profile picture" className="h-full w-full text-gray-300" src={DefaultProfilePic}/>
                                    </span>
                                        <label
                                            htmlFor="photo-upload"
                                            className="ml-5 h-fit w-fit relative "
                                        >
                                            <span className="cursor-pointer transition-shadow rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-100 rounded-md bg-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:drop-shadow-sm">Change</span>
                                            <input id="photo-upload" name="photo-upload" type="file"
                                                   onChange={e => utils.handleFileChange(e, setProfile_picture, 'IMAGE', 2)}
                                                   className={`sr-only`}/>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row gap-3">
                                    <div className="flex-1">
                                        <label htmlFor={role == "STUDENT" ? 'institution': 'company'} className="block text-sm font-medium text-gray-700">
                                            {role == "STUDENT" ? 'Institution': 'Company Name'}
                                        </label>
                                        <input
                                            type="text"
                                            name={role == "STUDENT" ? 'institution': 'company'}
                                            id={role == "STUDENT" ? 'institution': 'company'}
                                            value={(role == "STUDENT" ? studentInfo.institution : employerInfo.company) || ''}
                                            onChange={e => role == "STUDENT" ?  utils.handleStudentInputChange(e, setStudentInfo) :
                                                                                utils.handleEmployerInputChange(e, setEmployerInfo)}
                                            autoComplete={role == "STUDENT" ? 'institution': 'company'}
                                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    {role == "STUDENT" && (
                                        <div className="flex-1">
                                            <label htmlFor="education_level" className="block text-sm font-medium text-gray-700">
                                                Education level
                                            </label>
                                            <select
                                                name="education_level"
                                                id="education_level"
                                                onChange={e => utils.handleOptionChange(e, setStudentInfo)}
                                                value={studentInfo.education_level || ''}
                                                autoComplete="organization"
                                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                            >
                                                <option></option>
                                                {educationLevels.map((level) => (
                                                    <option key={level} value={level}>
                                                        {level}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>

                        <div className="hidden bg-gray-50 px-4 py-3 text-right sm:px-6">
                            <button
                                type="submit"
                                className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary_dark focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <div className="mt-4 mb-4 shadow sm:overflow-hidden sm:rounded-md">
                        <div className="space-y-6 bg-white py-6 px-4 sm:p-6">
                            <div>
                                <h3 className="text-base font-semibold leading-6 text-gray-900">Personal
                                    Information</h3>
                                <p className="mt-1 text-sm text-gray-500">Use a permanent address where you can receive
                                    mail.</p>
                            </div>
                            <div className="grid grid-cols-6 gap-6">
                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                                        First name
                                    </label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        id="first_name"
                                        value={userInfo.first_name}
                                        onChange={e => utils.handleUserInputChange(e, setUserInfo)}
                                        autoComplete="given-name"
                                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                                        Last name
                                    </label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        id="last_name"
                                        value={userInfo.last_name}
                                        onChange={e => utils.handleUserInputChange(e, setUserInfo)}
                                        autoComplete="family-name"
                                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email address
                                    </label>
                                    <input
                                        type="text"
                                        name="email"
                                        id="email"
                                        value={userInfo.email}
                                        onChange={e => utils.handleUserInputChange(e, setUserInfo)}
                                        autoComplete="email"
                                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>

                                {role == "STUDENT" && <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                        Country
                                    </label>
                                    <select
                                        id="country"
                                        name="country"
                                        value={studentInfo.country || ''}
                                        autoComplete="country-name"
                                        onChange={e => utils.handleOptionChange(e, setStudentInfo)}
                                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    >
                                        {countryList.map(country =>
                                            <option key={country}
                                                    className={`${thinScrollBarStyle}`}>{country}</option>)}
                                    </select>
                                </div>}
                                {role == "STUDENT" && <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="street-address" className="block text-sm font-medium text-gray-700">
                                        Street address
                                    </label>
                                    <input
                                        type="text"
                                        name="street-address"
                                        id="street-address"
                                        autoComplete="street-address"
                                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>}
                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone-number"
                                        id="phone-number"
                                        autoComplete="tel"
                                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                {role == "STUDENT" && <div className="col-span-6 sm:col-span-6 md:col-span-2">
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        id="city"
                                        autoComplete="address-level2"
                                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>}
                                {role == "STUDENT" && <div className="col-span-6 sm:col-span-3 md:col-span-2">
                                    <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                                        State / Province
                                    </label>
                                    <input
                                        type="text"
                                        name="region"
                                        id="region"
                                        autoComplete="address-level1"
                                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>}
                                {role == "STUDENT" && <div className="col-span-6 sm:col-span-3 md:col-span-2">
                                    <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">
                                        ZIP / Postal code
                                    </label>
                                    <input
                                        type="text"
                                        name="postal-code"
                                        id="postal-code"
                                        autoComplete="postal-code"
                                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>}
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                            <button
                                type="submit"
                                className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary_dark focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </fieldset>
            </form>
            {status.type !== 'nothing' && (
                <div className={`${status.type == 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} mb-3 inline-flex w-full flex flex-col gap-1 rounded-lg py-5 px-6 text-base`}>
                    <div
                        className={`flex flex-row items-center `}
                        role="alert">
                            <span className="flex mr-2 items-center">
                                {status.type === 'success' ? (<svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="h-5 w-5">
                                        <path
                                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"/>
                                    </svg>) : (
                                    <svg aria-hidden="true" className="flex-shrink-0 inline w-5 h-5 mr-3"
                                         fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                        ></path>
                                    </svg>)}
                            </span>
                            <span className="font-[500]">{status.message}</span>

                    </div>
                    {status.type === 'error' &&
                        <div className="ml-10 mt-1">
                            <ErrorList messages={status.messages || ['Unexpected error']}/>
                        </div>
                    }
                </div>
            )}
        </div>
    )
}