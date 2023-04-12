import React, {useEffect, useState} from 'react'
import {useRecoilValue, useSetRecoilState} from "recoil";
import {jobOnPreview, showApplyPopupState} from "../../constants/atoms";
import {IJob} from "../../constants/types";
import {Document} from "../../constants/types";
import axios from "axios";
import {getAccessToken} from "../../scripts/utils";
import {convertToDocumentArray} from "../../scripts/DocumentUtils";
import {Link} from "react-router-dom";

export const ApplyBox = () => {
    const setShowApplyPopup = useSetRecoilState(showApplyPopupState)
    const job: IJob | null = useRecoilValue(jobOnPreview);
    const [appList, setAppList] = useState<Document[]>([])
    const [selectedAppID, setSelectedAppID] = useState<string>('')

    const handleApply = () => {
        if(selectedAppID === ''){
            alert('No application package selected')
            return
        }
        axios.post(`http://localhost:8000/api/jobs/${job?.id}/apply/`, {package_id: selectedAppID},{
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                    'Content-Type': 'application/json',
                },
            }
        ).then(res => {
            console.log(res)
            if(res.status === 201){
                alert('Application successful')
                window.location.reload()
                setShowApplyPopup(false)
            }

        }).catch(err => {
            console.log(err)
            const response = err.response
            if(response.status === 400){
                if(response.data?.application) {
                    console.log('here')
                    alert(response.data?.application)
                    setShowApplyPopup(false)
                    return
                }
            }
        })
    }

    useEffect(() => {
        axios.get(`http://localhost:8000/api/application-package/`, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                    "Content-Type": 'multipart/form-data'
                },
            }
        ).then(res => {
            setAppList(convertToDocumentArray(res.data, 'application-package'))
        }).catch(err => {
            console.log(err.response.data)
        })
    }, [])

    useEffect(() => {
        console.log(selectedAppID)
        console.log(getApplicationObject())
    }, [selectedAppID])

    const getApplicationObject: () => Document | undefined = () => {
        return appList.find((app) => app.id === selectedAppID);
    }


    return (
        <div className="fixed z-50 inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 py-8 sm:p-8 rounded-lg">
                <h2 className="text-xl font-[500] mb-4">{`Apply to: ${job?.title}`}</h2>
                <div className="flex flex-col gap-2">
                    <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                        Choose an Application Package
                    </label>
                    <select
                        name="file"
                        id="file"
                        onChange={e => setSelectedAppID(e.target.value)}
                        value={getApplicationObject()?.id || ''}
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="">-- Select --</option>
                        {appList.map((item) => (
                            <option key={item.id} value={item.id}>
                                {`${item.title} ${item.default ? '(default)' : ''}`}
                            </option>
                        ))}
                    </select>
                    <Link className="text-sm text-indigo-800"
                          to={'/user/documents'}
                          onClick={() => setShowApplyPopup(false)}
                          >
                        Upload a document</Link>
                </div>
                <div className="mt-4 flex flex-row gap-2">
                    <button
                        className="flex-2 w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary_dark"
                        onClick={handleApply}
                    >
                        Apply
                    </button>
                    <button
                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                        onClick={() => setShowApplyPopup(false)}
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
};
