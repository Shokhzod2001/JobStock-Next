import { Direction } from '../../enums/common.enum';
import { JobCategory, JobLocation, JobStatus, JobType } from '../../enums/job.enum';

export interface JobInput {
	jobType: JobType;
	jobCategory: JobCategory;
	jobLocation: JobLocation;
	jobAddress: string;
	jobTitle: string;
	jobSalary: number;
	jobExperience: number;
	jobSkills: string[];
	jobRequirements: string;
	jobBenefits?: string[];
	jobApplicationDeadline: Date;
	jobImages: string[];
	jobDesc?: string;
	jobRemote?: boolean;
	jobVisaSponsor?: boolean;
	memberId?: string;
	postedAt?: Date;
}

interface JISearch {
	memberId?: string;
	locationList?: JobLocation[];
	typeList?: JobType[];
	categoryList?: JobCategory[];
	options?: string[];
	skillsList?: string[];
	salaryRange?: Range;
	deadlineRange?: PeriodsRange;
	experienceRange?: Range;
	text?: string;
}

export interface JobsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: JISearch;
}

interface EJISearch {
	jobStatus?: JobStatus;
}

export interface EmployerJobsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: EJISearch;
}

interface AllJISearch {
	jobStatus?: JobStatus;
	jobLocationList?: JobLocation[];
	jobTypeList?: JobType[];
	jobCategoryList: JobCategory[];
}

export interface AllJobsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: AllJISearch;
}

interface Range {
	start: number;
	end: number;
}

interface PeriodsRange {
	start: Date | number;
	end: Date | number;
}
