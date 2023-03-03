import React from 'react'
import {Outlet} from 'react-router-dom'
import {classNames} from "../scripts/utils";
import {CreditCardIcon, KeyIcon, SquaresPlusIcon, UserCircleIcon, UserGroupIcon} from "@heroicons/react/24/outline";
import Header from "../components/Header/Header";

const navigation = [
    {name: 'Account', href: '#', icon: UserCircleIcon, current: true},
    {name: 'Password', href: '#', icon: KeyIcon, current: false},
    {name: 'Plan & Billing', href: '#', icon: CreditCardIcon, current: false},
    {name: 'Team', href: '#', icon: UserGroupIcon, current: false},
    {name: 'Integrations', href: '#', icon: SquaresPlusIcon, current: false},
]

export function UserNav() {
    return (
        <>
        <Header/>
        <div className="md:grid md:grid-cols-12 md:gap-x-5">
            <aside className="ml-0 sm:mr-10 sm:ml-6 md:mt-4 md:mr-2 md:h-[96vh] py-6 px-2 shadow-default rounded-md sm:px-6 md:col-span-3 md:py-0 md:px-0">
                <nav className="space-y-1">
                    {navigation.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                                item.current
                                    ? 'bg-gray-50 text-indigo-700 hover:bg-white hover:text-indigo-700'
                                    : 'text-gray-900 hover:bg-gray-50 hover:text-gray-900',
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