import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Job } from '../../types/job/job';
import Link from 'next/link';
import { JobsInquiry } from '../../types/job/job.input';
import { GET_JOBS } from '../../../apollo/user/query';
import { useMutation, useQuery } from '@apollo/client';
import { T } from '../../types/common';
import PopularJobCard from './PopularJobsCard';
import { LIKE_TARGET_JOB } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';
import { useTranslation } from 'next-i18next';

interface PopularJobsProps {
	initialInput: JobsInquiry;
}

const PopularJobs = (props: PopularJobsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [popularJobs, setPopularJobs] = useState<Job[]>([]);
	const { t, i18n } = useTranslation('common');

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
			setPopularJobs(data?.getJobs?.list);
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

	if (!popularJobs) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'popular-jobs'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<div className="left">
							<h2>{t('Popular jobs')}</h2>
						</div>
						<Box component={'div'} className={'right'}>
							<div className={'more-box'}>
								<Link href={'/job'}>
									<span style={{ paddingRight: '10px' }}>See All Categories</span>
								</Link>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-property-swiper'}
							slidesPerView={1}
							spaceBetween={25}
							modules={[Autoplay, Navigation, Pagination]}
							navigation={{
								nextEl: '.swiper-popular-next',
								prevEl: '.swiper-popular-prev',
							}}
							pagination={{
								el: '.swiper-popular-pagination',
							}}
						>
							{popularJobs.map((job: Job) => {
								return (
									<SwiperSlide key={job._id} className={'popular-property-slide'}>
										<PopularJobCard job={job} likeJobHandler={likeJobHandler} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'popular-jobs'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Popular jobs</span>
							<p>Discover the most viewed opportunities in your field</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'more-box'}>
								<Link href={'/job'}>
									<span>See All Categories</span>
								</Link>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-property-swiper'}
							slidesPerView={'auto'}
							spaceBetween={25}
							modules={[Autoplay, Navigation, Pagination]}
							navigation={{
								nextEl: '.swiper-popular-next',
								prevEl: '.swiper-popular-prev',
							}}
							pagination={{
								el: '.swiper-popular-pagination',
							}}
						>
							{popularJobs.map((job: Job) => {
								return (
									<SwiperSlide key={job._id} className={'popular-property-slide'}>
										<PopularJobCard job={job} likeJobHandler={likeJobHandler} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
					<Stack className={'pagination-box'}>
						<WestIcon className={'swiper-popular-prev'} />
						<div className={'swiper-popular-pagination'} style={{ width: 'auto' }}></div>
						<EastIcon className={'swiper-popular-next'} />
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

PopularJobs.defaultProps = {
	initialInput: {
		page: 1,
		limit: 7,
		sort: 'jobViews',
		direction: 'DESC',
		search: {},
	},
};

export default PopularJobs;
