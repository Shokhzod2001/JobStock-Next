import { JobCategory, JobStatus, JobType } from './enums/job.enum';

export const REACT_APP_API_URL = `${process.env.REACT_APP_API_URL}`;

// Job-specific options
export const availableOptions = ['jobRemote', 'jobVisaSponsor'];

// Experience levels in years
export const jobExperienceLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 20];

// Salary ranges in USD
export const jobSalaryRanges = [
	0, // Any salary
	20000, // $20k
	30000, // $30k
	50000, // $50k
	75000, // $75k
	100000, // $100k
	125000, // $125k
	150000, // $150k
	200000, // $200k
	250000, // $250k
	300000, // $300k+
];

// Job status colors for UI
export const jobStatusColors = {
	[JobStatus.ACTIVE]: 'success',
	[JobStatus.CLOSED]: 'error',
	[JobStatus.DELETE]: 'default',
};

// Job type icons for UI
export const jobTypeIcons = {
	[JobType.FULL_TIME]: 'work',
	[JobType.PART_TIME]: 'schedule',
	[JobType.CONTRACT]: 'description',
	[JobType.INTERNSHIP]: 'school',
	[JobType.TEMPORARY]: 'event_repeat',
};

// Default job search filters
export const defaultJobFilters = {
	salaryRange: { min: 0, max: 300000 },
	experienceRange: { min: 0, max: 10 },
	location: [],
	jobType: [],
	category: [],
};

// Error messages
export const Messages = {
	error1: 'Something went wrong!',
	error2: 'Please login first!',
	error3: 'Please fulfill all inputs!',
	error4: 'Message is empty!',
	error5: 'Only images with jpeg, jpg, png format allowed!',
	error6: 'Invalid job data provided!',
	error7: 'Job application failed!',
};

// Ranking threshold for top jobs
export const topJobRank = 3;

// Job categories with icons
export const jobCategoryConfig = {
	[JobCategory.IT]: { icon: 'code', color: 'primary' },
	[JobCategory.FINANCE]: { icon: 'attach_money', color: 'success' },
	[JobCategory.EDUCATION]: { icon: 'school', color: 'warning' },
	[JobCategory.HEALTHCARE]: { icon: 'medical_services', color: 'error' },
	[JobCategory.ENGINEERING]: { icon: 'engineering', color: 'info' },
	[JobCategory.MARKETING]: { icon: 'campaign', color: 'secondary' },
	[JobCategory.SALES]: { icon: 'point_of_sale', color: 'primary' },
	[JobCategory.CUSTOMER_SERVICE]: { icon: 'support_agent', color: 'success' },
	[JobCategory.HUMAN_RESOURCES]: { icon: 'groups', color: 'warning' },
	[JobCategory.MANUFACTURING]: { icon: 'factory', color: 'error' },
	[JobCategory.HOSPITALITY]: { icon: 'hotel', color: 'info' },
	[JobCategory.CONSTRUCTION]: { icon: 'construction', color: 'secondary' },
	[JobCategory.TRANSPORTATION]: { icon: 'local_shipping', color: 'primary' },
	[JobCategory.OTHER]: { icon: 'category', color: 'default' },
};

// Maximum allowed job images
export const MAX_JOB_IMAGES = 5;

// Application deadline buffer (days)
export const MIN_DEADLINE_DAYS = 7;
