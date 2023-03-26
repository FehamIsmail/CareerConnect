import React from "react";
import {Document} from "../constants/types";

export const handleFileDelete = (setFile: React.Dispatch<React.SetStateAction<File|null>>) => {
    setFile(null)
}

export const handleDocumentInputChange = (event: any, setDocumentInfo: React.Dispatch<React.SetStateAction<Document>>) => {
    let {name, value} = event.target;
    // Handle is Default checkbox
    if(name === 'default')
        value = event.target.checked
    // Handle file upload
    if(name === 'file'){
        value = event.target.files && event.target.files[0] as File
        if(value){
            // Checks file size < 2MB
            if(value.size && value.size > 2 * 1024 * 1024){
                alert('Uploaded file exceeds 2MB!')
                event.target.value = '';
                return
            }
            // Checks file type == pdf
            if(value.type && value.type !== 'application/pdf'){
                alert('Only PDF files are supported!')
                event.target.value = '';
                return
            }
        }
    }
    // Updates documentInfo
    setDocumentInfo(prevState => ({
        ...prevState,
        [name]: value,
    }));
}

export const handleDocumentSelectChange = (event: any, setDocumentInfo: React.Dispatch<React.SetStateAction<Document>>) => {
    let {name, value} = event.target;
    setDocumentInfo(prevState => ({
        ...prevState,
        [name]: value,
    }));
}


export function getEndpoint(t: string){
    switch(t){
        case 'CV':
            return '/api/curriculumvitae/'
        case 'LETTER':
            return '/api/coverletter/'
        case 'APP_PKG':
            return '/api/applications/'
        default:
            return ''
    }
}

export function getAttributeName(t: string){
    switch(t){
        case 'curriculumvitae':
            return 'curriculum_vitae'
        case 'coverletter':
            return 'cover_letter'
        default:
            switch(t){
                case 'CV':
                    return 'curriculum_vitae'
                case 'LETTER':
                    return 'cover_letter'
                default:
                    return ''
            }
    }
}

export function getTypeFromName(type:'curriculumvitae' | 'coverletter' | 'applications'){
    switch(type){
        case 'curriculumvitae':
            return 'CV'
        case 'coverletter':
            return 'LETTER'
        default:
            return 'APP_PKG'
    }
}

export function convertToDocumentArray(data: any[], type:'curriculumvitae' | 'coverletter' | 'applications'): Document[]{
    const documents: Document[] = [];

    for (const item of data) {
        let document: Document = { id: '', file: '', title: '', default: false, type: 'APP_PKG' };
        // console.log(item)

        if(type !== 'applications')
            document = {
                id: item.id,
                file: item[getAttributeName(type)],
                title: item.title,
                default: item.default,
                type: getTypeFromName(type),
            };
        else{}

        documents.push(document);
    }

    return documents;
}
