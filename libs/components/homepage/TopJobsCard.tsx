import React from 'react';
import { Stack, Box, Divider, Typography, Chip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Job } from '../../types/job/job';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface TopJobCardProps {
	job: Job;
	likeJobHandler: (user: any, id: string) => void;
}

const TopJobCard = ({ job, likeJobHandler }: TopJobCardProps) => {
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

	if (device === 'mobile') return <Box>TopJobCard Mobile</Box>;

	return (
		<Stack className="top-card-box">
			<Box
				className="card-img"
				style={{ backgroundImage: `url(${REACT_APP_API_URL}/${job.jobImages[0]})` }}
				onClick={() => pushDetailHandler(job._id)}
			>
				<div className="salary-badge">${job.jobSalary.toLocaleString()}</div>
				<div className="type-badge">{job.jobType.replace('_', ' ')}</div>
			</Box>

			<Box className="info">
				<Typography className="title" onClick={() => pushDetailHandler(job._id)}>
					{job.jobTitle}
				</Typography>

				<Typography className="desc" variant="body2">
					{job.jobDesc?.substring(0, 100) || 'No description available'}...
				</Typography>

				<Box className="job-meta">
					<Chip icon={<WorkIcon />} label={`${job.jobExperience}+ yrs`} size="small" />
					<Chip icon={<LocationOnIcon />} label={job.jobLocation} size="small" />
					{job.jobRemote && <Chip label="Remote" size="small" color="primary" />}
					{job.jobVisaSponsor && <Chip label="Visa Sponsor" size="small" color="secondary" />}
				</Box>

				<Box className="deadline-chip">
					<AccessTimeIcon fontSize="small" />
					<Typography variant="caption">Apply by: {formatDate(job.jobApplicationDeadline)}</Typography>
				</Box>

				<Divider sx={{ my: 1 }} />

				<Box className="action-bar">
					<Box className="view-like-box">
						<IconButton size="small">
							<RemoveRedEyeIcon fontSize="small" />
							<Typography variant="caption" ml={0.5}>
								{job.jobViews}
							</Typography>
						</IconButton>

						<IconButton size="small" onClick={() => likeJobHandler(user, job._id)}>
							{job?.meLiked?.[0]?.myFavorite ? (
								<FavoriteIcon color="error" fontSize="small" />
							) : (
								<FavoriteIcon fontSize="small" />
							)}
							<Typography variant="caption" ml={0.5}>
								{job.jobLikes}
							</Typography>
						</IconButton>
					</Box>

					<Chip
						label={job.jobStatus}
						size="small"
						color={job.jobStatus === 'ACTIVE' ? 'success' : 'default'}
						variant="outlined"
					/>
				</Box>
			</Box>
		</Stack>
	);
};

export default TopJobCard;
