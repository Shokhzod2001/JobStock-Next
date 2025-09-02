import React from 'react';
import { Box, Typography, Chip, Tooltip, Button, Card, CardContent } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import { Job } from '../../types/job/job';
import { useRouter } from 'next/router';
import { JobType, SalaryType } from '../../enums/job.enum';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { REACT_APP_API_URL } from '../../config';

interface JobListItemType {
	job: Job;
	likeJobHandler?: any;
}

const JobListItem = (props: JobListItemType) => {
	const { job, likeJobHandler } = props;
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
			default:
				return amount;
		}
	};

	if (device === 'mobile') {
		return <div>JOB LIST ITEM MOBILE</div>;
	} else {
		return (
			<Card className="job-list-item" sx={{ mb: 2, borderRadius: 2 }}>
				<CardContent sx={{ display: 'flex', p: 3, gap: 3 }}>
					<Box
						sx={{
							width: 100,
							height: 100,
							borderRadius: 2,
							backgroundImage: `url(${REACT_APP_API_URL}/${job.jobImages[0]})`,
							backgroundSize: 'cover',
							backgroundPosition: 'center',
							flexShrink: 0,
						}}
					/>

					<Box sx={{ flexGrow: 1 }}>
						<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
							<BusinessIcon sx={{ fontSize: 16, color: 'primary.main', mr: 1 }} />
							<Typography variant="subtitle2" color="primary" fontWeight="600">
								{job.companyName}
							</Typography>
						</Box>

						<Typography
							variant="h6"
							sx={{
								fontWeight: 700,
								mb: 1,
								cursor: 'pointer',
								'&:hover': { color: 'primary.main' },
							}}
						>
							{job.jobTitle}
						</Typography>

						<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
							<Chip icon={<WorkIcon />} label={`${job.jobExperience}+ yrs`} size="small" variant="outlined" />
							<Chip
								icon={<LocationOnIcon />}
								label={job.jobLocation.replace('_', ' ')}
								size="small"
								variant="outlined"
							/>
							<Chip
								label={formatSalary(job.jobSalary, job.salaryType)}
								size="small"
								color="primary"
								variant="outlined"
							/>
							{job.jobVisaSponsor && <Chip label="Visa Sponsor" size="small" color="secondary" variant="outlined" />}
							{job.jobRemote && <Chip label="Remote" size="small" color="secondary" variant="outlined" />}
						</Box>

						<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
								<AccessTimeIcon fontSize="small" />
								<Typography variant="caption">Apply by: {formatDate(job.jobApplicationDeadline)}</Typography>
							</Box>

							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
								<Tooltip title="Views">
									<Box sx={{ display: 'flex', alignItems: 'center' }}>
										<RemoveRedEyeIcon fontSize="small" />
										<Typography variant="caption" ml={0.5}>
											{job.jobViews}
										</Typography>
									</Box>
								</Tooltip>

								<Tooltip title={job?.meLiked?.[0]?.myFavorite ? 'Remove from favorites' : 'Add to favorites'}>
									<IconButton size="small" onClick={() => likeJobHandler(user, job._id)} sx={{ ml: 1 }}>
										{job?.meLiked?.[0]?.myFavorite ? (
											<FavoriteIcon color="error" fontSize="small" />
										) : (
											<FavoriteIcon fontSize="small" />
										)}
										<Typography variant="caption" ml={0.5}>
											{job.jobLikes}
										</Typography>
									</IconButton>
								</Tooltip>

								<Button
									variant="contained"
									size="medium"
									onClick={() => pushDetailHandler(job._id)}
									sx={{ ml: 2, color: 'white' }}
								>
									Apply Now
								</Button>
							</Box>
						</Box>
					</Box>
				</CardContent>
			</Card>
		);
	}
};

export default JobListItem;
