import {useEffect, useState} from 'react';
import {JobType} from "../constants/types";

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
    return localStorage.getItem('access-token');
}

export const setAccessToken = (token:string) => {
    localStorage.setItem('access-token', token);
}

export const getRefreshToken = (): string|null => {
    return localStorage.getItem('refresh-token');
}

export const setRefreshToken = (token:string) => {
    localStorage.setItem('refresh-token', token);
}

export const getJobTypesString = (types: JobType[]): string => {
    let result = "";
    types.forEach(type => {
        result += type + ', '
    })
    return result.substring(0, result.length-2);
}