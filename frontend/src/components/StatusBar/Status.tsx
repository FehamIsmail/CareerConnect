import React, {useEffect} from 'react'
import {ErrorList} from "../../scripts/utils";

interface StatusProps{
    type: 'nothing' | 'success' | 'error',
    message: string
    messages?: string[]
}

export const Status = (props: StatusProps) => {
    const {type, message, messages} = props

    return (
        <>
        {type !== 'nothing' && (
                <div className={`${type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} mb-3 inline-flex w-full flex flex-col gap-1 rounded-lg py-5 px-6 text-base`}>
                    <div
                        className={`flex flex-row items-center `}
                        role="alert">
                            <span className="flex mr-2 items-center">
                                {type === 'success' ? (<svg
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
                        <span className="font-[500]">{message}</span>

                    </div>
                    {type === 'error' &&
                        <div className="ml-10 mt-1">
                            <ErrorList messages={messages || ['Unexpected error']}/>
                        </div>
                    }
                </div>
            )}
        </>
    );
};