import React, {useEffect, useState} from 'react';
import {JobType} from "../constants/types";
import { RecoilRoot } from 'recoil';
import {MemoryRouter} from 'react-router-dom';

export const classNames = (...classes: (string)[]) => {
    return classes.filter(Boolean).join(' ')
}

const getWindowDimensions = ():{width:number, height:number} => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

export const useWindowDimensions = ():{width:number, height:number} => {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}

export const getDarkerColor = (color: string): string => {
    // Convert the hexadecimal color string to RGB values
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate the darker color by subtracting 20% from each RGB value
    const darkerR = Math.floor(r * 0.5);
    const darkerG = Math.floor(g * 0.5);
    const darkerB = Math.floor(b * 0.5);

    // Convert the darker RGB values back to a hexadecimal color string
    return `#${darkerR.toString(16)}${darkerG.toString(16)}${darkerB.toString(16)}`;
}

export const getAccessToken = (): string|null => {
    return localStorage.getItem('accessToken');
}

export const setAccessToken = (token:string) => {
    localStorage.setItem('accessToken', token);
}

export const getRefreshToken = (): string|null => {
    return sessionStorage.getItem('refreshToken');
}

export const setRefreshToken = (token:string) => {
    sessionStorage.setItem('refreshToken', token);
}

export const getJobTypesString = (types: JobType[]): string => {
    let result = "";
    types.forEach(type => {
        result += type + ', '
    })
    return result.substring(0, result.length-2);
}

export const handleLogout = () => {
    sessionStorage.removeItem('refreshToken')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('role')
    setAuthenticated(false)
    window.location.reload()
};

export const setAuthenticated = (value:boolean) => {
    localStorage.setItem('isAuthenticated', String(value).toLowerCase());
}

interface ErrorProp {
    messages: string[]
}

export const ErrorList = (props:ErrorProp) => {
    const {messages} = props
    return (
        <ul>
            {messages.map((message, index) => (
                <li className="mt-2" key={index}>• {message}</li>
            ))}
        </ul>
    );
};

export function createArrayFromStrings(object: any):string[]{
    return Object.keys(object).reduce((acc: string[], key: string) => {
        const value = object[key];
        if (typeof value === 'string') {
            return [...acc, value];
        } else if (Array.isArray(value)) {
            return [...acc, ...value];
        }
        return acc;
    }, []);
}

export function appendObjectToFormData(formData: FormData, object: any, prefix?: string) {
    for (const property in object) {
        if (object.hasOwnProperty(property)) {
            const key = prefix ? `${prefix}[${property}]` : property;
            const value = object[property];

            if (value instanceof File) {
                formData.append(key, value);
            } else if (typeof value === 'object') {
                appendObjectToFormData(formData, value, key);
            } else {
                formData.append(key, value.toString());
            }
        }
    }
}

export function simplifyURL(url:string) {
    const matches = url.match(/^https?:\/\/(?:www\.)?([^/?#]+)(?:[/?#]|$)/i);
    return matches && matches[1];
}

export function shortenFileName(fileName: string, maxLength?: number): string {
    if(!fileName)
        return ''
    if(!maxLength)
        maxLength = 30
    if (fileName.length > maxLength) {
        const ellipsis = "...";
        const prefixLength = Math.floor((maxLength - ellipsis.length) / 2);
        const suffixLength = maxLength - prefixLength - ellipsis.length;
        const prefix = fileName.substring(0, prefixLength);
        const suffix = fileName.substring(fileName.length - suffixLength);
        return prefix + ellipsis + suffix;
    } else {
        return fileName;
    }
}

export function convertStatusToNumber(status: string){
    switch(status){
        case 'APPLIED':
            return 1
        case 'INTERVIEW':
            return 2
        case 'PROCESSING':
            return 3
        default:
            return 0
    }
}

export function withProviders(Component: React.ReactNode) {
    return (
        <RecoilRoot>
            <MemoryRouter>
                {Component}
            </MemoryRouter>
        </RecoilRoot>
    );
}