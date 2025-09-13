import React from 'react';
import Link from 'next/link';
import {
	TableCell,
	TableHead,
	TableBody,
	TableRow,
	Table,
	TableContainer,
	Button,
	Menu,
	Fade,
	MenuItem,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { Stack } from '@mui/material';
import { REACT_APP_API_URL } from '../../../config';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import { Job } from '../../../types/job/job';
import { JobStatus } from '../../../enums/job.enum';

interface Data {
	id: string;
	title: string;
	salary: string;
	recruiter: string;
	location: string;
	type: string;
	status: string;
}

type Order = 'asc' | 'desc';

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'id',
		numeric: true,
		disablePadding: false,
		label: 'MB ID',
	},
	{
		id: 'title',
		numeric: true,
		disablePadding: false,
		label: 'TITLE',
	},
	{
		id: 'salary',
		numeric: false,
		disablePadding: false,
		label: 'SALARY',
	},
	{
		id: 'recruiter',
		numeric: false,
		disablePadding: false,
		label: 'RECRUITER',
	},
	{
		id: 'location',
		numeric: false,
		disablePadding: false,
		label: 'LOCATION',
	},
	{
		id: 'type',
		numeric: false,
		disablePadding: false,
		label: 'TYPE',
	},
	{
		id: 'status',
		numeric: false,
		disablePadding: false,
		label: 'STATUS',
	},
];

interface EnhancedTableProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, job: keyof Data) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
	const { onSelectAllClick } = props;

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'left' : 'center'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
					>
						{headCell.label}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

interface JobPanelListType {
	jobs: Job[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateJobHandler: any;
	removeJobHandler: any;
}

export const JobPanelList = (props: JobPanelListType) => {
	const { jobs, anchorEl, menuIconClickHandler, menuIconCloseHandler, updateJobHandler, removeJobHandler } = props;

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
					{/*@ts-ignore*/}
					<EnhancedTableHead />
					<TableBody>
						{jobs.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={8}>
									<span className={'no-data'}>data not found!</span>
								</TableCell>
							</TableRow>
						)}

						{jobs.length !== 0 &&
							jobs.map((job: Job, index: number) => {
								const jobImage = `${REACT_APP_API_URL}/${job?.jobImages[0]}`;

								return (
									<TableRow hover key={job?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
										<TableCell align="left">{job._id}</TableCell>
										<TableCell align="left" className={'name'}>
											{job.jobStatus === JobStatus.ACTIVE ? (
												<Stack direction={'row'}>
													<Link href={`/job/detail?id=${job?._id}`}>
														<div>
															<Avatar alt="Remy Sharp" src={jobImage} sx={{ ml: '2px', mr: '10px' }} />
														</div>
													</Link>
													<Link href={`/job/detail?id=${job?._id}`}>
														<div>{job.jobTitle}</div>
													</Link>
												</Stack>
											) : (
												<Stack direction={'row'}>
													<div>
														<Avatar alt="Remy Sharp" src={jobImage} sx={{ ml: '2px', mr: '10px' }} />
													</div>
													<div style={{ marginTop: '10px' }}>{job.jobTitle}</div>
												</Stack>
											)}
										</TableCell>
										<TableCell align="center">
											${job.jobSalary} / {job.salaryType}
										</TableCell>
										<TableCell align="center">{job.memberData?.memberNick}</TableCell>
										<TableCell align="center">{job.jobLocation}</TableCell>
										<TableCell align="center">{job.jobType}</TableCell>
										<TableCell align="center">
											{job.jobStatus === JobStatus.DELETE && (
												<Button
													variant="outlined"
													sx={{ p: '3px', border: 'none', ':hover': { border: '1px solid #000000' } }}
													onClick={() => removeJobHandler(job._id)}
												>
													<DeleteIcon fontSize="small" />
												</Button>
											)}

											{job.jobStatus === JobStatus.CLOSED && (
												<Button className={'badge warning'}>{job.jobStatus}</Button>
											)}

											{job.jobStatus === JobStatus.ACTIVE && (
												<>
													<Button onClick={(e: any) => menuIconClickHandler(e, index)} className={'badge success'}>
														{job.jobStatus}
													</Button>

													<Menu
														className={'menu-modal'}
														MenuListProps={{
															'aria-labelledby': 'fade-button',
														}}
														anchorEl={anchorEl[index]}
														open={Boolean(anchorEl[index])}
														onClose={menuIconCloseHandler}
														TransitionComponent={Fade}
														sx={{ p: 1 }}
													>
														{Object.values(JobStatus)
															.filter((ele) => ele !== job.jobStatus)
															.map((status: string) => (
																<MenuItem
																	onClick={() => updateJobHandler({ _id: job._id, jobStatus: status })}
																	key={status}
																>
																	<Typography variant={'subtitle1'} component={'span'}>
																		{status}
																	</Typography>
																</MenuItem>
															))}
													</Menu>
												</>
											)}
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
