import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { T } from '../../types/common';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { JobsInquiry } from '../../types/job/job.input';
import { Job } from '../../types/job/job';
import { GET_JOBS } from '../../../apollo/user/query';
import { JobCard } from '../mypage/JobCard';

const MyJobs: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { memberId } = router.query;
	const [searchFilter, setSearchFilter] = useState<JobsInquiry>({ ...initialInput });
	const [employerJobs, setEmployerJobs] = useState<Job[]>([]);
	const [total, setTotal] = useState<number>(0);

	/** APOLLO REQUESTS **/
	const {
		loading: getJobsLoading,
		data: getJobsData,
		error: getJobsError,
		refetch: getJobsRefetch,
	} = useQuery(GET_JOBS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		skip: !searchFilter?.search?.memberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setEmployerJobs(data?.getJobs?.list);
			setTotal(data?.getJobs?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getJobsRefetch().then();
	}, [searchFilter]);

	useEffect(() => {
		if (memberId)
			setSearchFilter({ ...initialInput, search: { ...initialInput.search, memberId: memberId as string } });
	}, [memberId]);

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	if (device === 'mobile') {
		return <div>JOBSTOCK JOBS MOBILE</div>;
	} else {
		return (
			<div id="member-jobs-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">Jobs</Typography>
					</Stack>
				</Stack>
				<Stack className="jobs-list-box">
					<Stack className="list-box">
						{employerJobs?.length > 0 && (
							<Stack className="listing-title-box">
								<Typography className="title-text">Listing title</Typography>
								<Typography className="title-text">Date Published</Typography>
								<Typography className="title-text">Status</Typography>
								<Typography className="title-text">View</Typography>
							</Stack>
						)}
						{employerJobs?.length === 0 && (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No Job found!</p>
							</div>
						)}
						{employerJobs?.map((job: Job) => {
							return <JobCard job={job} memberPage={true} key={job?._id} />;
						})}

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
			memberId: '',
		},
	},
};

export default MyJobs;
