import React from 'react';
import { Stack, Box, Chip, Typography, Card, CardContent, CardMedia, Divider } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import { Job } from '../../types/job/job';
import { REACT_APP_API_URL, topJobRank } from '../../config';
import { formatterStr } from '../../utils';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';

interface JobBigCardProps {
	job: Job;
	likeJobHandler?: any;
}

const JobBigCard = (props: JobBigCardProps) => {
	const { job, likeJobHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** HANDLERS **/
	const goJobDetailPage = (jobId: string) => {
		router.push(`/job/detail?id=${jobId}`);
	};

	const handleLikeClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		likeJobHandler(user, job?._id);
	};

	if (device === 'mobile') {
		return <div>JOB BIG CARD</div>;
	} else {
		return (
			<Card className="job-big-card" onClick={() => goJobDetailPage(job?._id)}>
				<Box className="card-media-container">
					<CardMedia
						className="card-media"
						image={`${REACT_APP_API_URL}/${job?.jobImages?.[0]}`}
						title={job?.jobTitle}
					/>
					{job && job?.jobRank >= topJobRank && (
						<Chip
							className="featured-badge"
							icon={<span className="bolt-icon">⚡</span>}
							label="Featured"
							color="primary"
							size="small"
						/>
					)}
					<Chip className="salary-badge" label={`$${formatterStr(job?.jobSalary)}`} color="secondary" size="medium" />
					<Box className="overlay">
						<Typography className="view-details">View Details</Typography>
					</Box>
				</Box>

				<CardContent className="card-content">
					<Typography className="job-title" variant="h6" component="h2">
						{job?.jobTitle}
					</Typography>

					<Stack direction="row" alignItems="center" spacing={1} className="company-info">
						<BusinessIcon fontSize="small" />
						<Typography variant="body2" color="textSecondary">
							{job?.companyName}
						</Typography>
					</Stack>

					<Stack direction="row" alignItems="center" spacing={1} className="location-info">
						<LocationOnIcon fontSize="small" />
						<Typography variant="body2" color="textSecondary">
							{job?.jobAddress}
						</Typography>
					</Stack>

					<Stack direction="row" spacing={1} className="job-tags" sx={{ mt: 2, mb: 2 }}>
						<Chip icon={<WorkIcon />} label={job?.jobType} variant="outlined" size="small" color="primary" />
						<Chip label={`${job?.jobExperience} yrs exp`} variant="outlined" size="small" />
					</Stack>

					<Stack direction="row" spacing={1} className="job-features">
						{job?.jobRemote && <Chip label="Remote" color="success" variant="filled" size="small" />}
						{job?.jobVisaSponsor && <Chip label="Visa Sponsor" color="info" variant="filled" size="small" />}
					</Stack>

					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<div>
							{job?.jobRemote ? <p>Remote</p> : <span>Remote</span>}
							{job?.jobVisaSponsor ? <p>Visa </p> : <span>Visa </span>}
						</div>
						<div className="buttons-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{job?.jobViews}</Typography>
							<IconButton color={'default'} onClick={handleLikeClick}>
								{job?.meLiked && job?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{job?.jobLikes}</Typography>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}
};

export default JobBigCard;
