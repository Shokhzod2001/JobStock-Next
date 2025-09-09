import { Menu, MenuItem, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import IconButton from '@mui/material/IconButton';
import ModeIcon from '@mui/icons-material/Mode';
import DeleteIcon from '@mui/icons-material/Delete';
import { Job } from '../../types/job/job';
import { formatterStr } from '../../utils';
import Moment from 'react-moment';
import { useRouter } from 'next/router';
import { JobStatus, SalaryType } from '../../enums/job.enum';

interface JobCardProps {
	job: Job;
	deleteJobHandler?: any;
	memberPage?: boolean;
	updateJobHandler?: any;
}

export const JobCard = (props: JobCardProps) => {
	const { job, deleteJobHandler, memberPage, updateJobHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	/** HANDLERS **/
	const pushEditJob = async (id: string) => {
		console.log('+pushEditJob: ', id);
		await router.push({
			pathname: '/mypage',
			query: { category: 'addJob', jobId: id },
		});
	};

	const pushJobDetail = async (id: string) => {
		if (memberPage)
			await router.push({
				pathname: '/job/detail',
				query: { id: id },
			});
		else return;
	};

	const handleClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const formatSalary = (salary: number, type: SalaryType) => {
		const formatter = new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		});

		const amount = formatter.format(salary);

		switch (type) {
			case SalaryType.HOURLY:
				return `${amount}/hr`;
			case SalaryType.DAILY:
				return `${amount}/day`;
			case SalaryType.WEEKLY:
				return `${amount}/week`;
			case SalaryType.MONTHLY:
				return `${amount}/month`;
			case SalaryType.YEARLY:
				return `${amount}/year`;
			case SalaryType.PROJECT:
				return `${amount}/project`;
			case SalaryType.COMMISSION:
				return `Commission: ${amount}`;
			default:
				return amount;
		}
	};

	if (device === 'mobile') {
		return <div>MOBILE JOB CARD</div>;
	} else
		return (
			<Stack className="job-card-box">
				<Stack className="image-box" onClick={() => pushJobDetail(job?._id)}>
					<img src={`${process.env.REACT_APP_API_URL}/${job.jobImages[0]}`} alt="" />
				</Stack>
				<Stack className="information-box" onClick={() => pushJobDetail(job?._id)}>
					<Typography className="name">{job.jobTitle}</Typography>
					<Typography className="address">{job.jobAddress}</Typography>
					<Typography className="price">
						<strong>{formatSalary(job.jobSalary, job.salaryType)}</strong>
					</Typography>
				</Stack>
				<Stack className="date-box">
					<Typography className="date">
						<Moment format="DD MMMM, YYYY">{job.createdAt}</Moment>
					</Typography>
				</Stack>
				<Stack className="status-box">
					<Stack className="coloured-box" sx={{ background: '#E5F0FD' }} onClick={handleClick}>
						<Typography className="status" sx={{ color: '#3554d1' }}>
							{job.jobStatus}
						</Typography>
					</Stack>
				</Stack>
				{!memberPage && job.jobStatus !== 'CLOSED' && (
					<Menu
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						PaperProps={{
							elevation: 0,
							sx: {
								width: '70px',
								mt: 1,
								ml: '10px',
								overflow: 'visible',
								filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
							},
							style: {
								padding: 0,
								display: 'flex',
								justifyContent: 'center',
							},
						}}
					>
						{job.jobStatus === 'ACTIVE' && (
							<>
								<MenuItem
									disableRipple
									onClick={() => {
										handleClose();
										updateJobHandler(JobStatus.CLOSED, job?._id);
									}}
								>
									Close
								</MenuItem>
							</>
						)}
					</Menu>
				)}

				<Stack className="views-box">
					<Typography className="views">{job.jobViews.toLocaleString()}</Typography>
				</Stack>
				{!memberPage && job.jobStatus === JobStatus.ACTIVE && (
					<Stack className="action-box">
						<IconButton className="icon-button" onClick={() => pushEditJob(job._id)}>
							<ModeIcon className="buttons" />
						</IconButton>
						<IconButton className="icon-button" onClick={() => deleteJobHandler(job._id)}>
							<DeleteIcon className="buttons" />
						</IconButton>
					</Stack>
				)}
			</Stack>
		);
};
