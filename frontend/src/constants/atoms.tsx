import {atom, selector} from 'recoil'
import {IJob, JobType} from "./types";

const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
let role: 'STUDENT' | 'EMPLOYER' | null = localStorage.getItem('role') as 'STUDENT' | 'EMPLOYER' | null
const favoriteJobsString = localStorage.getItem('favs') || ''
let localFavoriteJobs = []
if(favoriteJobsString !== '')
    localFavoriteJobs = JSON.parse(favoriteJobsString)

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

export const filterSortingAtom = atom({
    key: 'filterSorting',
    default: {
        searchTerm: '',
        sorting: '',
        selectedIndustry: '',
        selectedType: '',
        isRemote: false,
        isFavorite: false,
    },
});

export const favoriteJobsAtom = atom<number[]>({
    key: 'favoriteJobsAtom',
    default: localFavoriteJobs || [],
});

export const filteredJobListSelector = selector({
    key: 'filteredJobListSelector',
    get: ({ get }) => {
        const jobList = get(jobListAtom);
        const filterSorting = get(filterSortingAtom);
        const favoriteJobs = get(favoriteJobsAtom);

        const checkFavoriteMatches = (job: IJob) => {
            return favoriteJobs.includes(job.id);
        };

        return jobList.filter((job: IJob) => {
            const titleMatches = job.title.toLowerCase().includes(filterSorting.searchTerm.toLowerCase());
            const typesMatches = filterSorting.selectedType ? job.types?.some(type => type === filterSorting.selectedType) : true;
            const industryMatches = filterSorting.selectedIndustry ? job.industry === filterSorting.selectedIndustry : true;
            const remoteMatches = filterSorting.isRemote ? job.types?.includes(JobType.REMOTE) : true;
            const favoriteMatches = filterSorting.isFavorite ? checkFavoriteMatches(job) : true;
            return (
                titleMatches &&
                typesMatches &&
                industryMatches &&
                remoteMatches &&
                favoriteMatches
            );
        });
    },
});

export const showApplyPopupState = atom({
    key: 'showApplyPopupState',
    default: false,
});