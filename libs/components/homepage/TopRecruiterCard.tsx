import React from 'react';
import { useRouter } from 'next/router';
import { Box, IconButton, Stack, Typography, Chip, Rating } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Member } from '../../types/member/member';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import StarIcon from '@mui/icons-material/Star';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

interface TopRecruiterProps {
	recruiter: Member;
	likeMemberHandler: (user: any, id: string) => void;
}

const TopRecruiterCard = (props: TopRecruiterProps) => {
	const { recruiter, likeMemberHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	const recruiterImage = recruiter?.memberImage
		? `${process.env.REACT_APP_API_URL}/${recruiter?.memberImage}`
		: '/img/profile/defaultUser.svg';

	/** HANDLERS **/
	const pushDetailHandler = (id: string) => {
		router.push({ pathname: `/recruiter/detail`, query: { id } });
	};

	if (device === 'mobile') {
		return <Box>Top Recruiters Mobile</Box>;
	} else {
		return (
			<Stack className="top-recruiter-card">
				<Box className="card-header">
					<Box className="recruiter-image" onClick={() => pushDetailHandler(recruiter._id)}>
						<img src={recruiterImage} alt={recruiter.memberNick} />
						<Box className="online-indicator" />
					</Box>

					<Box className="action-buttons">
						<IconButton size="small" onClick={() => likeMemberHandler(user, recruiter._id)} className="like-btn">
							{recruiter?.meLiked?.[0]?.myFavorite ? (
								<FavoriteIcon color="error" fontSize="small" />
							) : (
								<FavoriteIcon fontSize="small" />
							)}
						</IconButton>
					</Box>
				</Box>

				<Box className="recruiter-info">
					<Typography className="recruiter-name" onClick={() => pushDetailHandler(recruiter._id)}>
						{recruiter.memberNick}
					</Typography>

					<Typography className="recruiter-title">{recruiter.memberType?.replace('_', ' ')}</Typography>

					{recruiter.memberAddress && (
						<Box className="location-info">
							<LocationOnIcon fontSize="small" />
							<Typography variant="caption">{recruiter.memberAddress}</Typography>
						</Box>
					)}

					<Box className="stats-row">
						<Box className="stat-item">
							<WorkIcon fontSize="small" />
							<Typography variant="caption">{recruiter.memberProperties || 0} jobs</Typography>
						</Box>

						<Box className="stat-item">
							<RemoveRedEyeIcon fontSize="small" />
							<Typography variant="caption">{recruiter.memberViews || 0}</Typography>
						</Box>
					</Box>

					<Box className="rating-section">
						<Rating
							value={recruiter.memberRank || 0}
							readOnly
							size="small"
							icon={<StarIcon fontSize="inherit" />}
							emptyIcon={<StarIcon fontSize="inherit" />}
						/>
						<Typography variant="caption" className="rating-text">
							({recruiter.memberRank || 0})
						</Typography>
					</Box>

					{recruiter.memberDesc && (
						<Typography className="recruiter-desc" variant="body2">
							{recruiter.memberDesc.length > 80 ? `${recruiter.memberDesc.substring(0, 80)}...` : recruiter.memberDesc}
						</Typography>
					)}

					<Box className="metrics-row">
						<Chip label={`${recruiter.memberFollowers || 0} followers`} size="small" variant="outlined" />
						<Chip label={`${recruiter.memberFollowings || 0} following`} size="small" variant="outlined" />
					</Box>

					<Box className="engagement-stats">
						<Box className="engagement-item">
							<Typography variant="caption" className="stat-number">
								{recruiter.memberLikes || 0}
							</Typography>
							<Typography variant="caption" className="stat-label">
								Likes
							</Typography>
						</Box>

						<Box className="engagement-item">
							<Typography variant="caption" className="stat-number">
								{recruiter.memberComments || 0}
							</Typography>
							<Typography variant="caption" className="stat-label">
								Reviews
							</Typography>
						</Box>

						<Box className="engagement-item">
							<Typography variant="caption" className="stat-number">
								{recruiter.memberPoints || 0}
							</Typography>
							<Typography variant="caption" className="stat-label">
								Points
							</Typography>
						</Box>
					</Box>
				</Box>
			</Stack>
		);
	}
};

export default TopRecruiterCard;
