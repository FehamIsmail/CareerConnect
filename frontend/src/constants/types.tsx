export interface IJob {
    id: number;
    title: string;
    types: JobType[];
    company: string,
    short_description: string;
    description: string;
    location: string;
    salary: number | null;
    postedDate: Date;
    applyByDate: Date | null;
    contactEmail: string;
    contactPhone: string | null;
    website: string | null;
    companyLogoUrl: string | null;
}

export enum JobType {
    FULL_TIME = "Full-time",
    PART_TIME = "Part-time",
    TEMPORARY = "Temporary",
    CONTRACT = "Contract",
    FREELANCE = "Freelance",
    INTERNSHIP = "Internship",
    VOLUNTEER = "Volunteer",
    SEASONAL = "Seasonal",
    REMOTE = "Remote",
    CONSULTANT = "Consultant",
    EXECUTIVE = "Executive",
    PERMANENT = "Permanent"
}

export type JobTypeMetadata = {
    name: string;
    color: string;
}

export const JOB_TYPE_METADATA: Record<JobType, JobTypeMetadata> = {
    [JobType.FULL_TIME]: {
        name: "Full-time",
        color: "#d3eaff",
    },
    [JobType.PART_TIME]: {
        name: "Part-time",
        color: "#ddffe7",
    },
    [JobType.TEMPORARY]: {
        name: "Temporary",
        color: "#ffdde5",
    },
    [JobType.CONTRACT]: {
        name: "Contract",
        color: "#efddff",
    },
    [JobType.FREELANCE]: {
        name: "Freelance",
        color: "#fff3d2",
    },
    [JobType.INTERNSHIP]: {
        name: "Internship",
        color: "#d8fbff",
    },
    [JobType.VOLUNTEER]: {
        name: "Volunteer",
        color: "#ffffff",
    },
    [JobType.SEASONAL]: {
        name: "Seasonal",
        color: "#fff5d9",
    },
    [JobType.REMOTE]: {
        name: "Remote",
        color: "#dff7ce",
    },
    [JobType.CONSULTANT]: {
        name: "Consultant",
        color: "#fff0dd",
    },
    [JobType.EXECUTIVE]: {
        name: "Executive",
        color: "#d9ffd9",
    },
    [JobType.PERMANENT]: {
        name: "Permanent",
        color: "#ffe2dd",
    },
};

export type Option = {
    id: number,
    name: string,
}

export type FilterProps = {
    placeholder: string,
    options: Option[],
}