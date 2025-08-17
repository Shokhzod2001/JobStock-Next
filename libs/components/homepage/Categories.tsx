import React, { useState, useEffect } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import Icon from '@mui/material/Icon';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { JobsInquiry } from '../../types/job/job.input';
import { Job } from '../../types/job/job';
import { GET_JOBS } from '../../../apollo/user/query';
import { jobCategoryConfig } from '../../config';
import { JobCategory } from '../../enums/job.enum';
import { Swiper, SwiperSlide } from 'swiper/react';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import { Navigation } from 'swiper';

interface CategoriesProps {
	initialInput: JobsInquiry;
}

const Categories = (props: CategoriesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [jobs, setJobs] = useState<Job[]>([]);
	const [categoryCounts, setCategoryCounts] = useState<Record<JobCategory, number>>();

	const {
		loading: getJobsLoading,
		data: getJobsData,
		error: getJobsError,
	} = useQuery(GET_JOBS, {
		variables: {
			input: {
				...initialInput,
				limit: 1000, // Get enough jobs for accurate counts
			},
		},
		onCompleted: (data: T) => {
			setJobs(data?.getJobs?.list);
		},
	});

	useEffect(() => {
		if (jobs?.length > 0) {
			const counts = {} as Record<JobCategory, number>;
			Object.values(JobCategory).forEach((category) => {
				counts[category] = jobs.filter((job) => job.jobCategory === category).length;
			});
			setCategoryCounts(counts);
		}
	}, [jobs]);

	if (getJobsLoading) return <div className="categories-loading">Loading categories...</div>;
	if (getJobsError) return <div className="categories-error">Error loading categories</div>;
	if (!categoryCounts) return null;

	const CategoryCard = ({ category }: { category: JobCategory }) => {
		const config = jobCategoryConfig[category];
		const count = categoryCounts[category];
		const categoryName = category.replace(/_/g, ' ');

		return (
			<Box className="category-card">
				<Box className="card-icon">
					<Icon baseClassName="material-icons-round">{config.icon}</Icon>
				</Box>
				<Typography className="category-name">{categoryName}</Typography>
				<Typography className="job-count">
					{count} {count === 1 ? 'job' : 'jobs'}
				</Typography>
			</Box>
		);
	};

	return (
		<Box className="categories-section">
			<Box className="categories-container">
				<Box className="info-box">
					<Box className="left">
						<Typography className="section-title">Explore Job Categories</Typography>
						<Typography className="section-subtitle">Browse jobs by category to find your perfect match</Typography>
					</Box>
					<Box className="right">
						<Box className="pagination-box">
							<WestIcon className="swiper-category-prev" />
							<EastIcon className="swiper-category-next" />
						</Box>
					</Box>
				</Box>

				{device === 'mobile' ? (
					<Swiper
						className="mobile-categories-swiper"
						slidesPerView="auto"
						spaceBetween={20}
						modules={[Navigation]}
						navigation={{
							nextEl: '.swiper-category-next',
							prevEl: '.swiper-category-prev',
						}}
					>
						{Object.values(JobCategory).map((category) => (
							<SwiperSlide key={category} className="swiper-slide">
								<CategoryCard category={category as JobCategory} />
							</SwiperSlide>
						))}
					</Swiper>
				) : (
					<Box className="desktop-categories-grid">
						<Swiper
							className="desktop-categories-swiper"
							slidesPerView={4}
							spaceBetween={30}
							breakpoints={{
								1300: { slidesPerView: 4 },
								1100: { slidesPerView: 3 },
								800: { slidesPerView: 2 },
							}}
							modules={[Navigation]}
							navigation={{
								nextEl: '.swiper-category-next',
								prevEl: '.swiper-category-prev',
							}}
						>
							{Object.values(JobCategory).map((category) => (
								<SwiperSlide key={category}>
									<CategoryCard category={category as JobCategory} />
								</SwiperSlide>
							))}
						</Swiper>
					</Box>
				)}
			</Box>
		</Box>
	);
};

Categories.defaultProps = {
	initialInput: {
		page: 1,
		limit: 20,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default Categories;
