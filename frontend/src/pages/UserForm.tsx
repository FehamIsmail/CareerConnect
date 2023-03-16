import React, {useEffect, useState} from 'react'
import {DocumentCheckIcon, DocumentPlusIcon, EnvelopeOpenIcon, XMarkIcon} from '@heroicons/react/24/outline'
import {countryList} from "../constants/constants";
import {thinScrollBarStyle} from "../constants/styles";
import axios from "axios";
import {ErrorList, getAccessToken} from "../scripts/utils";
import {useRecoilValue} from "recoil";
import {userTypeAtom} from "../constants/atoms";
import DefaultProfilePic from "../assets/default_profile_pic.png"
import {EducationLevel, EmployerProfile, StudentProfile, UserInfo} from "../constants/types";
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
    company_name: ''
}

type status = {
    type: 'success' | 'error' | 'nothing',
    message: string,
    messages?: string[]
}

export default function UserForm() {
    const [file, setFile] = useState<File | null>(null);
    const [dragging, setDragging] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<UserInfo>(emptyUserInfo);
    const [studentInfo, setStudentInfo] = useState<StudentProfile>(emptyStudentProfile);
    const [employerInfo, setEmployerInfo] = useState<EmployerProfile>(emptyEmployerProfile);
    const [status, setStatus] = useState<status>({type: 'nothing', message: ' '})
    const educationLevels = Object.values(EducationLevel);
    const role = useRecoilValue(userTypeAtom);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        const data = role === "STUDENT" ? {...userInfo, ...studentInfo} : {...userInfo, ...employerInfo}
        axios.put('http://localhost:8000/api/profile/', data,{
            headers: { Authorization: `Bearer ${getAccessToken()}`,},
        }
        ).then(res => {
            console.log(res)
            if(res.status == 200)
                setStatus({type: 'success', message: 'Changes successfully saved'})
        }).catch(err => {
            console.log(err)
            const response_messages: string[] = Object.keys(err.response.data).reduce((acc: string[], key: string) => {
                const value = err.response.data[key];
                if (typeof value === 'string') {
                    return [...acc, value];
                } else if (Array.isArray(value)) {
                    return [...acc, ...value];
                }
                return acc;
            }, []);
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
                const response_role = response.data.user.role
                const {email, first_name, last_name} = response.data.user
                const userInfo: UserInfo = {
                    email,
                    first_name,
                    last_name
                }
                if(response_role === "STUDENT")
                    setStudentInfo(prevState => ({...prevState, ...profile}))
                if(response_role === "EMPLOYER")
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
                                            <span className="cursor-pointer transition-shadow rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 rounded-md bg-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:shadow-sm">Change</span>
                                            <input id="photo-upload" name="photo-upload" type="file"
                                                   onChange={e => utils.handleFileChange(e, setFile)}
                                                   className={`sr-only`}/>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row gap-3">
                                    <div className="flex-1">
                                        <label htmlFor={role == "STUDENT" ? 'institution': 'company_name'} className="block text-sm font-medium text-gray-700">
                                            {role == "STUDENT" ? 'Institution': 'Company Name'}
                                        </label>
                                        <input
                                            type="text"
                                            name={role == "STUDENT" ? 'institution': 'company_name'}
                                            id={role == "STUDENT" ? 'institution': 'company_name'}
                                            value={(role == "STUDENT" ? studentInfo.institution : employerInfo.company_name) || ''}
                                            onChange={e => role == "STUDENT" ?  utils.handleStudentInputChange(e, setStudentInfo) :
                                                                                utils.handleEmployerInputChange(e, setEmployerInfo)}
                                            autoComplete={role == "STUDENT" ? 'institution': 'company_name'}
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

                                <div className="col-span-3">
                                    <label className="block text-sm font-medium text-gray-700">Resume</label>
                                    <div
                                        className={`${dragging ? 'border-3 border-dotted border border-gray-800' : 'border-dashed'} mt-1 flex justify-center rounded-md border-2  border-gray-300 px-6 pt-5 pb-6`}
                                        onDragOver={e => utils.handleDragOver(e, setDragging)}
                                        onDragLeave={e => utils.handleDragLeave(e, setDragging)}
                                        onDrop={e => utils.handleDrop(e, setDragging, setFile)}
                                    >
                                        <div className="space-y-1 text-center">
                                            {!dragging && (<DocumentPlusIcon
                                                className="mx-auto h-12 w-12 text-gray-400"/>)}
                                            {dragging && (<EnvelopeOpenIcon
                                                className="mx-auto h-12 w-12 text-gray-400"/>)}
                                            <div className="flex text-sm text-gray-600">
                                                <label
                                                    htmlFor="cv-file-upload"
                                                    className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                                                >
                                                    <span>Upload a pdf file</span>
                                                    <input id="cv-file-upload" name="cv-file-upload" type="file"
                                                           onChange={e => utils.handleFileChange(e, setFile)}
                                                           className={`sr-only`}/>
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">PDF only up to 10MB</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {file && (
                                <div
                                    className="text-sm mb-4 p-2 flex gap-3 rounded-md items-center flex-row border-[1px] border-gray-200">
                                    <DocumentCheckIcon className="h-4 w-4 text-gray-500"/>
                                    <div className="text-md text-gray-700">{file.name}</div>
                                    <div className="text-md text-gray-700 ml-auto">{(file.size / 1000000).toFixed(2)} MB</div>
                                    <XMarkIcon onClick={() => utils.handleFileDelete(setFile)}
                                               className="cursor-pointer h-4 w-4 text-gray-500"/>
                                </div>
                            )}
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

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                        Country
                                    </label>
                                    <select
                                        id="country"
                                        name="country"
                                        autoComplete="country-name"
                                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    >
                                        {countryList.map(country =>
                                            <option key={country}
                                                    className={`${thinScrollBarStyle}`}>{country}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-6 sm:col-span-3">
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
                                </div>
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
                                <div className="col-span-6 sm:col-span-6 md:col-span-2">
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
                                </div>
                                <div className="col-span-6 sm:col-span-3 md:col-span-2">
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
                                </div>
                                <div className="col-span-6 sm:col-span-3 md:col-span-2">
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
                                </div>
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
                <fieldset className="hidden">
                    <div className="shadow sm:overflow-hidden sm:rounded-md">
                        <div className="space-y-6 bg-white py-6 px-4 sm:p-6">
                            <div>
                                <h3 className="text-base font-semibold leading-6 text-gray-900">Notifications</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Provide basic information about the job. Be specific with the job title.
                                </p>
                            </div>

                            <fieldset>
                                <legend className="text-sm font-semibold text-gray-900">By Email</legend>
                                <div className="mt-4 space-y-4">
                                    <div className="flex items-start">
                                        <div className="flex h-5 items-center">
                                            <input
                                                id="comments"
                                                name="comments"
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="comments" className="font-medium text-gray-700">
                                                Comments
                                            </label>
                                            <p className="text-gray-500">Get notified when someones posts a comment on a
                                                posting.</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-start">
                                            <div className="flex h-5 items-center">
                                                <input
                                                    id="candidates"
                                                    name="candidates"
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor="candidates" className="font-medium text-gray-700">
                                                    Candidates
                                                </label>
                                                <p className="text-gray-500">Get notified when a candidate applies for a
                                                    job.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-start">
                                            <div className="flex h-5 items-center">
                                                <input
                                                    id="offers"
                                                    name="offers"
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor="offers" className="font-medium text-gray-700">
                                                    Offers
                                                </label>
                                                <p className="text-gray-500">Get notified when a candidate accepts or
                                                    rejects an offer.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                            <fieldset className="mt-6">
                                <legend className="text-sm font-semibold text-gray-900">Push Notifications</legend>
                                <p className="text-sm text-gray-500">These are delivered via SMS to your mobile
                                    phone.</p>
                                <div className="mt-4 space-y-4">
                                    <div className="flex items-center">
                                        <input
                                            id="push-everything"
                                            name="push-notifications"
                                            type="radio"
                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label htmlFor="push-everything" className="ml-3">
                                            <span className="block text-sm font-medium text-gray-700">Everything</span>
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="push-email"
                                            name="push-notifications"
                                            type="radio"
                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label htmlFor="push-email" className="ml-3">
                                        <span
                                            className="block text-sm font-medium text-gray-700">Same as email</span>
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="push-nothing"
                                            name="push-notifications"
                                            type="radio"
                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label htmlFor="push-nothing" className="ml-3">
                                            <span className="block text-sm font-medium text-gray-700">No push notifications</span>
                                        </label>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                            <button
                                type="submit"
                                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
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