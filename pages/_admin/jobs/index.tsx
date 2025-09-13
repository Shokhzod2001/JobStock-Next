import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, List, ListItem, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import TablePagination from '@mui/material/TablePagination';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { useMutation, useQuery } from '@apollo/client';
import { T } from '../../../libs/types/common';
import { AllJobsInquiry } from '../../../libs/types/job/job.input';
import { Job } from '../../../libs/types/job/job';
import { REMOVE_JOB_BY_ADMIN, UPDATE_JOB_BY_ADMIN } from '../../../apollo/admin/mutation';
import { GET_ALL_JOBS_BY_ADMIN } from '../../../apollo/admin/query';
import { JobLocation, JobStatus } from '../../../libs/enums/job.enum';
import { JobUpdate } from '../../../libs/types/job/job.update';
import { JobPanelList } from '../../../libs/components/admin/jobs/JobList';

const AdminJobs: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [jobsInquiry, setJobsInquiry] = useState<AllJobsInquiry>(initialInquiry);
	const [jobs, setJobs] = useState<Job[]>([]);
	const [jobsTotal, setJobsTotal] = useState<number>(0);
	const [value, setValue] = useState(jobsInquiry?.search?.jobStatus ? jobsInquiry?.search?.jobStatus : 'ALL');
	const [searchType, setSearchType] = useState('ALL');

	/** APOLLO REQUESTS **/
	const [updateJobByAdmin] = useMutation(UPDATE_JOB_BY_ADMIN);
	const [removeJobByAdmin] = useMutation(REMOVE_JOB_BY_ADMIN);
	const {
		loading: getAllJobsByAdminLoading,
		data: getAllJobsByAdminData,
		error: getAllJobsByAdminError,
		refetch: getAllJobsByAdminRefetch,
	} = useQuery(GET_ALL_JOBS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: jobsInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setJobs(data?.getAllJobsByAdmin?.list);
			setJobsTotal(data?.getAllJobsByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getAllJobsByAdminRefetch({ input: jobsInquiry }).then();
	}, [jobsInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		jobsInquiry.page = newPage + 1;
		await getAllJobsByAdminRefetch({ input: jobsInquiry });
		setJobsInquiry({ ...jobsInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		jobsInquiry.limit = parseInt(event.target.value, 10);
		jobsInquiry.page = 1;
		await getAllJobsByAdminRefetch({ input: jobsInquiry });
		setJobsInquiry({ ...jobsInquiry });
	};

	const menuIconClickHandler = (e: any, index: number) => {
		const tempAnchor = anchorEl.slice();
		tempAnchor[index] = e.currentTarget;
		setAnchorEl(tempAnchor);
	};

	const menuIconCloseHandler = () => {
		setAnchorEl([]);
	};

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);

		setJobsInquiry({ ...jobsInquiry, page: 1, sort: 'createdAt' });

		switch (newValue) {
			case 'ACTIVE':
				setJobsInquiry({ ...jobsInquiry, search: { jobStatus: JobStatus.ACTIVE } });
				break;
			case 'CLOSED':
				setJobsInquiry({ ...jobsInquiry, search: { jobStatus: JobStatus.CLOSED } });
				break;
			case 'DELETE':
				setJobsInquiry({ ...jobsInquiry, search: { jobStatus: JobStatus.DELETE } });
				break;
			default:
				delete jobsInquiry?.search?.jobStatus;
				setJobsInquiry({ ...jobsInquiry });
				break;
		}
	};

	const removeJobHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to remove?')) {
				await removeJobByAdmin({
					variables: {
						input: id,
					},
				});

				await getAllJobsByAdminRefetch({ input: jobsInquiry });
			}
			menuIconCloseHandler();
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const searchTypeHandler = async (newValue: string) => {
		try {
			setSearchType(newValue);

			if (newValue !== 'ALL') {
				setJobsInquiry({
					...jobsInquiry,
					page: 1,
					sort: 'createdAt',
					search: {
						...jobsInquiry.search,
						jobLocationList: [newValue as JobLocation],
					},
				});
			} else {
				delete jobsInquiry?.search?.jobLocationList;
				setJobsInquiry({ ...jobsInquiry });
			}
		} catch (err: any) {
			console.log('searchTypeHandler: ', err.message);
		}
	};

	const updateJobHandler = async (updateData: JobUpdate) => {
		try {
			console.log('+updateData: ', updateData);
			await updateJobByAdmin({
				variables: {
					input: updateData,
				},
			});
			menuIconCloseHandler();
			await getAllJobsByAdminRefetch({ input: jobsInquiry });
		} catch (err: any) {
			menuIconCloseHandler();
			sweetErrorHandling(err).then();
		}
	};

	return (
		<Box component={'div'} className={'content'}>
			<Typography variant={'h2'} className={'tit'} sx={{ mb: '24px' }}>
				Job List
			</Typography>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={value}>
						<Box component={'div'}>
							<List className={'tab-menu'}>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'ALL')}
									value="ALL"
									className={value === 'ALL' ? 'li on' : 'li'}
								>
									All
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'ACTIVE')}
									value="ACTIVE"
									className={value === 'ACTIVE' ? 'li on' : 'li'}
								>
									Active
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'CLOSED')}
									value="CLOSED"
									className={value === 'CLOSED' ? 'li on' : 'li'}
								>
									Closed
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'DELETE')}
									value="DELETE"
									className={value === 'DELETE' ? 'li on' : 'li'}
								>
									Delete
								</ListItem>
							</List>
							<Divider />
							<Stack className={'search-area'} sx={{ m: '24px' }}>
								<Select sx={{ width: '160px', mr: '20px' }} value={searchType}>
									<MenuItem value={'ALL'} onClick={() => searchTypeHandler('ALL')}>
										ALL
									</MenuItem>
									{Object.values(JobLocation).map((location: string) => (
										<MenuItem value={location} onClick={() => searchTypeHandler(location)} key={location}>
											{location}
										</MenuItem>
									))}
								</Select>
							</Stack>
							<Divider />
						</Box>
						<JobPanelList
							jobs={jobs}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateJobHandler={updateJobHandler}
							removeJobHandler={removeJobHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={jobsTotal}
							rowsPerPage={jobsInquiry?.limit}
							page={jobsInquiry?.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

AdminJobs.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withAdminLayout(AdminJobs);
