import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Job } from '../../types/job/job';
import { JobsInquiry } from '../../types/job/job.input';
import { useMutation, useQuery } from '@apollo/client';
import { GET_JOBS } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { LIKE_TARGET_JOB } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';
import TrendJobCard from './TrendJobsCard';

interface TrendJobsProps {
	initialInput: JobsInquiry;
}

const TrendJobs = (props: TrendJobsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [trendJobs, setTrendJobs] = useState<Job[]>([]);

	/** APOLLO REQUESTS **/
	const [likeTargetJob] = useMutation(LIKE_TARGET_JOB);
	const {
		loading: getJobsLoading,
		data: getJobsData,
		error: getJobsError,
		refetch: getJobsRefetch,
	} = useQuery(GET_JOBS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTrendJobs(data?.getJobs?.list);
		},
	});

	/** HANDLERS **/
	const likeJobHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeTargetJob({ variables: { input: id } });
			await getJobsRefetch({ input: initialInput });
			await sweetTopSmallSuccessAlert('Liked successfully!', 800);
		} catch (err: any) {
			console.log('ERROR, likeJobHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (!trendJobs) return null;

	if (device === 'mobile') {
		return (
			<Stack className="trend-jobs">
				<Stack className="container">
					<Stack className="info-box">
						<Box component="div" className="left">
							<span>Trending Job Opportunities</span>
						</Box>
					</Stack>

					<Stack className="card-box">
						{trendJobs.length === 0 ? (
							<Box component="div" className="empty-list">
								No trending jobs available at the moment
							</Box>
						) : (
							<Swiper
								className="trend-job-swiper"
								slidesPerView={1}
								modules={[Autoplay, Navigation, Pagination]}
								navigation={{
									nextEl: '.swiper-trend-next',
									prevEl: '.swiper-trend-prev',
								}}
								pagination={{
									el: '.swiper-trend-pagination',
									clickable: true,
								}}
							>
								{trendJobs.map((job: Job) => (
									<SwiperSlide key={job._id} className="trend-job-slide">
										<TrendJobCard job={job} likeJobHandler={likeJobHandler} />
									</SwiperSlide>
								))}
							</Swiper>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className="trend-jobs">
				<Stack className="container">
					<Stack className="info-box">
						<Box component="div" className="left">
							<span>Trending Job Opportunities</span>
							<p>Discover the most sought-after positions in your field</p>
						</Box>
						<Box component="div" className="right">
							<div className="pagination-box">
								<WestIcon className="swiper-trend-prev" />
								<div className="swiper-trend-pagination"></div>
								<EastIcon className="swiper-trend-next" />
							</div>
						</Box>
					</Stack>

					<Stack className="card-box">
						{trendJobs.length === 0 ? (
							<Box component="div" className="empty-list">
								No trending jobs available at the moment
							</Box>
						) : (
							<Swiper
								className="trend-job-swiper"
								slidesPerView={4}
								modules={[Autoplay, Navigation, Pagination]}
								navigation={{
									nextEl: '.swiper-trend-next',
									prevEl: '.swiper-trend-prev',
								}}
								pagination={{
									el: '.swiper-trend-pagination',
									clickable: true,
								}}
							>
								{trendJobs.map((job: Job) => (
									<SwiperSlide key={job._id} className="trend-job-slide">
										<TrendJobCard job={job} likeJobHandler={likeJobHandler} />
									</SwiperSlide>
								))}
							</Swiper>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TrendJobs.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'jobLikes',
		direction: 'DESC',
		search: {},
	},
};

export default TrendJobs;
