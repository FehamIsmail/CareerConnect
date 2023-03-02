import React, {useEffect, useState} from 'react'
import {
    DocumentPlusIcon,
    DocumentCheckIcon,
    XMarkIcon,
    EnvelopeOpenIcon
} from '@heroicons/react/24/outline'
import {countryList} from "../constants/constants";
import {thinScrollBarStyle} from "../constants/styles";
import axios from "axios";
import {getAccessToken} from "../scripts/utils";

type UserInfo = {
    first_name: string,
    last_name: string,
    email: string,
    education?: string,
}

const emptyUserInfo:UserInfo = {
    first_name: '',
    last_name: '',
    email: '',
    education: '',
}

export default function UserForm() {
    const [file, setFile] = useState<File | null>(null);
    const [dragging, setDragging] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<UserInfo>(emptyUserInfo)

    const handleSubmit = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        axios.post('http://localhost:8000/api/profile', userInfo).then(res => console.log(res))
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        console.log(file)
        setFile(file);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        setFile(file);
    };

    const handleFileDelete = () => {
        setFile(null)
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUserInfo(prevState => ({
            ...prevState,
            [name]: value,
        }));
    }

    const getUserInfo = () => {
        axios.get('https://localhost:8000/api/token', {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
            },
        })
            .then((response: any) => {
                // handle success
                const education = response.data.profile.education
                const {email, first_name, last_name} = response.data.profile.user
                const profile: UserInfo = {
                    education,
                    email,
                    first_name,
                    last_name
                }
                setUserInfo(profile);
                console.log(response);
            })
            .catch(error => {
                // handle error
                console.error(error);
            });
    }

    useEffect(() => {
        getUserInfo();
    }, []);

    return (
        <div className="space-y-6 sm:px-6 md:col-span-9 md:px-0 mr-0 sm:mr-4 md:mr-8">
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

                            <div className="grid grid-cols-3 gap-6">
                                <div className="col-span-3">
                                    <label className="block text-sm font-medium text-gray-700">Photo</label>
                                    <div className="mt-1 flex items-center">
                                    <span className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                                      <svg className="h-full w-full text-gray-300" fill="currentColor"
                                           viewBox="0 0 24 24">
                                        <path
                                            d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"/>
                                      </svg>
                                    </span>
                                        <button
                                            type="button"
                                            className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            Change
                                        </button>
                                    </div>
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="education" className="block text-sm font-medium text-gray-700">
                                        Education
                                    </label>
                                    <input
                                        type="text"
                                        name="education"
                                        id="education"
                                        value={userInfo.education}
                                        onChange={handleInputChange}
                                        autoComplete="education"
                                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>

                                <div className="col-span-3">
                                    <label className="block text-sm font-medium text-gray-700">Resume</label>
                                    <div
                                        className={`${dragging ? 'border-3 border-dotted border border-gray-800' : 'border-dashed'} mt-1 flex justify-center rounded-md border-2  border-gray-300 px-6 pt-5 pb-6`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        <div className="space-y-1 text-center">
                                            {!dragging && (<DocumentPlusIcon
                                                className="mx-auto h-12 w-12 text-gray-400"/>)}
                                            {dragging && (<EnvelopeOpenIcon
                                                className="mx-auto h-12 w-12 text-gray-400"/>)}
                                            <div className="flex text-sm text-gray-600">
                                                <label
                                                    htmlFor="file-upload"
                                                    className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                                                >
                                                    <span>Upload a pdf file</span>
                                                    <input id="file-upload" name="file-upload" type="file"
                                                           onChange={handleChange}
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
                                    <div className="text-md text-gray-700 ml-auto">{file.size / 1000} MB</div>
                                    <XMarkIcon onClick={handleFileDelete}
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
                                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                        First name
                                    </label>
                                    <input
                                        type="text"
                                        name="first-name"
                                        id="first-name"
                                        value={userInfo.first_name}
                                        onChange={handleInputChange}
                                        autoComplete="given-name"
                                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                                        Last name
                                    </label>
                                    <input
                                        type="text"
                                        name="last-name"
                                        id="last-name"
                                        value={userInfo.last_name}
                                        onChange={handleInputChange}
                                        autoComplete="family-name"
                                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email address (Contact only)
                                    </label>
                                    <input
                                        type="text"
                                        name="email"
                                        id="email"
                                        value={userInfo.email}
                                        onChange={handleInputChange}
                                        autoComplete="email"
                                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>

                                <div className="hidden col-span-6 sm:col-span-3">
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
                                <div className="hidden col-span-6">
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
                                <div className="hidden col-span-6 sm:col-span-6 md:col-span-2">
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
                                <div className="hidden col-span-6 sm:col-span-3 md:col-span-2">
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
                                <div className="hidden col-span-6 sm:col-span-3 md:col-span-2">
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
        </div>
    )
}