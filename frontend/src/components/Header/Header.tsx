import React, {Fragment, useEffect, useState} from 'react'
import {Menu, Popover, Transition} from '@headlessui/react'
import {
    BriefcaseIcon,
    ClipboardDocumentIcon,
    UserIcon,
    DocumentTextIcon,
    Bars3Icon,
    XMarkIcon, Square3Stack3DIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import {classNames, getAccessToken, handleLogout} from "../../scripts/utils";
import DefaultProfilePic from "../../assets/default_profile_pic.png"
import logo from '../../assets/logo_nobg.svg'
import {Link} from "react-router-dom";
import {useRecoilValue} from "recoil";
import {authAtom, userTypeAtom} from "../../constants/atoms";
import axios from "axios";

const Header = () => {
    const { isAuthenticated } = useRecoilValue(authAtom);
    const role = useRecoilValue(userTypeAtom)
    const [profile_picture, setProfile_picture] = useState<string | null>(null)


    const jobActions = [
        {   name: 'Job Postings',
            description: 'Browse job postings',
            href: '/',
            icon: ClipboardDocumentIcon,
        },
        ...(role === 'STUDENT' && isAuthenticated ? [
                {   name: 'Job Applications',
                    description: 'View your job applications',
                    href: '/user/applications',
                    icon: Square3Stack3DIcon,
                }
            ]
        : []),
        ...(role === 'EMPLOYER' && isAuthenticated ? [
                {
                    name: 'Employers / Post Job',
                    description: 'Post a job as an employer',
                    href: '/job/create',
                    icon: BriefcaseIcon,
                },
            ]
        : []),
    ];

    const accountActions = [
        {
            name: 'My Profile',
            href: '/user/profile',
            description: 'Edit your profile details',
            icon: UserIcon,
        },
        ...(role === 'STUDENT'
            ? [
                {
                    name: 'My Documents',
                    href: '/user/documents',
                    description: 'Upload or edit your documents',
                    icon: DocumentTextIcon,
                }
                ] : []
        )
    ]

    const getUserInfo = () => {
        axios.get('http://localhost:8000/api/profile/', {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
            },
        })
            .then((response: any) => {
                if(response.data.profile.profile_picture)
                    setProfile_picture('http://localhost:8000'+response.data.profile.profile_picture)
            })
            .catch(error => {
                console.error(error);
            });
    }

    useEffect(() => {
        if(isAuthenticated) getUserInfo()
    }, [isAuthenticated]);

    return (
        <Popover className="relative z-50 bg-white drop-shadow-md">
            <div className="mx-auto max-w-screen-xl px-8">
                <div className="flex items-center justify-between border-gray-100 py-3 md:justify-start md:space-x-10">
                    <div className="flex justify-start md:w-0 md:flex-1">
                        <Link to="/" className="flex cursor-pointer px-2.5 py-3 rounded-lg bg-indigo-600">
                            <span className="sr-only">CareerConnect</span>
                            <img color="black"
                                className="h-4 w-auto sm:h-5 svg-white"
                                src={logo}
                                alt="Logo"
                            />
                        </Link>
                    </div>
                    <div className="-my-2 -mr-2 md:hidden">
                        <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                            <span className="sr-only">Open menu</span>
                            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                        </Popover.Button>
                    </div>
                    <Popover.Group as="nav" className="hidden space-x-10 md:flex">
                        <Popover className="relative">
                            {({ open }) => (
                                <>
                                    <Popover.Button
                                        className={classNames(
                                            open ? 'text-gray-900' : 'text-gray-500',
                                            'group inline-flex items-center rounded-md bg-white text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                                        )}
                                    >
                                        <span>Jobs</span>
                                        <ChevronDownIcon
                                            className={classNames(
                                                open ? 'text-gray-600' : 'text-gray-400',
                                                'ml-2 h-5 w-5 group-hover:text-gray-500'
                                            )}
                                            aria-hidden="true"
                                        />
                                    </Popover.Button>

                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-200"
                                        enterFrom="opacity-0 translate-y-1"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition ease-in duration-150"
                                        leaveFrom="opacity-100 translate-y-0"
                                        leaveTo="opacity-0 translate-y-1"
                                    >
                                        <div className="relative z-50 w-full h-full">
                                        <Popover.Panel className="absolute z-50 -ml-4 mt-3 w-screen max-w-md transform px-2 sm:px-0 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2">
                                            <div className="relative z-50 overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                                <div className="z-50 relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                                                    {jobActions.map((item) => (
                                                        <Link
                                                            key={item.name}
                                                            to={item.href}
                                                            className="-m-3 flex items-start rounded-lg p-3 hover:bg-gray-50"
                                                        >
                                                            <item.icon className="h-6 w-6 flex-shrink-0 text-indigo-600" aria-hidden="true" />
                                                            <div className="ml-4">
                                                                <p className="text-base font-medium text-gray-900">{item.name}</p>
                                                                <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </Popover.Panel>
                                        </div>
                                    </Transition>
                                </>
                            )}
                        </Popover>
                    </Popover.Group>
                    {isAuthenticated &&
                        <Popover.Group as="nav" className="hidden space-x-10 md:flex">
                        <Popover className="relative">
                            {({ open }) => (
                                <>
                                    <Popover.Button
                                        className={classNames(
                                            open ? 'text-gray-900' : 'text-gray-500',
                                            'group inline-flex items-center rounded-md bg-white text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                                        )}
                                    >
                                        <span>Account</span>
                                        <ChevronDownIcon
                                            className={classNames(
                                                open ? 'text-gray-600' : 'text-gray-400',
                                                'ml-2 h-5 w-5 group-hover:text-gray-500'
                                            )}
                                            aria-hidden="true"
                                        />
                                    </Popover.Button>

                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-200"
                                        enterFrom="opacity-0 translate-y-1"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition ease-in duration-150"
                                        leaveFrom="opacity-100 translate-y-0"
                                        leaveTo="opacity-0 translate-y-1"
                                    >
                                        <Popover.Panel className="absolute z-50 -ml-4 mt-3 w-screen max-w-md transform px-2 sm:px-0 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2">
                                            <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                                <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                                                    {accountActions.map((item) => (
                                                        <Link
                                                            key={item.name}
                                                            to={item.href as string}
                                                            className="-m-3 flex items-start rounded-lg p-3 hover:bg-gray-50"
                                                        >
                                                            {item.icon && <item.icon className="h-6 w-6 flex-shrink-0 text-indigo-600" aria-hidden="true" />}
                                                            <div className="ml-4">
                                                                <p className="text-base font-medium text-gray-900">{item.name}</p>
                                                                <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </Popover.Panel>
                                    </Transition>
                                </>
                            )}
                        </Popover>
                    </Popover.Group>
                    }
                    <div className="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
                        {!isAuthenticated &&
                            <>
                                <Link to="/login">
                                    <div
                                       className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900">
                                        Sign in
                                    </div>
                                </Link>
                                <Link to="/register">
                                    <div

                                        className="ml-8 mr-4 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                                    >
                                        Sign up
                                    </div>
                                </Link>
                            </>
                        }
                        {isAuthenticated &&
                            <Menu as="div" className="relative ml-3 mr-4">
                            <div>
                                <Menu.Button className="flex border border-gray-400 rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary">
                                    <span className="sr-only">Open user menu</span>
                                    <img
                                        className="h-8 w-8 rounded-full object-cover bg-white"
                                        src={profile_picture || DefaultProfilePic}
                                        alt="User image"
                                    />
                                </Menu.Button>
                            </div>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                to="/user/profile"
                                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                            >
                                                Your Profile
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                to="/"
                                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                            >
                                                Settings
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                to="/"
                                                onClick={handleLogout}
                                                className={classNames(active ? 'bg-gray-100' : '', 'hover:text-red-700 block px-4 py-2 text-sm text-gray-700')}
                                            >
                                                Sign out
                                            </Link>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                        }

                        {role === "EMPLOYER" && <>
                            <div className="w-[1px] h-9 bg-gray-300"></div>
                            <Link
                            to={isAuthenticated ? `/job/create` : `/register`}
                            className="ml-4 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-lightBlue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-lightBlue-700"
                        >
                            Post job
                        </Link>
                        </>}
                    </div>
                </div>
            </div>
            <Transition
                as={Fragment}
                enter="duration-200 ease-out"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="duration-100 ease-in"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <Popover.Panel focus className="absolute inset-x-0 top-0 origin-top-right transform p-2 transition md:hidden">
                    <div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="px-5 pt-3 pb-6">
                            <div className="flex items-center justify-between">
                                <div className="px-2.5 py-3 rounded-lg bg-indigo-600">
                                    <img
                                        className="svg-white h-5 w-auto"
                                        src={logo}
                                        alt="Logo"
                                    />
                                </div>
                                <div className="-mr-2">
                                    <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                        <span className="sr-only">Close menu</span>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </Popover.Button>
                                </div>
                            </div>
                            <div className="mt-6">
                                <nav className="grid gap-y-8">
                                    {jobActions.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className="-m-3 flex items-center rounded-md p-3 hover:bg-gray-50"
                                        >
                                            <item.icon className="h-6 w-6 flex-shrink-0 text-indigo-600" aria-hidden="true" />
                                            <span className="ml-3 text-base font-medium text-gray-900">{item.name}</span>
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                        </div>
                        {isAuthenticated &&
                            <div className="space-y-6 py-6 px-5">
                                <div className="mt-1">
                                    <nav className="grid gap-y-8">
                                        {accountActions.map((item) => (
                                            <Link
                                                key={item.name}
                                                to={item.href as string}
                                                className="-m-3 flex items-center rounded-md p-3 hover:bg-gray-50"
                                            >
                                                {item.icon && <item.icon className="h-6 w-6 flex-shrink-0 text-indigo-600" aria-hidden="true" />}
                                                <span className="ml-3 text-base font-medium text-gray-900">{item.name}</span>
                                            </Link>
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        }
                        <div className="space-y-6 py-6 px-5">
                            {!isAuthenticated &&
                                <div>
                                    <Link
                                        to="/register"
                                        className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                                    >
                                        Sign up
                                    </Link>
                                    <p className="mt-6 text-center text-base font-medium text-gray-500">
                                        Existing user?{' '}
                                        <Link to="/login"
                                           className="text-indigo-600 hover:text-indigo-500">
                                            Sign in
                                        </Link>
                                    </p>
                                </div>
                            }
                            {isAuthenticated &&
                                <a
                                    onClick={handleLogout}
                                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700"
                                >
                                    Sign out
                                </a>
                            }
                        </div>
                    </div>
                </Popover.Panel>
            </Transition>
        </Popover>
    )
}

export default Header;