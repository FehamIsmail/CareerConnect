import React, {useEffect, useState} from 'react'
import {
    DocumentTextIcon as DocumentTextIconOutline,
    EnvelopeIcon as EnvelopeIconOutline,
    CubeIcon as CubeIconOutline,
}
    from "@heroicons/react/24/outline";
import {DocumentTextIcon as DocumentTextIconSolid, EnvelopeIcon as EnvelopeIconSolid, CubeIcon as CubeIconSolid}
    from "@heroicons/react/24/solid";
import {DocumentForm} from "../components/Documents/DocumentForm";
import DocumentTable from "../components/Documents/DocumentTable";
import {Document, StatusType} from "../constants/types";
import {Status} from "../components/StatusBar/Status";
import axios from "axios";
import {getAccessToken} from "../scripts/utils";
import {convertToDocumentArray, feedApplicationCVandCL} from "../scripts/DocumentUtils";

const mockCVs: Document[] = [
    {
        id: 'hfa705d8',
        file: "document1.pdf",
        title: "Resume 1",
        default: false,
        type: "CV"
    },
    {
        id: 'abf7a809d',
        file: "document2.docx",
        title: "Resume 2",
        default: true,
        type: "CV"
    },
    {
        id: 'a0bf7nd689',
        file: "document3.doc",
        title: "Resume 3",
        default: false,
        type: "CV"
    },
    {
        id: 'ghmfc7098',
        file: "document4.pdf",
        title: "Resume 4",
        default: false,
        type: "CV"
    },
];

const mockCoverLetters: Document[] = [
    {
        id: 'a0dgs789',
        file: "document5.pdf",
        title: "Cover Letter 1",
        default: true,
        type: "LETTER"
    },
    {
        id: 'ga2sd7089',
        file: "document6.docx",
        title: "Cover Letter 2",
        default: false,
        type: "LETTER"
    },
    {
        id: 'a5gs7980df',
        file: "document7.doc",
        title: "Cover Letter 3",
        default: false,
        type: "LETTER"
    },
];

const mockApplicationPackages: Document[] = [
    {
        id: 'a8gf9s0a9',
        file: "Resume - 1.docx",
        file2: "Cover Letter 2.pdf",
        title: "Application Pkg 1",
        default: true,
        type: "APP_PKG"
    },
    {
        id: 'a0s6n7av7',
        file: "Resume 6.docx",
        file2: "Cover Letter3.pdf",
        title: "Application Package 2",
        default: false,
        type: "APP_PKG"
    },
];


