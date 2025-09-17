import React from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Box, Typography, Chip, Rating, Tooltip } from '@mui/material';
import Link from 'next/link';
import { REACT_APP_API_URL } from '../../config';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface RecruiterCardProps {
	recruiter: any;
	likeMemberHandler: any;
}

const RecruiterCard = (props: RecruiterCardProps) => {
	const { recruiter, likeMemberHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);

	const imagePath: string = recruiter?.memberImage
		? `${REACT_APP_API_URL}/${recruiter?.memberImage}`
		: '/img/profile/defaultUser.svg';

	if (device === 'mobile') {
		return (
			<Stack className="recruiter-card">
				<Link
					href={{
						pathname: '/recruiter/detail',
						query: { agentId: recruiter?._id },
					}}
				>
					<Box className="agent-image" style={{ backgroundImage: `url(${imagePath})` }}>
						<Box className="job-count-badge">
							<WorkOutlineIcon fontSize="small" />
							<Typography variant="body2" style={{ fontSize: '11px' }}>
								{recruiter?.memberProperties || 0}
							</Typography>
						</Box>
					</Box>
				</Link>

				<Box className="card-content">
					<Box className="agent-info">
						<Link
							href={{
								pathname: '/recruiter/detail',
								query: { agentId: recruiter?._id },
							}}
						>
							<Typography variant="h3" className="agent-name">
								{recruiter?.memberFullName || recruiter?.memberNick}
							</Typography>
						</Link>
						<Typography variant="body2" className="agent-title">
							Professional Recruiter
						</Typography>

						{recruiter?.memberAddress && (
							<Box className="agent-location">
								<LocationOnOutlinedIcon fontSize="small" />
								<Typography variant="body2" style={{ fontSize: '11px' }}>
									{recruiter.memberAddress}
								</Typography>
							</Box>
						)}

						{recruiter?.memberDesc && (
							<Typography variant="body2" className="agent-desc">
								{recruiter.memberDesc.length > 80
									? `${recruiter.memberDesc.substring(0, 80)}...`
									: recruiter.memberDesc}
							</Typography>
						)}
					</Box>

					<Box className="divider"></Box>

					<Box className="agent-stats">
						<Box className="stat">
							<Typography variant="h4">{recruiter?.memberFollowers || 0}</Typography>
							<Typography variant="body2">Followers</Typography>
						</Box>
						<Box className="stat">
							<Typography variant="h4">{recruiter?.memberFollowings || 0}</Typography>
							<Typography variant="body2">Following</Typography>
						</Box>
						<Box className="stat">
							<Typography variant="h4">{recruiter?.memberArticles || 0}</Typography>
							<Typography variant="body2">Articles</Typography>
						</Box>
					</Box>

					<Box className="divider"></Box>

					<Box className="card-actions">
						<Tooltip title="Views">
							<Box className="action-item">
								<RemoveRedEyeIcon fontSize="small" />
								<Typography variant="body2">{recruiter?.memberViews || 0}</Typography>
							</Box>
						</Tooltip>

						<Tooltip title={recruiter?.meLiked && recruiter?.meLiked[0]?.myFavorite ? 'Unlike' : 'Like'}>
							<IconButton
								className={`action-item ${recruiter?.meLiked && recruiter?.meLiked[0]?.myFavorite ? 'liked' : ''}`}
								onClick={() => likeMemberHandler(user, recruiter?._id)}
							>
								{recruiter?.meLiked && recruiter?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon color="error" />
								) : (
									<FavoriteBorderIcon />
								)}
								<Typography variant="body2">{recruiter?.memberLikes || 0}</Typography>
							</IconButton>
						</Tooltip>

						<Tooltip title="Comments">
							<Box className="action-item">
								<ChatBubbleOutlineIcon fontSize="small" />
								<Typography variant="body2">{recruiter?.memberComments || 0}</Typography>
							</Box>
						</Tooltip>
					</Box>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="recruiter-card">
				<Link
					href={{
						pathname: '/recruiter/detail',
						query: { agentId: recruiter?._id },
					}}
				>
					<Box className="agent-image" style={{ backgroundImage: `url(${imagePath})` }}>
						<Box className="job-count-badge">
							<WorkOutlineIcon fontSize="small" />
							<Typography variant="body2">{recruiter?.memberProperties || 0}</Typography>
						</Box>
					</Box>
				</Link>

				<Box className="card-content">
					<Box className="agent-info">
						<Link
							href={{
								pathname: '/recruiter/detail',
								query: { agentId: recruiter?._id },
							}}
						>
							<Typography variant="h3" className="agent-name">
								{recruiter?.memberFullName || recruiter?.memberNick}
							</Typography>
						</Link>
						<Typography variant="body2" className="agent-title">
							Professional Recruiter
						</Typography>

						{recruiter?.memberAddress && (
							<Box className="agent-location">
								<LocationOnOutlinedIcon fontSize="small" />
								<Typography variant="body2">{recruiter.memberAddress}</Typography>
							</Box>
						)}

						{recruiter?.memberDesc && (
							<Typography variant="body2" className="agent-desc">
								{recruiter.memberDesc.length > 80
									? `${recruiter.memberDesc.substring(0, 80)}...`
									: recruiter.memberDesc}
							</Typography>
						)}
					</Box>

					<Box className="divider"></Box>

					<Box className="agent-stats">
						<Box className="stat">
							<Typography variant="h4">{recruiter?.memberFollowers || 0}</Typography>
							<Typography variant="body2">Followers</Typography>
						</Box>
						<Box className="stat">
							<Typography variant="h4">{recruiter?.memberFollowings || 0}</Typography>
							<Typography variant="body2">Following</Typography>
						</Box>
						<Box className="stat">
							<Typography variant="h4">{recruiter?.memberArticles || 0}</Typography>
							<Typography variant="body2">Articles</Typography>
						</Box>
					</Box>

					<Box className="divider"></Box>

					<Box className="card-actions">
						<Tooltip title="Views">
							<Box className="action-item">
								<RemoveRedEyeIcon fontSize="small" />
								<Typography variant="body2">{recruiter?.memberViews || 0}</Typography>
							</Box>
						</Tooltip>

						<Tooltip title={recruiter?.meLiked && recruiter?.meLiked[0]?.myFavorite ? 'Unlike' : 'Like'}>
							<IconButton
								className={`action-item ${recruiter?.meLiked && recruiter?.meLiked[0]?.myFavorite ? 'liked' : ''}`}
								onClick={() => likeMemberHandler(user, recruiter?._id)}
							>
								{recruiter?.meLiked && recruiter?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon color="error" />
								) : (
									<FavoriteBorderIcon />
								)}
								<Typography variant="body2">{recruiter?.memberLikes || 0}</Typography>
							</IconButton>
						</Tooltip>

						<Tooltip title="Comments">
							<Box className="action-item">
								<ChatBubbleOutlineIcon fontSize="small" />
								<Typography variant="body2">{recruiter?.memberComments || 0}</Typography>
							</Box>
						</Tooltip>
					</Box>
				</Box>
			</Stack>
		);
	}
};

export default RecruiterCard;
