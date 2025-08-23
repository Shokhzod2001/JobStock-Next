import React from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Box } from '@mui/material';
import Moment from 'react-moment';
import { BoardArticle } from '../../types/board-article/board-article';
import { motion } from 'framer-motion';

interface CommunityCardProps {
	vertical: boolean;
	article: BoardArticle;
	index: number;
}

const CommunityCard = (props: CommunityCardProps) => {
	const { vertical, article, index } = props;
	const device = useDeviceDetect();
	const articleImage = article?.articleImage
		? `${process.env.REACT_APP_API_URL}/${article?.articleImage}`
		: '/img/event.svg';

	// Animation variants
	const cardVariants = {
		hidden: { opacity: 0, scale: 0.9 },
		visible: {
			opacity: 1,
			scale: 1,
			transition: {
				duration: 0.4,
				ease: 'easeOut',
			},
		},
		hover: {
			y: -5,
			scale: 1.02,
			transition: {
				duration: 0.3,
				ease: 'easeOut',
			},
		},
	};

	if (device === 'mobile') {
		return <Box>CommunityCard Mobile</Box>;
	} else {
		if (vertical) {
			return (
				<Link href={`/community/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`}>
					<motion.div
						className="vertical-card"
						variants={cardVariants}
						initial="hidden"
						animate="visible"
						whileHover="hover"
					>
						<div className="community-img" style={{ backgroundImage: `url(${articleImage})` }}>
							<div className="card-index">{index + 1}</div>
							<div className="card-overlay">
								<span>Read More</span>
							</div>
						</div>
						<strong>{article?.articleTitle}</strong>
						<div className="card-footer">
							<span className="category">{article?.articleCategory}</span>
							<span className="views">👁️ {article?.articleViews}</span>
						</div>
					</motion.div>
				</Link>
			);
		} else {
			return (
				<Link href={`/community/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`}>
					<motion.div
						className="horizontal-card"
						variants={cardVariants}
						initial="hidden"
						animate="visible"
						whileHover="hover"
					>
						<div className="horizontal-card-image">
							<img src={articleImage} alt={article?.articleTitle} />
						</div>
						<div className="horizontal-card-content">
							<strong>{article.articleTitle}</strong>
							<div className="horizontal-card-meta">
								<span className="category">{article?.articleCategory}</span>
								<span className="date">
									<Moment format="DD.MM.YY">{article?.createdAt}</Moment>
								</span>
							</div>
							<div className="horizontal-card-stats">
								<span>👁️ {article?.articleViews}</span>
								<span>❤️ {article?.articleLikes}</span>
							</div>
						</div>
					</motion.div>
				</Link>
			);
		}
	}
};

export default CommunityCard;
