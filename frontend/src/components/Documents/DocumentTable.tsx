import React, {useEffect, useState} from 'react'
import {Document, StatusType} from "../../constants/types";
import {ArrowDownTrayIcon, XMarkIcon} from "@heroicons/react/24/outline";
import axios from "axios";
import {createArrayFromStrings, getAccessToken, shortenFileName} from "../../scripts/utils";
import {getEndpoint} from "../../scripts/DocumentUtils";


export interface DocumentTableProps {
    documentList: Document[] | any[]
    editDocument: (doc: Document) => any;
    setStatus: React.Dispatch<React.SetStateAction<StatusType>>
}


export default function DocumentTable(props:DocumentTableProps) {
    const {documentList, editDocument, setStatus} = props
    const type = documentList[0]?.type
    const documentTypeName = type == 'CV' ? 'Resumes' :
        type == 'LETTER' ? 'Cover Letters' : 'Application Packages'
    const [defaultDocument, setDefaultDocument] = useState<Document | null>(null);

    const handleDefaultChange = (document: Document) => {
        if (defaultDocument === document) {
            // Uncheck the radio button if it was already selected
            setDefaultDocument(null);
            document.default = false;
        } else {
            // Check the radio button and uncheck the previously selected default document
            setDefaultDocument(document);
            documentList.forEach((doc) => {
                if (doc === defaultDocument) {
                    doc.default = false;
                }
            });
            document.default = true;
        }
    };

    const deleteDocument = (doc: Document) => {
        const endpoint = getEndpoint(doc.type)
        const id = doc.id;
        axios.delete(`http://localhost:8000${endpoint}${id}/`, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                },
            }
        ).then(res => {
            console.log(res)
            if(res.status === 204){
                setStatus({type: 'success', message: 'Document deleted'})
                window.location.reload()
            }

        }).catch(err => {
            console.log(err.response.data)
            const response_messages: string[] = createArrayFromStrings(err.response.data)
            setStatus({type:'error', message:'Ensure that these requirements are met:', messages: response_messages})
        })
    }

    const downloadDocument = async (url: string, fileName: string) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    }

    const handleSave = () => {
        if(!defaultDocument)
            return
        const data = {default: true}
        const id = defaultDocument.id
        const endpoint = getEndpoint(defaultDocument.type)
        axios.put(`http://localhost:8000${endpoint}${id}/`, data, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                },
            }
        ).then(res => {
            if (res.status == 200)
                window.location.reload()
        }).catch(err => {
            console.log(err.response.data)
        })

    }

    useEffect(() => {
        documentList.forEach(doc => {
            if(doc.default)
                setDefaultDocument(doc)
        })
    }, [documentList]);

    return (
        <div className="">
            <div className="px-4 sm:px-6 lg:px-8 mt-6 sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">{documentTypeName}</h1>
                </div>
            </div>
            <div className="px-4 sm:px-6 lg:px-8 mt-6 flow-root">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-0 w-full py-2 align-middle px-0 sm:px-2 md:px-0">
                        <table className="w-full divide-y divide-gray-300">
                            <thead>
                            <tr>
                                <th scope="col" className="py-3.5 px-3 text-center w-24 text-sm font-semibold text-gray-900">
                                    Default
                                </th>
                                <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
                                    Title
                                </th>
                                {type == 'APP_PKG' ?
                                    <>
                                        <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
                                            Resume
                                        </th>
                                        <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
                                            Cover Letter
                                        </th>
                                    </>
                                    :
                                    <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
                                        File Name
                                    </th>
                                }

                                <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
                                    Type
                                </th>
                                <th scope="col" className="py-3.5 px-3 text-center text-sm font-semibold text-gray-900">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {documentList.map((document) => (
                                <tr key={document.id}>
                                    <td className="whitespace-nowrap py-4 flex justify-center text-sm font-medium mx-auto text-gray-900 sm:pl-0">
                                        <input
                                            type="radio"
                                            name="default"
                                            checked={document === defaultDocument}
                                            onChange={() => handleDefaultChange(document)}
                                        />
                                    </td>
                                    <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">{document.title}</td>
                                    {type !== 'APP_PKG' && <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500"
                                                               title={document.file?.split('/').pop()}>
                                        {shortenFileName(document.file?.split('/').pop(), 50)}</td>}
                                    {type === 'APP_PKG' && <>
                                    <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500" title={document.file?.curriculum_vitae?.split('/').pop()}
                                        >{shortenFileName(document.file.curriculum_vitae?.split('/').pop())}</td>
                                    <td className={`whitespace-nowrap py-4 px-3 text-sm text-gray-500 ${document.file2?.cover_letter ? '' : 'font-[400] text-red-900'}`} title={document.file2?.cover_letter?.split('/').pop()}
                                        >{shortenFileName(document.file2?.cover_letter?.split('/').pop() || 'No Cover Letter')}</td></>}
                                    <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">{document.type}</td>
                                    <td className="relative whitespace-nowrap p-4 text-center text-sm font-medium flex items-center justify-center gap-2 ">
                                        {type != 'APP_PKG' &&
                                        <button onClick={() => downloadDocument(document.file, document.file?.split('/').pop())}>
                                            <ArrowDownTrayIcon className="h-4 w-4 text-indigo-600 hover:text-indigo-900"/>
                                        </button>}
                                        <button
                                            className="text-indigo-600 hover:text-indigo-900"
                                            onClick={() => editDocument(document)}>
                                            Edit
                                        </button>
                                        <button onClick={() => deleteDocument(document)}>
                                            <XMarkIcon className="h-4 w-4 text-red-600 hover:text-red-900"/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="mt-4 bg-gray-50 py-3 text-right sm:px-6">
                <button
                    type="submit"
                    onClick={handleSave}
                    className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary_dark focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Save
                </button>
            </div>
        </div>
    )
}
