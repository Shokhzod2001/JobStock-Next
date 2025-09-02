import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import {
	Box,
	Button,
	Menu,
	MenuItem,
	Pagination,
	Stack,
	Typography,
	ToggleButton,
	ToggleButtonGroup,
} from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import { Direction, Message } from '../../libs/enums/common.enum';
import { useMutation, useQuery } from '@apollo/client';
import { T } from '../../libs/types/common';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { JobsInquiry } from '../../libs/types/job/job.input';
import { Job } from '../../libs/types/job/job';
import { LIKE_TARGET_JOB } from '../../apollo/user/mutation';
import { GET_JOBS } from '../../apollo/user/query';
import Filter from '../../libs/components/job/Filter';
import RemoteHiringCompanies from '../../libs/components/job/Companies';
import JobCard from '../../libs/components/job/JobCard';
import JobListItem from '../../libs/components/job/JobListItem'; // You'll need to create this

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const JobList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [searchFilter, setSearchFilter] = useState<JobsInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [jobs, setJobs] = useState<Job[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortingOpen, setSortingOpen] = useState(false);
	const [filterSortName, setFilterSortName] = useState('New');
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

	/** APOLLO REQUESTS **/
	const [likeTargetJob] = useMutation(LIKE_TARGET_JOB);

	const {
		loading: getJobsLoading,
		data: getJobsData,
		error: getJobsError,
		refetch: getJobsRefetch,
	} = useQuery(GET_JOBS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setJobs(data?.getJobs?.list);
			setTotal(data?.getJobs?.metaCounter[0]?.total);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const inputObj = JSON.parse(router?.query?.input as string);
			setSearchFilter(inputObj);
		}

		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, [router]);

	/** HANDLERS **/
	const handleViewModeChange = (event: React.MouseEvent<HTMLElement>, newViewMode: 'grid' | 'list') => {
		if (newViewMode !== null) {
			setViewMode(newViewMode);
		}
	};

	const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		await router.push(`/job?input=${JSON.stringify(searchFilter)}`, `/job?input=${JSON.stringify(searchFilter)}`, {
			scroll: false,
		});
		setCurrentPage(value);
	};

	const likeJobHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeTargetJob({ variables: { input: id } });

			await getJobsRefetch({ input: initialInput });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeJobHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		switch (e.currentTarget.id) {
			case 'new':
				setSearchFilter({ ...searchFilter, sort: 'postedAt', direction: Direction.DESC });
				setFilterSortName('New');
				break;
			case 'salary-low':
				setSearchFilter({ ...searchFilter, sort: 'jobSalary', direction: Direction.ASC });
				setFilterSortName('Lowest Salary');
				break;
			case 'salary-high':
				setSearchFilter({ ...searchFilter, sort: 'jobSalary', direction: Direction.DESC });
				setFilterSortName('Highest Salary');
				break;
			case 'deadline':
				setSearchFilter({ ...searchFilter, sort: 'jobApplicationDeadline', direction: Direction.ASC });
				setFilterSortName('Deadline');
				break;
		}
		setSortingOpen(false);
		setAnchorEl(null);
	};

	if (device === 'mobile') {
		return <h1>JOBS MOBILE</h1>;
	} else {
		return (
			<div id="job-list-page" style={{ position: 'relative' }}>
				<RemoteHiringCompanies />
				<div className="container">
					<Box component={'div'} className={'view-controls'}>
						<span>Sort by</span>
						<div>
							<Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
								{filterSortName}
							</Button>
							<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
								<MenuItem
									onClick={sortingHandler}
									id={'new'}
									disableRipple
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									New
								</MenuItem>
								<MenuItem
									onClick={sortingHandler}
									id={'salary-low'}
									disableRipple
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									Lowest Salary
								</MenuItem>
								<MenuItem
									onClick={sortingHandler}
									id={'salary-high'}
									disableRipple
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									Highest Salary
								</MenuItem>
								<MenuItem
									onClick={sortingHandler}
									id={'deadline'}
									disableRipple
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									Deadline
								</MenuItem>
							</Menu>
						</div>

						<ToggleButtonGroup
							value={viewMode}
							exclusive
							onChange={handleViewModeChange}
							aria-label="view mode"
							sx={{ ml: 2 }}
						>
							<ToggleButton value="grid" aria-label="grid view">
								<ViewModuleIcon />
							</ToggleButton>
							<ToggleButton value="list" aria-label="list view">
								<ViewListIcon />
							</ToggleButton>
						</ToggleButtonGroup>
					</Box>

					<Stack className={'job-page'}>
						<Stack className={'filter-config'}>
							{/* @ts-ignore */}
							<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
						</Stack>
						<Stack className="main-config" mb={'76px'}>
							<Stack className={`list-config ${viewMode}-view`}>
								{jobs?.length === 0 ? (
									<div className={'no-data'}>
										<img src="/img/icons/icoAlert.svg" alt="" />
										<p>No Jobs found!</p>
									</div>
								) : viewMode === 'grid' ? (
									// Grid View
									jobs.map((job: Job) => <JobCard job={job} likeJobHandler={likeJobHandler} key={job?._id} />)
								) : (
									// List View
									jobs.map((job: Job) => <JobListItem job={job} likeJobHandler={likeJobHandler} key={job?._id} />)
								)}
							</Stack>
							<Stack className="pagination-config">
								{jobs.length !== 0 && (
									<Stack className="pagination-box">
										<Pagination
											page={currentPage}
											count={Math.ceil(total / searchFilter.limit)}
											onChange={handlePaginationChange}
											shape="circular"
											color="primary"
										/>
									</Stack>
								)}

								{jobs.length !== 0 && (
									<Stack className="total-result">
										<Typography>
											Total {total} job{total > 1 ? 's' : ''} available
										</Typography>
									</Stack>
								)}
							</Stack>
						</Stack>
					</Stack>
				</div>
			</div>
		);
	}
};

JobList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		sort: 'postedAt',
		direction: 'DESC',
		search: {
			salaryRange: {
				start: 0,
				end: 200000,
			},
			experienceRange: {
				start: 0,
				end: 20,
			},
		},
	},
};

export default withLayoutBasic(JobList);
