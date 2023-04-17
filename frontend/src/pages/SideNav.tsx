import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { classNames } from "../scripts/utils";
import {
  BellIcon,
  ClipboardDocumentListIcon,
  Square3Stack3DIcon,
  UserCircleIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import Header from "../components/Header/Header";
import { useRecoilValue } from "recoil";
import { authAtom, userTypeAtom } from "../constants/atoms";

export function SideNav() {
  const { isAuthenticated } = useRecoilValue(authAtom);
  const user = useRecoilValue(userTypeAtom);
  const navigate = useNavigate();
  const location = useLocation();

  const [accountNavigation, setAccountNavigation] = useState([
    {
      name: "Profile",
      href: "/user/profile",
      icon: UserCircleIcon,
      current: false,
    },
    ...(user === "STUDENT"
      ? [
          {
            name: "Documents",
            href: "/user/documents",
            icon: ClipboardDocumentListIcon,
            current: false,
          },
        ]
      : []),
    { name: "Notifications", href: "#", icon: BellIcon, current: false },
  ]);

  const [jobNavigation, setJobNavigation] = useState([
    ...(user === "EMPLOYER"
      ? [
          {
            name: "Create Job",
            href: "/job/create",
            icon: BriefcaseIcon,
            current: false,
          },
          {
            name: "View Jobs",
            href: "/job/Jobselect",
            icon: UserCircleIcon,
            current: false,
          },
          {
            name: "Edit Jobs",
            href: "/job/JobEditSelect",
            icon: UserCircleIcon,
            current: false,
          },
        ]
      : []),
    ...(user === "STUDENT"
      ? [
          {
            name: "Applications",
            href: "/user/applications",
            icon: Square3Stack3DIcon,
            current: false,
          },
        ]
      : []),
  ]);

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
    updateCurrentNav();
  }, []);

  const updateCurrentNav = () => {
    const stringPath = location.pathname.split("/");
    const navType = stringPath[stringPath.length - 2];
    const currentSegment = location.pathname.split("/").pop();
    let navToUpdate;
    if (navType === "user") navToUpdate = accountNavigation;
    if (navType === "job") navToUpdate = jobNavigation;
    if (!navToUpdate || !currentSegment) return;
    const updatedNavigation = navToUpdate.map((item) => {
      return {
        ...item,
        current: item.href.endsWith(currentSegment),
      };
    });
    navToUpdate = navToUpdate.splice(
      0,
      navToUpdate.length,
      ...updatedNavigation
    );
    if (navType === "user") setAccountNavigation(navToUpdate);
    if (navType === "job") setJobNavigation(navToUpdate);
  };

  useEffect(() => {
    updateCurrentNav();
  }, [location]);

  return (
    <>
      <Header />
      <div className="md:grid md:grid-cols-12 md:gap-x-5">
        <aside className="ml-0 divide-y bg-white sm:mr-6 sm:ml-6 sm:mt-4 md:mr-0 md:ml-4 md:h-[89.4vh] p-2 shadow-default rounded-md md:col-span-3 md:py-0 md:px-0">
          <div className="text-center py-2 pr-4">Account</div>
          <nav className="space-y-1 p-3">
            {accountNavigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={classNames(
                  item.current
                    ? "bg-gray-50 text-indigo-700 hover:bg-white hover:text-indigo-700"
                    : "text-gray-900 hover:bg-gray-100 hover:text-gray-900",
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium"
                )}
                aria-current={item.current ? "page" : undefined}
              >
                <item.icon
                  className={classNames(
                    item.current
                      ? "text-indigo-500 group-hover:text-indigo-500"
                      : "text-gray-500 group-hover:text-gray-500",
                    "-ml-1 mr-3 h-6 w-6 flex-shrink-0"
                  )}
                  aria-hidden="true"
                />
                <span className="text-gray-800 truncate">{item.name}</span>
              </a>
            ))}
          </nav>
          <div className="text-center py-2 pr-4">Jobs</div>
          <nav className="space-y-1 p-3">
            {jobNavigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={classNames(
                  item.current
                    ? "bg-gray-50 text-indigo-700 hover:bg-white hover:text-indigo-700"
                    : "text-gray-900 hover:bg-gray-100 hover:text-gray-900",
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium"
                )}
                aria-current={item.current ? "page" : undefined}
              >
                <item.icon
                  className={classNames(
                    item.current
                      ? "text-indigo-500 group-hover:text-indigo-500"
                      : "text-gray-800 group-hover:text-gray-500",
                    "-ml-1 mr-3 h-6 w-6 flex-shrink-0"
                  )}
                  aria-hidden="true"
                />
                <span className="truncate">{item.name}</span>
              </a>
            ))}
          </nav>
        </aside>
        <Outlet />
      </div>
    </>
  );
}
