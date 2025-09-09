import React from 'react';
import { Typography, Chip, Tooltip, Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import { Job } from '../../types/job/job';

import { REACT_APP_API_URL, topJobRank } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import { JobType, SalaryType } from '../../enums/job.enum';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface JobCardType {
	job: Job;
	likeJobHandler?: any;
	myFavorites?: boolean;
	recentlyVisited?: boolean;
}

const JobCard = (props: JobCardType) => {
	const { job, likeJobHandler, myFavorites, recentlyVisited } = props;
	const device = useDeviceDetect();
	const router = useRouter();

	const user = useReactiveVar(userVar);

	const pushDetailHandler = (jobId: string) => {
		router.push({ pathname: `/job/detail`, query: { id: jobId } });
	};

	const formatDate = (dateString: Date) => {
		const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
		return new Date(dateString).toLocaleDateString('en-US', options);
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

	const getJobTypeLabel = (type: JobType) => {
		return type.toLowerCase().replace('_', ' ');
	};

	if (device === 'mobile') {
		return <div>JOB CARD</div>;
	} else {
		return (
			<div className="job-card-box">
				<div className="card-img" style={{ backgroundImage: `url(${REACT_APP_API_URL}/${job.jobImages[0]})` }}>
					<div className="salary-badge">{formatSalary(job.jobSalary, job.salaryType)}</div>
					<div className="type-badge">{getJobTypeLabel(job.jobType)}</div>
				</div>

				<div className="info">
					{/* Company Name */}
					<div className="company-info">
						<BusinessIcon sx={{ fontSize: 16, color: 'primary.main', mr: 1 }} />
						<Typography variant="subtitle2" color="primary" fontWeight="600">
							{job.companyName}
						</Typography>
					</div>

					{/* Job Title */}
					<Typography className="title">{job.jobTitle}</Typography>

					{/* Job Meta Information */}
					<div className="job-meta">
						<Tooltip title="Required experience">
							<Chip icon={<WorkIcon />} label={`${job.jobExperience}+ yrs`} size="small" variant="outlined" />
						</Tooltip>

						<Tooltip title="Location">
							<Chip
								icon={<LocationOnIcon />}
								label={job.jobLocation.replace('_', ' ')}
								size="small"
								variant="outlined"
							/>
						</Tooltip>

						{job.jobVisaSponsor && (
							<Tooltip title="Visa sponsorship available">
								<Chip label="Visa Sponsor" size="small" color="secondary" variant="outlined" />
							</Tooltip>
						)}

						{job.jobRemote && (
							<Tooltip title="Remote available">
								<Chip label="Remote" size="small" color="secondary" variant="outlined" />
							</Tooltip>
						)}
					</div>

					{/* Application Deadline */}
					<div className="deadline-chip">
						<AccessTimeIcon fontSize="small" />
						<Typography variant="caption">Apply by: {formatDate(job.jobApplicationDeadline)}</Typography>
					</div>

					<div className="view-like-box">
						<Tooltip title="Views">
							<IconButton size="small" className="action-button">
								<RemoveRedEyeIcon fontSize="small" />
								<Typography variant="caption" ml={0.5}>
									{job.jobViews}
								</Typography>
							</IconButton>
						</Tooltip>

						<Tooltip title="Applications">
							<IconButton size="small" className="action-button">
								<WorkIcon fontSize="small" />
								<Typography variant="caption" ml={0.5}>
									{job.jobApplications}
								</Typography>
							</IconButton>
						</Tooltip>
						{!recentlyVisited && (
							<Tooltip title={job?.meLiked?.[0]?.myFavorite ? 'Remove from favorites' : 'Add to favorites'}>
								<IconButton size="small" className="action-button" onClick={() => likeJobHandler(user, job._id)}>
									{myFavorites ? (
										<FavoriteIcon color="error" />
									) : job?.meLiked && job?.meLiked[0]?.myFavorite ? (
										<FavoriteIcon color="error" />
									) : (
										<FavoriteBorderIcon />
									)}
									<Typography variant="caption" ml={0.5}>
										{job.jobLikes}
									</Typography>
								</IconButton>
							</Tooltip>
						)}

						<Button
							variant="contained"
							size="medium"
							className="apply-btn"
							style={{ marginLeft: recentlyVisited ? 100 : 60, color: 'white' }}
							onClick={() => pushDetailHandler(job._id)}
						>
							Apply
						</Button>
					</div>
				</div>
			</div>
		);
	}
};

export default JobCard;
