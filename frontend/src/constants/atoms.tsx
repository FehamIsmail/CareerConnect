import {atom, selector} from 'recoil'
import {IJob} from "./types";

const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
let role: 'STUDENT' | 'EMPLOYER' | null = localStorage.getItem('role') as 'STUDENT' | 'EMPLOYER' | null

export const jobOnPreviewIDAtom = atom<number>({
    key: 'jobOnPreviewID',
    default: -1,
})

export const jobListAtom = atom<IJob[]>({
    key: 'jobList',
    default: [],
})

export const jobOnPreview = selector<IJob | null>({
    key: 'jobOnPreview',
    get: ({get}) => {
        const jobID = get(jobOnPreviewIDAtom);
        const jobs = get(jobListAtom);
        if (jobID == -1)
            return null
        return jobs.filter((item) => item.id == jobID)[0];
    },
})

export const authAtom = atom({
    key: 'auth',
    default: { isAuthenticated: isAuthenticated },
});

export const userTypeAtom = atom<'STUDENT' | 'EMPLOYER' | null>({
    key: 'userType',
    default: role,
});

