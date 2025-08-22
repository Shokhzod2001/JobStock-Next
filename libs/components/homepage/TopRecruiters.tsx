import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Member } from '../../types/member/member';
import { RecruitersInquiry } from '../../types/member/member.input';
import { useMutation, useQuery } from '@apollo/client';
import { GET_RECRUITERS } from '../../../apollo/user/query';
import { T } from '../../types/common';
import TopRecruiterCard from './TopRecruiterCard';
import { LIKE_TARGET_MEMBER } from '../../../apollo/user/mutation';
import { Message } from '../../enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface TopRecruitersProps {
	initialInput: RecruitersInquiry;
}

const TopRecruiters = (props: TopRecruitersProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [topRecruiters, setTopRecruiters] = useState<Member[]>([]);
	const prevRef = useRef(null);
	const nextRef = useRef(null);

	/** APOLLO REQUESTS **/
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);
	const {
		loading: getRecruitersLoading,
		data: getRecruitersData,
		error: getRecruitersError,
		refetch: getRecruitersRefetch,
	} = useQuery(GET_RECRUITERS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTopRecruiters(data?.getRecruiters?.list);
		},
	});

	/** HANDLERS **/
	const likeMemberHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeTargetMember({ variables: { input: id } });
			await getRecruitersRefetch({ input: initialInput });
			await sweetTopSmallSuccessAlert('Liked successfully!', 800);
		} catch (err: any) {
			console.log('ERROR, likeMemberHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (!topRecruiters) return null;

	if (device === 'mobile') {
		return <Box>Top Recruiters mobile</Box>;
	} else {
		return (
			<Stack className={'top-recruiters'}>
				<Stack className={'container'}>
					<Stack className={'info-box'} style={{ padding: '0 40px' }}>
						<Box component={'div'} className={'left'}>
							<span>Top Recruiters</span>
							<p>Our Top Recruiters always ready to serve you</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'more-box'}>
								<a href="/recruiter">
									<span>See All Recruiters</span>
								</a>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Box>
					</Stack>

					<Stack className={'wrapper'}>
						<Box component={'div'} className={'switch-btn swiper-agents-prev'} ref={prevRef}>
							<ArrowBackIosNewIcon />
						</Box>

						<Box component={'div'} className={'card-wrapper'}>
							<Swiper
								className={'top-agents-swiper'}
								slidesPerView={'auto'}
								spaceBetween={25}
								modules={[Autoplay, Navigation, Pagination]}
								navigation={{
									prevEl: prevRef.current,
									nextEl: nextRef.current,
								}}
								onInit={(swiper) => {
									// Override prevEl & nextEl after init
									if (typeof swiper.params.navigation !== 'boolean') {
										if (swiper.params.navigation) {
											swiper.params.navigation.prevEl = prevRef.current;
											swiper.params.navigation.nextEl = nextRef.current;
										}
									}
									swiper.navigation.init();
									swiper.navigation.update();
								}}
							>
								{topRecruiters.map((recruiter: Member) => {
									return (
										<SwiperSlide className={'top-agents-slide'} key={recruiter?._id}>
											<TopRecruiterCard
												recruiter={recruiter}
												key={recruiter?.memberNick}
												likeMemberHandler={likeMemberHandler}
											/>
										</SwiperSlide>
									);
								})}
							</Swiper>
						</Box>

						<Box component={'div'} className={'switch-btn swiper-agents-next'} ref={nextRef}>
							<ArrowBackIosNewIcon />
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TopRecruiters.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'memberRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopRecruiters;
