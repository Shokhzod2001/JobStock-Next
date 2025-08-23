import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography, Box, Skeleton } from '@mui/material';
import CommunityCard from './CommunityCard';
import { BoardArticle } from '../../types/board-article/board-article';
import { GET_BOARD_ARTICLES } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { BoardArticleCategory } from '../../enums/board-article.enum';
import { motion } from 'framer-motion';

const CommunityBoards = () => {
	const device = useDeviceDetect();
	const [searchCommunity] = useState({
		page: 1,
		sort: 'articleViews',
		direction: 'DESC',
	});
	const [newsArticles, setNewsArticles] = useState<BoardArticle[]>([]);
	const [recommendedArticles, setRecommendedArticles] = useState<BoardArticle[]>([]);
	const [freeArticles, setFreeArticles] = useState<BoardArticle[]>([]);

	/** APOLLO REQUESTS **/
	const {
		loading: getNewsArticlesLoading,
		data: getNewsArticlesData,
		error: getNewsArticlesError,
		refetch: getNewsArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: { input: { ...searchCommunity, limit: 6, search: { articleCategory: BoardArticleCategory.NEWS } } },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setNewsArticles(data?.getBoardArticles?.list);
		},
	});

	const {
		loading: getRecommendedArticlesLoading,
		data: getRecommendedArticlesData,
		error: getRecommendedArticlesError,
		refetch: getRecommendedArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: { input: { ...searchCommunity, limit: 3, search: { articleCategory: BoardArticleCategory.RECOMMEND } } },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setRecommendedArticles(data?.getBoardArticles?.list);
		},
	});

	const {
		loading: getFreeArticlesLoading,
		data: getFreeArticlesData,
		error: getFreeArticlesError,
		refetch: getFreeArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: { input: { ...searchCommunity, limit: 3, search: { articleCategory: BoardArticleCategory.FREE } } },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setFreeArticles(data?.getBoardArticles?.list);
		},
	});

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				duration: 0.5,
				ease: 'easeOut',
			},
		},
	};

	if (device === 'mobile') {
		return <Stack className="community-board-mobile">Community Mobile</Stack>;
	} else {
		return (
			<Stack className="community-board">
				<Stack className="container">
					<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
						<Typography variant="h1" className="main-title">
							COMMUNITY BOARD HIGHLIGHTS
						</Typography>
						<Typography variant="subtitle1" className="subtitle">
							Discover trending discussions across our community
						</Typography>
					</motion.div>

					<motion.div className="community-main" variants={containerVariants} initial="hidden" animate="visible">
						<motion.div className="community-left" variants={itemVariants}>
							<SectionHeader title="News" category={BoardArticleCategory.NEWS} />
							{getNewsArticlesLoading ? (
								<LoadingSkeleton vertical={true} count={6} />
							) : (
								<Stack className="card-wrap">
									{newsArticles.map((article, index) => (
										<CommunityCard vertical={true} article={article} index={index} key={article?._id} />
									))}
								</Stack>
							)}
						</motion.div>

						<motion.div className="divider" variants={itemVariants}></motion.div>

						<motion.div className="community-middle" variants={itemVariants}>
							<SectionHeader title="Recommend" category={BoardArticleCategory.RECOMMEND} />
							{getRecommendedArticlesLoading ? (
								<LoadingSkeleton vertical={false} count={3} />
							) : (
								<Stack className="card-wrap vertical">
									{recommendedArticles.map((article, index) => (
										<CommunityCard vertical={false} article={article} index={index} key={article?._id} />
									))}
								</Stack>
							)}
						</motion.div>

						<motion.div className="divider" variants={itemVariants}></motion.div>

						<motion.div className="community-right" variants={itemVariants}>
							<SectionHeader title="Free" category={BoardArticleCategory.FREE} />
							{getFreeArticlesLoading ? (
								<LoadingSkeleton vertical={false} count={3} />
							) : (
								<Stack className="card-wrap vertical">
									{freeArticles.map((article, index) => (
										<CommunityCard vertical={false} article={article} index={index} key={article?._id} />
									))}
								</Stack>
							)}
						</motion.div>
					</motion.div>
				</Stack>
			</Stack>
		);
	}
};

// Helper Components
interface SectionHeaderProps {
	title: string;
	category: BoardArticleCategory;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, category }) => (
	<Stack className="content-top">
		<Link href={`/community?articleCategory=${category}`}>
			<motion.div
				className="section-title"
				whileHover={{ x: 5 }}
				transition={{ type: 'spring', stiffness: 400, damping: 10 }}
			>
				<span>{title}</span>
				<motion.img
					src="/img/icons/arrowBig.svg"
					alt=""
					whileHover={{ x: 3 }}
					transition={{ type: 'spring', stiffness: 400, damping: 10 }}
				/>
			</motion.div>
		</Link>
	</Stack>
);

interface LoadingSkeletonProps {
	vertical: boolean;
	count: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ vertical, count }) => {
	return (
		<Stack className={vertical ? 'card-wrap' : 'card-wrap vertical'}>
			{Array.from(new Array(count)).map((_, index) => (
				<Skeleton
					key={index}
					variant={vertical ? 'rectangular' : 'rectangular'}
					width={vertical ? 202 : '100%'}
					height={vertical ? 200 : 111}
					sx={{
						borderRadius: '10px',
						marginBottom: vertical ? '18px' : '34px',
					}}
					animation="wave"
				/>
			))}
		</Stack>
	);
};

export default CommunityBoards;
