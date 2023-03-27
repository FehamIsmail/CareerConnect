import React, {useEffect} from 'react'
import {Outlet, useNavigate} from 'react-router-dom'
import {classNames} from "../scripts/utils";
import {
    BellIcon,
    ClipboardDocumentListIcon,
    Square3Stack3DIcon,
    UserCircleIcon,
} from "@heroicons/react/24/outline";
import Header from "../components/Header/Header";
import {useRecoilValue} from "recoil";
import {authAtom} from "../constants/atoms";

type UserNavOpt ={
    isUser: boolean
}

const userNavigation = [
    {name: 'Account', href: '/user/profile', icon: UserCircleIcon, current: true},
    {name: 'Documents', href: '/user/documents', icon: ClipboardDocumentListIcon, current: false},
    {name: 'Applications', href: '/user/applications', icon: Square3Stack3DIcon, current: false},
    {name: 'Notifications', href: '#', icon: BellIcon, current: false},
]

const jobNavigation = [
    { name: "Create Job", href: "/job/create", icon: UserCircleIcon, current: true },
]

export function UserNav(props:UserNavOpt) {
    const navigation = props.isUser ? userNavigation : jobNavigation;
    const {isAuthenticated} = useRecoilValue(authAtom)
    const navigate = useNavigate()

    useEffect(() => {
        if( !isAuthenticated )
            navigate('/login')
    }, [])


    return (
        <>
        <Header/>
        <div className="md:grid md:grid-cols-12 md:gap-x-5">
            <aside className="ml-0 bg-white sm:mr-6 sm:ml-6 sm:mt-4 md:mr-0 md:ml-4 md:h-[89.4vh] p-2 shadow-default rounded-md md:col-span-3 md:py-0 md:px-0">
                <nav className="space-y-1 p-3">
                    {navigation.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                                item.current
                                    ? 'bg-gray-50 text-indigo-700 hover:bg-white hover:text-indigo-700'
                                    : 'text-gray-900 hover:bg-gray-100 hover:text-gray-900',
                                'group flex items-center rounded-md px-3 py-2 text-sm font-medium'
                            )}
                            aria-current={item.current ? 'page' : undefined}
                        >
                            <item.icon
                                className={classNames(
                                    item.current
                                        ? 'text-indigo-500 group-hover:text-indigo-500'
                                        : 'text-gray-400 group-hover:text-gray-500',
                                    '-ml-1 mr-3 h-6 w-6 flex-shrink-0'
                                )}
                                aria-hidden="true"
                            />
                            <span className="truncate">{item.name}</span>
                        </a>
                    ))}
                </nav>
            </aside>
            <Outlet/>
        </div>
        </>
    )
}