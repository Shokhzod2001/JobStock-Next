import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import Icon from '@mui/material/Icon';
import { useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { JobsInquiry } from '../../types/job/job.input';
import { Job } from '../../types/job/job';
import { GET_JOBS } from '../../../apollo/user/query';
import { JobCategory } from '../../enums/job.enum';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Grid, Navigation } from 'swiper';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';

import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';

interface CategoriesProps {
	initialInput: JobsInquiry;
}

const Categories = (props: CategoriesProps) => {
	const { initialInput } = props;
	const [jobs, setJobs] = useState<Job[]>([]);
	const [categoryCounts, setCategoryCounts] = useState<Record<JobCategory, number>>();

	const { loading, data, error } = useQuery(GET_JOBS, {
		variables: {
			input: { ...initialInput, limit: 1000 },
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

	const getCategoryImage = (category: JobCategory) => {
		const imageMap: Record<JobCategory, string> = {
			[JobCategory.IT]: 'It.png',
			[JobCategory.FINANCE]: 'Finance.png',
			[JobCategory.EDUCATION]: 'Education.png',
			[JobCategory.HEALTHCARE]: 'Healthcare.png',
			[JobCategory.ENGINEERING]: 'Engineering.png',
			[JobCategory.MARKETING]: 'Marketing.png',
			[JobCategory.SALES]: 'Sales.png',
			[JobCategory.CUSTOMER_SERVICE]: 'CustomerService.png',
			[JobCategory.HUMAN_RESOURCES]: 'HR.png',
			[JobCategory.MANUFACTURING]: 'Manufacturing.png',
			[JobCategory.HOSPITALITY]: 'Hospitality.png',
			[JobCategory.CONSTRUCTION]: 'Construction.png',
			[JobCategory.TRANSPORTATION]: 'Transportation.png',
			[JobCategory.OTHER]: 'Other.png',
		};

		return `/img/category/${imageMap[category]}`;
	};

	const formatCategoryName = (category: string) => {
		return category
			.replace(/_/g, ' ')
			.toLowerCase()
			.split(' ')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	};

	if (loading) return <div>Loading categories...</div>;
	if (error) return <div>Error loading categories</div>;
	if (!categoryCounts) return null;

	const CategoryCard = ({ category }: { category: JobCategory }) => {
		const count = categoryCounts[category];
		const categoryName = formatCategoryName(category);
		const imagePath = getCategoryImage(category);

		return (
			<Box className="category-box">
				<Box className="category-desc">
					<Box className="category-icon">
						<img src={imagePath} alt={categoryName} style={{ width: '170px' }} />
					</Box>
					<Box className="category-detail">
						<Typography variant="h6" className="category-title">
							{categoryName}
						</Typography>
						<Typography className="category-count">{count} Active Jobs</Typography>
					</Box>
				</Box>
			</Box>
		);
	};

	return (
		<Box className="categories-section">
			<Box className="categories-container">
				<Box className="info-box">
					<Box className="left">
						<Typography className="section-title">Explore Best Categories</Typography>
						<Typography className="section-subtitle">Browse jobs by category to find your perfect match</Typography>
					</Box>
					<Box className="right">
						<Box className="pagination-box">
							<WestIcon className="swiper-category-prev" />
							<EastIcon className="swiper-category-next" />
						</Box>
					</Box>
				</Box>

				<Swiper
					modules={[Grid, Navigation]}
					navigation={{
						nextEl: '.swiper-category-next',
						prevEl: '.swiper-category-prev',
					}}
					spaceBetween={30}
					slidesPerView={4}
					grid={{ rows: 2, fill: 'row' }}
					breakpoints={{
						1200: { slidesPerView: 4 },
						992: { slidesPerView: 3 },
						768: { slidesPerView: 2 },
						480: { slidesPerView: 1 },
					}}
					className="categories-swiper"
				>
					{Object.values(JobCategory).map((category) => (
						<SwiperSlide key={category}>
							<CategoryCard category={category as JobCategory} />
						</SwiperSlide>
					))}
				</Swiper>
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
