import {atom, selector} from 'recoil'
import {IJob} from "./types";

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
