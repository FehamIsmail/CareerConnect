export interface IJob {
    id: number;
    title: string;
    types: JobType[];
    company: string,
    short_description: string;
    description: string;
    street_address: string;
    city?: string,
    province_territory?: string,
    postal_code?: string,
    relocation?: boolean,
    salary: number | null;
    posted_date: Date;
    apply_by_date: Date | null;
    contact_email: string;
    contact_phone: string | null;
    website_url: string | null;
    company_logo: string | null;
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
    ON_SITE = "On-site",
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
    [JobType.ON_SITE]: {
        name: "On-site",
        color: "#d7f7ef",
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

export enum EducationLevel {
    PRIMARY_SCHOOL = 'PS',
    SECONDARY_SCHOOL = 'SS',
    HIGH_SCHOOL = 'HS',
    BACHELOR = 'BA',
    MASTER = 'MA',
    DOCTORATE = 'PHD',
}

type EducationLevelDetails = {
    [key in EducationLevel]: string;
};

export const educationLevelDetails: EducationLevelDetails = {
    [EducationLevel.PRIMARY_SCHOOL]: 'Primary School',
    [EducationLevel.SECONDARY_SCHOOL]: 'Secondary School',
    [EducationLevel.HIGH_SCHOOL]: 'High School',
    [EducationLevel.BACHELOR]: 'Bachelor',
    [EducationLevel.MASTER]: 'Master',
    [EducationLevel.DOCTORATE]: 'Doctorate',
};

export type UserInfo = {
    first_name: string,
    last_name: string,
    email: string,
}

export type StudentProfile = {
    institution: string,
    education_level: EducationLevel | '',
    phone_number: number,
    show_number: boolean,
    country: string,
    province_territory: string,
    street_address: string,
    postal_code: string,
    city: string,
    relocation: boolean,
}

export type EmployerProfile = {
    company: string
}

export type CurriculumVitae = {
    curriculum_vitae: File,
    title: string,
    default: boolean
}

export type CoverLetter = {
    cover_letter: File,
    title: string,
    default: boolean
}

export type Application = {
    package_name: string,
    cover_letter: CoverLetter,
    curriculum_vitae: CurriculumVitae,
    default: boolean,
}

export type Option = {
    id: number,
    name: string,
}

export type FilterProps = {
    placeholder: string,
    options: Option[],
}