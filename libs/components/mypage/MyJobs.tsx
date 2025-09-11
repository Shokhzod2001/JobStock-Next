import React, { useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { Job } from '../../types/job/job';
import { T } from '../../types/common';
import { JobStatus } from '../../enums/job.enum';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import { UPDATE_JOB } from '../../../apollo/user/mutation';
import { sweetConfirmAlert, sweetErrorHandling } from '../../sweetAlert';
import { EmployerJobsInquiry } from '../../types/job/job.input';
import { GET_EMPLOYER_JOBS } from '../../../apollo/user/query';
import { JobCard } from './JobCard';

const MyJobs: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const [searchFilter, setSearchFilter] = useState<EmployerJobsInquiry>(initialInput);
	const [employerJobs, setEmployerJobs] = useState<Job[]>([]);
	const [total, setTotal] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** APOLLO REQUESTS **/
	const [updateJob] = useMutation(UPDATE_JOB);
	const {
		loading: getEmployerJobsLoading,
		data: getAgentJobsData,
		error: getAgentJobsError,
		refetch: getAgentJobsRefetch,
	} = useQuery(GET_EMPLOYER_JOBS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setEmployerJobs(data?.getEmployerJobs?.list);
			setTotal(data?.getEmployerJobs?.metaCounter[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const changeStatusHandler = (value: JobStatus) => {
		setSearchFilter({ ...searchFilter, search: { jobStatus: value } });
	};

	const deleteJobHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure you want to delete this job?')) {
				await updateJob({ variables: { input: { _id: id, jobStatus: 'DELETE' } } });
				await getAgentJobsRefetch({ input: searchFilter });
			}
		} catch (err: any) {
			await sweetErrorHandling(err).then();
		}
	};

	const updateJobHandler = async (status: string, id: string) => {
		try {
			if (await sweetConfirmAlert(`Are you sure to ${status} this status?`)) {
				await updateJob({ variables: { input: { _id: id, jobStatus: status } } });
				await getAgentJobsRefetch({ input: searchFilter });
			}
		} catch (err: any) {
			await sweetErrorHandling(err).then();
		}
	};

	if (user?.memberType !== 'RECRUITER') {
		router.back();
	}

	if (device === 'mobile') {
		return <div>JOBSTOCK JOBS MOBILE</div>;
	} else {
		return (
			<div id="my-job-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">My Jobs</Typography>
						<Typography className="sub-title">We are glad to see you again!</Typography>
					</Stack>
				</Stack>
				<Stack className="job-list-box">
					<Stack className="tab-name-box">
						<Typography
							onClick={() => changeStatusHandler(JobStatus.ACTIVE)}
							className={searchFilter.search.jobStatus === 'ACTIVE' ? 'active-tab-name' : 'tab-name'}
						>
							Active Jobs
						</Typography>
						<Typography
							onClick={() => changeStatusHandler(JobStatus.CLOSED)}
							className={searchFilter.search.jobStatus === 'CLOSED' ? 'active-tab-name' : 'tab-name'}
						>
							Closed Jobs
						</Typography>
					</Stack>
					<Stack className="list-box">
						<Stack className="listing-title-box">
							<Typography className="title-text">Job title</Typography>
							<Typography className="title-text">Date Published</Typography>
							<Typography className="title-text">Status</Typography>
							<Typography className="title-text">View</Typography>
							{searchFilter.search.jobStatus === 'ACTIVE' && <Typography className="title-text">Action</Typography>}
						</Stack>

						{employerJobs?.length === 0 ? (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No Job found!</p>
							</div>
						) : (
							employerJobs.map((job: Job) => {
								return <JobCard job={job} deleteJobHandler={deleteJobHandler} updateJobHandler={updateJobHandler} />;
							})
						)}

						{employerJobs.length !== 0 && (
							<Stack className="pagination-config">
								<Stack className="pagination-box">
									<Pagination
										count={Math.ceil(total / searchFilter.limit)}
										page={searchFilter.page}
										shape="circular"
										color="primary"
										onChange={paginationHandler}
									/>
								</Stack>
								<Stack className="total-result">
									<Typography>{total} job available</Typography>
								</Stack>
							</Stack>
						)}
					</Stack>
				</Stack>
			</div>
		);
	}
};

MyJobs.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		search: {
			jobStatus: 'ACTIVE',
		},
	},
};

export default MyJobs;
