import { JobCategory, JobLocation, JobStatus, JobType, SalaryType } from '../../enums/job.enum';

export interface JobUpdate {
	_id: string;
	jobType?: JobType;
	jobStatus?: JobStatus;
	jobLocation?: JobLocation;
	jobAddress?: string;
	jobTitle?: string;
	jobCategory?: JobCategory;
	jobSalary?: number;
	salaryType?: SalaryType;
	jobSkills?: string[];
	jobRequirements?: string;
	jobBenefits?: string[];
	jobApplicationDeadline?: Date;
	companyName?: string;
	jobImages?: string[];
	jobDesc?: string;
	jobRemote?: boolean;
	jobVisaSponsor?: boolean;
	closedAt?: Date;
	deletedAt?: Date;
	postedAt?: Date;
}
