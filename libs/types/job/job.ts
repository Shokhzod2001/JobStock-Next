import { JobCategory, JobLocation, JobStatus, JobType, SalaryType } from '../../enums/job.enum';
import { Member } from '../member/member';

export interface MeLiked {
	memberId: string;
	likeRefId: string;
	myFavorite: boolean;
}

export interface TotalCounter {
	total: number;
}

export interface Job {
	_id: string;
	jobType: JobType;
	jobCategory: JobCategory;
	jobStatus: JobStatus;
	jobLocation: JobLocation;
	jobAddress: string;
	jobTitle: string;
	jobSalary: number;
	salaryType: SalaryType;
	jobExperience: number;
	jobSkills: string[];
	jobRequirements: string;
	jobBenefits: string[];
	jobApplicationDeadline: Date;
	companyName: string;
	jobViews: number;
	jobLikes: number;
	jobApplications: number;
	jobComments: number;
	jobRank: number;
	jobImages: string[];
	jobDesc?: string;
	jobRemote: boolean;
	jobVisaSponsor: boolean;
	memberId: string;
	closedAt?: Date;
	deletedAt?: Date;
	postedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	meLiked?: MeLiked[];
	memberData?: Member;
}

export interface Jobs {
	list: Job[];
	metaCounter: TotalCounter[];
}