export const DocumentsPage = () => {
    const [formType, setFormType] = useState<'CV' | 'LETTER' | 'APP_PKG'>()
    const [formAction, setFormAction] = useState<'EDIT' | 'CREATE'>('CREATE')
    const [formVisibility, setFormVisibility] = useState<'hidden' | ''>()
    const [resumeList, setResumeList] = useState<Document[]>(mockCVs)
    const [letterList, setLetterList] = useState<Document[]>(mockCoverLetters)
    const [appPackagesList, setAppPackagesList] = useState<any>(mockApplicationPackages)
    const [formView, setFormView] = useState<'VIEW' | 'FORM'>()
    const [documentOnPreview, setDocumentOnPreview] = useState<Document>()
    const [listOnPreview, setListOnPreview] = useState<Document[]>(resumeList)
    const [status, setStatus] = useState<StatusType>({type: 'nothing', message: ' '})

    const editDocument = (doc: Document) => {
        setFormAction('EDIT')
        setFormView('FORM')
        setDocumentOnPreview(doc)
    }

    useEffect(() => {
        getUserDocuments('curriculumvitae')
        getUserDocuments('coverletter')
        getUserDocuments('applications')
    }, []);

    useEffect(() => {
        if(appPackagesList.length === 0)
            return
        if(!('cover_letter' in appPackagesList[0]))
            setAppPackagesList(feedApplicationCVandCL(resumeList, letterList, appPackagesList))
    }, [appPackagesList]);

    function getUserDocuments(docType:string){
        axios.get(`http://localhost:8000/api/${docType}/`, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                    "Content-Type": 'multipart/form-data'
                },
            }
        ).then(res => {
            if(docType === 'curriculumvitae')
                setResumeList(convertToDocumentArray(res.data, docType))
            if(docType === 'coverletter')
                setLetterList(convertToDocumentArray(res.data, docType))
            if(docType === 'applications')
                setAppPackagesList(convertToDocumentArray(res.data, docType))
        }).catch(err => {
            console.log(err.response.data)
        })
    }

    return (
        <div className="space-y-6 sm:px-6 md:col-span-9 md:px-0 mr-0 md:mr-4 mb-4">
            <div className="mt-4 bg-white shadow sm:overflow-hidden sm:rounded-md">
                <div className="max-w-full bg-white gap-6 px-4 py-3 text-right sm:px-6 flex flex-col md:flex-row">
                    <div className="all-documents mt-2 w-full flex-1 rounded-md bg-white shadow">
                        <div className="title flex font-[500] rounded-t-md justify-start p-3 bg-gray-100 items-center text-gray-800 text-base">
                            All documents
                        </div>
                        <div className="border-t border-gray-300 document-list flex flex-col gap ">
                            <ul className="flex flex-col divide-gray-200 divide-y text-gray-700">
                                <li className="p-2 flex gap-2 flex-row items-center">
                                    <DocumentTextIconOutline className="h-6" />
                                        <div className="truncate min-w-0">Resume</div>
                                    <div className="ml-auto flex flex-row gap-2 items-center">
                                        <div className="ml-auto">{resumeList.length}</div>
                                        <button
                                            onClick={() => {setFormView('VIEW'); setListOnPreview(resumeList)}}
                                            className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary_dark">
                                            View
                                        </button>
                                    </div>
                                </li>
                                <li className="p-2 flex gap-2 flex-row items-center">
                                    <EnvelopeIconOutline className="h-6" />
                                    <div className="truncate min-w-0">Cover Letter</div>
                                    <div className="ml-auto flex flex-row gap-2 items-center">
                                        <div className="ml-auto">{letterList.length}</div>
                                        <button
                                            onClick={() => {setFormView('VIEW'); setListOnPreview(letterList)}}
                                            className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary_dark">
                                            View
                                        </button>
                                    </div>
                                </li>
                                <li className="p-2 flex gap-2 flex-row items-center">
                                    <CubeIconOutline className="h-6" />
                                    <div className="truncate min-w-0">Application Package</div>
                                    <div className="ml-auto flex flex-row gap-2 items-center">
                                        <div className="ml-auto">{appPackagesList.length}</div>
                                        <button
                                            onClick={() => {setFormView('VIEW'); setListOnPreview(appPackagesList)}}
                                            className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary_dark">
                                            View
                                        </button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="hidden default-documents w-full flex-1 rounded-md border-r bg-white shadow">
                        <div className="title flex font-[500] justify-start p-3 bg-green-100 rounded-t-md items-center text-base text-green-800">
                            Your default documents
                        </div>
                        <div className="border-t border-green-500 document-list flex flex-col gap ">
                            <ul className="flex flex-col divide-gray-200 divide-y text-gray-700">
                                <li className="p-2 flex gap-2 flex-row items-center">
                                    <DocumentTextIconSolid className="h-6" />
                                    <div className="truncate min-w-0">Resume</div>
                                    <button className="truncate overflow-ellipsis ml-auto inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary_dark">
                                        Set a default
                                    </button>
                                </li>
                                <li className="p-2 flex gap-2 flex-row items-center">
                                    <EnvelopeIconSolid className="h-6" />
                                    <div className="truncate min-w-0">Cover Letter</div>
                                    <button className="truncate overflow-ellipsis whitespace-nowrap ml-auto inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary_dark">
                                        Set a default
                                    </button>
                                </li>
                                <li className="p-2 flex gap-2 flex-row items-center">
                                    <CubeIconSolid className="h-6" />
                                    <div className="truncate min-w-0">Application</div>
                                    <button className="truncate overflow-ellipsis whitespace-nowrap ml-auto inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary_dark">
                                        Upload a default
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="mt-4 bg-gray-50 px-4 py-3 text-right sm:px-6">
                    <button
                        type="submit"
                        onClick={() => {setFormView('FORM'); setDocumentOnPreview(undefined); setFormAction('CREATE')}}
                        className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary_dark focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Upload a document
                    </button>
                </div>
            </div>
            <div className="mt-4 bg-white shadow sm:overflow-hidden sm:rounded-md">
                {formView == 'FORM' && <DocumentForm
                                            action={formAction}
                                            documentOnPreview={documentOnPreview}
                                            setStatus={setStatus}
                                            resumeList={resumeList}
                                            letterList={letterList}/>}

                {formView == 'VIEW' && <DocumentTable
                                            editDocument={editDocument}
                                            documentList={listOnPreview}
                                            setStatus={setStatus}
                />}
            </div>
            <Status type={status.type} message={status.message} messages={status.messages}/>
        </div>
    );
};

export default DocumentsPage;