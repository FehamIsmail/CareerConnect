import React from "react";
import {EmployerProfile, IJob, StudentProfile, UserInfo} from "../constants/types";

export const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>,
                                 setFile: React.Dispatch<React.SetStateAction<File|null>>,
                                 file_type?: 'IMAGE' | 'DOCUMENT' | null,
                                 size_limit?: number | undefined
) => {

    const file = e.target.files && e.target.files[0]
    if(file_type && file) {
        if (!(file.type.startsWith("image/jpeg") || file.type.startsWith("image/jpg") || file.type.startsWith("image/png"))){
            alert("Please select a valid image type. (PNG, JPEG, JPG)")
        return
        }

    }
    // Size limit is in MB
    if(size_limit && file && file.size > size_limit * 1024 * 1024 ){
        alert(`File exceeds the size limit. (${size_limit} MB)`)
        return
    }
    setFile(file);
};



export const handleUserInputChange = (event: React.ChangeEvent<HTMLInputElement>, setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>) => {
    const {name, value} = event.target;
    setUserInfo(prevState => ({
        ...prevState,
        [name]: value,
    }));
}

export const handleStudentInputChange = (event: React.ChangeEvent<HTMLInputElement>, setStudentInfo: React.Dispatch<React.SetStateAction<StudentProfile>>) => {
    const {name, value} = event.target;
    setStudentInfo(prevState => ({
        ...prevState,
        [name]: value,
    }));
}

export const handleEmployerInputChange = (event: React.ChangeEvent<HTMLInputElement>, setEmployerInfo: React.Dispatch<React.SetStateAction<EmployerProfile>>) => {
    const {name, value} = event.target;
    setEmployerInfo(prevState => ({
        ...prevState,
        [name]: value,
    }));
}


export function handleOptionChange(event: React.ChangeEvent<HTMLSelectElement>, setStudentInfo: React.Dispatch<React.SetStateAction<StudentProfile>>) {
    const {name, value} = event.target;
    setStudentInfo(prevState => ({
        ...prevState,
        [name]: value,
    }));
}

export function handleJobChange(event: React.ChangeEvent<HTMLSelectElement>, setStudentInfo: React.Dispatch<React.SetStateAction<IJob>>) {
    const {name, value} = event.target;
    setStudentInfo(prevState => ({
        ...prevState,
        [name]: value,
    }));
}

// To set a default image for company logo
export async function createFileObjectFromImageUrl(imageUrl: string, filename: string): Promise<File> {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
}