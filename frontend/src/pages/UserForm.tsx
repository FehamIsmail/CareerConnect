import React, {useEffect, useState} from 'react'
import {countryList} from "../constants/constants";
import {thinScrollBarStyle} from "../constants/styles";
import axios from "axios";
import {createArrayFromStrings, getAccessToken} from "../scripts/utils";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {userTypeAtom} from "../constants/atoms";
import DefaultProfilePic from "../assets/default_profile_pic.png"
import {EducationLevel, educationLevelDetails, EmployerProfile, StudentProfile, UserInfo} from "../constants/types";
import {useNavigate} from 'react-router-dom';
import * as utils from "../scripts/UserFormUtils";
import {Status} from "../components/StatusBar/Status";


const emptyUserInfo:UserInfo = {
  first_name: '',
  last_name: '',
  email: '',
}

const emptyStudentProfile:StudentProfile = {
  institution: '',
  education_level: EducationLevel.HIGH_SCHOOL,
  field_of_study: '',
  phone_number: NaN,
  street_address: '',
  profile_picture: null,
  postal_code: '',
  province_territory: '',
  city: '',
  country: '',
  relocation: false,
}

const emptyEmployerProfile:EmployerProfile = {
  company: '',
  phone_number: NaN,
  profile_picture: null
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
  const navigate = useNavigate();
  const role = useRecoilValue(userTypeAtom);
  const setUserType = useSetRecoilState(userTypeAtom);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if(!studentInfo.education_level)
      alert('Please select an education level')
    const data = role === "STUDENT" ? {...userInfo, ...studentInfo, profile_picture} : {...userInfo, ...employerInfo, profile_picture}
    axios.put('http://localhost:8000/api/profile/', data,{
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "Content-Type": 'multipart/form-data'
          },
        }
    ).then(res => {
      if(res.status === 200)
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
          if('id' in profile)
            delete profile.id
          if(profile.profile_picture)
            profile.profile_picture = 'http://localhost:8000' + profile.profile_picture
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
    if(profile_picture){
      const reader = new FileReader();
      reader.readAsDataURL(profile_picture);
      reader.onload = () => {
        const imageUrl = reader.result as string; // The data URL
        // Set the source of your <img> element to the data URL
        const img = document.getElementById('profile-picture-img') as HTMLImageElement;
        img.src = imageUrl;
      }
    }
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
                                        <img id="profile-picture-img" alt="profile picture" className="h-full w-full text-gray-300 object-cover"
                                             src={studentInfo.profile_picture || employerInfo.profile_picture || DefaultProfilePic}/>
                                    </span>
                      <label
                          htmlFor="photo-upload"
                          className="ml-5 h-fit w-fit relative "
                      >
                        <span className="cursor-pointer transition-shadow rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-100 rounded-md bg-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:drop-shadow-sm">Change</span>
                        <input id="photo-upload" name="photo-upload" type="file"  accept="image/png, image/jpeg"
                               onChange={e => utils.handleFileChange(e, setProfile_picture, 'IMAGE', 3)}
                               className={`sr-only`}/>
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1">
                      <label htmlFor={role === "STUDENT" ? 'institution': 'company'} className="block text-sm font-medium text-gray-700">
                        {role === "STUDENT" ? 'Institution': 'Company Name'}
                      </label>
                      <input
                          type="text"
                          name={role === "STUDENT" ? 'institution': 'company'}
                          id={role === "STUDENT" ? 'institution': 'company'}
                          value={(role === "STUDENT" ? studentInfo.institution : employerInfo.company) || ''}
                          onChange={e => role === "STUDENT" ?  utils.handleStudentInputChange(e, setStudentInfo) :
                              utils.handleEmployerInputChange(e, setEmployerInfo)}
                          autoComplete={role === "STUDENT" ? 'institution': 'company'}
                          className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    {role === "STUDENT" && (
                        <div className="flex-1">
                          <label htmlFor="education_level" className="block text-sm font-medium text-gray-700">
                            Education level
                          </label>
                          <select
                              name="education_level"
                              id="education_level"
                              onChange={e => utils.handleOptionChange(e, setStudentInfo)}
                              value={studentInfo.education_level || ''}
                              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          >
                            {Object.entries(
                                educationLevelDetails
                            ).map(([value, label]) => ({ value: value as EducationLevel, label })).map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                            ))}
                          </select>
                        </div>
                    )}
                    {role === "STUDENT" && (
                        <div className="flex-1">
                          <label htmlFor="field_of_study" className="block text-sm font-medium text-gray-700">
                            Field of Study
                          </label>
                          <input
                              type="text"
                              name="field_of_study"
                              id="field_of_study"
                              value={studentInfo.field_of_study || ''}
                              onChange={e => utils.handleStudentInputChange(e, setStudentInfo)}
                              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          />
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

                  {role === "STUDENT" && <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <select
                        id="country"
                        name="country"
                        value={studentInfo.country || ''}
                        onChange={e => utils.handleOptionChange(e, setStudentInfo)}
                        autoComplete="country-name"
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    >
                      {countryList.map(country =>
                          <option key={country}
                                  className={`${thinScrollBarStyle}`}>{country}</option>)}
                    </select>
                  </div>}

                  {role === "STUDENT" && <div className="col-span-6 md:col-span-3">
                    <label htmlFor="province_territory" className="block text-sm font-medium text-gray-700">
                      State / Province
                    </label>
                    <input
                        type="text"
                        name="province_territory"
                        id="province_territory"
                        value={studentInfo.province_territory || ''}
                        onChange={e => utils.handleStudentInputChange(e, setStudentInfo)}
                        autoComplete="address-level1"
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>}
                  <div className="col-span-6 md:col-span-3">
                    <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                        type="tel"
                        name="phone_number"
                        id="phone_number"
                        value={role === "STUDENT" ? studentInfo.phone_number || '' : employerInfo.phone_number || ''}
                        onChange={role === "STUDENT" ? e => utils.handleStudentInputChange(e, setStudentInfo) : e => utils.handleEmployerInputChange(e, setEmployerInfo)}
                        autoComplete="tel"
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  {role === "STUDENT" && <div className="col-span-6">
                    <label htmlFor="street_address" className="block text-sm font-medium text-gray-700">
                      Street address
                    </label>
                    <input
                        type="text"
                        name="street_address"
                        id="street_address"
                        value={studentInfo.street_address || ''}
                        onChange={e => utils.handleStudentInputChange(e, setStudentInfo)}
                        autoComplete="address-line1"
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>}
                  {role === "STUDENT" && <div className="col-span-6 md:col-span-3">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                        type="text"
                        name="city"
                        id="city"
                        value={studentInfo.city || ''}
                        onChange={e => utils.handleStudentInputChange(e, setStudentInfo)}
                        autoComplete="address-level2"
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>}
                  {role === "STUDENT" && <div className="col-span-6 md:col-span-3">
                    <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">
                      ZIP / Postal code
                    </label>
                    <input
                        type="text"
                        name="postal_code"
                        id="postal_code"
                        value={studentInfo.postal_code || ''}
                        onChange={e => utils.handleStudentInputChange(e, setStudentInfo)}
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
        <Status type={status.type} message={status.message} messages={status.messages}/>
      </div>
  )
}