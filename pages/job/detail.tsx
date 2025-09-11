import React, { ChangeEvent, useEffect, useState } from 'react';
import { Box, Button, Chip, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutFull from '../../libs/components/layout/LayoutFull';
import { NextPage } from 'next';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper';
import PropertyBigCard from '../../libs/components/common/JobBigCard';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { Job } from '../../libs/types/job/job';
import moment from 'moment';
import { formatterStr } from '../../libs/utils';
import { REACT_APP_API_URL } from '../../libs/config';
import { userVar } from '../../apollo/store';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { Pagination as MuiPagination } from '@mui/material';
import Link from 'next/link';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import 'swiper/css';
import 'swiper/css/pagination';
import { GET_COMMENTS, GET_JOBS, GET_JOB } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { Direction, Message } from '../../libs/enums/common.enum';
import { CREATE_COMMENT, LIKE_TARGET_JOB } from '../../apollo/user/mutation';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import Review from '../../libs/components/job/Review';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CategoryIcon from '@mui/icons-material/Category';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import EventIcon from '@mui/icons-material/Event';
import AssignmentIcon from '@mui/icons-material/Assignment';

SwiperCore.use([Autoplay, Navigation, Pagination]);

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const JobDetail: NextPage = ({ initialComment, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [jobId, setJobId] = useState<string | null>(null);
	const [job, setJob] = useState<Job | null>(null);
	const [slideImage, setSlideImage] = useState<string>('');
	const [destinationJobs, setDestinationJobs] = useState<Job[]>([]);
	const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
	const [jobComments, setJobComments] = useState<Comment[]>([]);
	const [commentTotal, setCommentTotal] = useState<number>(0);
	const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
		commentGroup: CommentGroup.JOB,
		commentContent: '',
		commentRefId: '',
	});

	/** APOLLO REQUESTS **/
	const [likeTargetJob] = useMutation(LIKE_TARGET_JOB);
	const [createComment] = useMutation(CREATE_COMMENT);

	const {
		loading: getJobLoading,
		data: getJobData,
		error: getJobError,
		refetch: getJobRefetch,
	} = useQuery(GET_JOB, {
		fetchPolicy: 'network-only',
		variables: { input: jobId },
		skip: !jobId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getJob) setJob(data?.getJob);
			if (data?.getJob) setSlideImage(data?.getJob.jobImages[0]);
		},
	});

	const {
		loading: getJobsLoading,
		data: getJobsData,
		error: getJobsError,
		refetch: getJobsRefetch,
	} = useQuery(GET_JOBS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: 1,
				limit: 4,
				sort: 'createdAt',
				direction: Direction.DESC,
				search: {
					locationList: job?.jobLocation ? [job?.jobLocation] : [],
				},
			},
		},
		skip: !job && !jobId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getJobs?.list) setDestinationJobs(data?.getJobs?.list);
		},
	});

	const {
		loading: getCommentsLoading,
		data: getCommentsData,
		error: getCommentsError,
		refetch: getCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialComment },
		skip: !commentInquiry.search.commentRefId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getComments?.list) setJobComments(data?.getComments?.list);
			setCommentTotal(data?.getComments?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.id) {
			setJobId(router.query.id as string);
			setCommentInquiry({
				...commentInquiry,
				search: {
					commentRefId: router.query.id as string,
				},
			});
			setInsertCommentData({
				...insertCommentData,
				commentRefId: router.query.id as string,
			});
		}
	}, [router]);

	useEffect(() => {
		if (commentInquiry.search.commentRefId) {
			getCommentsRefetch({ input: commentInquiry });
		}
	}, [commentInquiry]);

	/** HANDLERS **/
	const changeImageHandler = (image: string) => {
		setSlideImage(image);
	};

	const likeJobHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			// execute likeTargetJob Mutation
			await likeTargetJob({ variables: { input: id } });

			// execute getJobsRefetch
			await getJobRefetch({ input: id });
			await getJobsRefetch({
				input: {
					page: 1,
					limit: 4,
					sort: 'createdAt',
					direction: Direction.DESC,
					search: {
						locationList: [job?.jobLocation],
					},
				},
			});

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeJobHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const commentPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		commentInquiry.page = value;
		setCommentInquiry({ ...commentInquiry });
	};

	const createCommentHandler = async () => {
		try {
			if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);
			await createComment({ variables: { input: insertCommentData } });

			setInsertCommentData({ ...insertCommentData, commentContent: '' });
			await getCommentsRefetch({ input: commentInquiry });
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	if (getJobLoading) {
		return (
			<Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '1080px' }}>
				<CircularProgress size={'4rem'} />
			</Stack>
		);
	}

	if (device === 'mobile') {
		return <div>JOB DETAIL PAGE</div>;
	} else {
		return (
			<div id={'job-detail-page'}>
				<div className={'container'}>
					<Stack className={'job-detail-config'}>
						<Stack className={'job-info-config'}>
							<Stack className={'info'}>
								<Stack className={'left-box'}>
									<Typography className={'title-main'}>{job?.jobTitle}</Typography>
									<Stack className="top-box">
										{/* Location */}
										<Stack className="option">
											<LocationOnIcon fontSize="small" />
											<Typography className="city">{job?.jobLocation}</Typography>
										</Stack>

										<Stack className="divider"></Stack>

										{/* Job Type */}
										<Stack className="option">
											<WorkOutlineIcon fontSize="small" />
											<Typography className="buy-rent">{job?.jobType}</Typography>
										</Stack>

										<Stack className="divider"></Stack>

										{/* Date Posted */}
										<Stack className="option">
											<AccessTimeIcon fontSize="small" />
											<Typography className="date">{moment().diff(job?.createdAt, 'days')} days ago</Typography>
										</Stack>
									</Stack>
									<Stack className="bottom-box">
										<Stack className="option">
											<WorkIcon fontSize="small" color="action" />
											<Typography>{job?.jobCategory}</Typography>
										</Stack>
										<Stack className="option">
											<SchoolIcon fontSize="small" color="action" />
											<Typography>{job?.jobExperience} years exp</Typography>
										</Stack>
										<Stack className="option">
											<AttachMoneyIcon fontSize="small" color="action" />
											<Typography>{job?.salaryType}</Typography>
										</Stack>
									</Stack>
								</Stack>
								<Stack className={'right-box'}>
									<Stack className="buttons">
										<Stack className="button-box">
											<RemoveRedEyeIcon fontSize="medium" />
											<Typography>{job?.jobViews}</Typography>
										</Stack>
										<Stack className="button-box">
											{job?.meLiked && job?.meLiked[0]?.myFavorite ? (
												<FavoriteIcon color="error" fontSize={'medium'} />
											) : (
												<FavoriteBorderIcon
													fontSize={'medium'}
													// @ts-ignore
													onClick={() => likeJobHandler(user, job?._id)}
												/>
											)}
											<Typography>{job?.jobLikes}</Typography>
										</Stack>
									</Stack>
									<Typography>${formatterStr(job?.jobSalary)}</Typography>
								</Stack>
							</Stack>
							<Stack className={'images'}>
								<Stack className={'main-image'}>
									<img
										src={slideImage ? `${REACT_APP_API_URL}/${slideImage}` : '/img/job/bigImage.png'}
										alt={'main-image'}
									/>
								</Stack>
								<Stack className={'sub-images'}>
									{job?.jobImages.map((subImg: string) => {
										const imagePath: string = `${REACT_APP_API_URL}/${subImg}`;
										return (
											<Stack className={'sub-img-box'} onClick={() => changeImageHandler(subImg)} key={subImg}>
												<img src={imagePath} alt={'sub-image'} />
											</Stack>
										);
									})}
								</Stack>
							</Stack>
						</Stack>
						<Stack className={'job-desc-config'}>
							<Stack className={'left-config'}>
								<Stack className="options-config">
									<Stack className="option">
										<Stack className="svg-box type">
											<WorkIcon />
										</Stack>
										<Stack className="option-includes">
											<Typography className="title">Job Type</Typography>
											<Typography className="option-data">{job?.jobType}</Typography>
										</Stack>
									</Stack>

									<Stack className="option">
										<Stack className="svg-box category">
											<CategoryIcon />
										</Stack>
										<Stack className="option-includes">
											<Typography className="title">Category</Typography>
											<Typography className="option-data">{job?.jobCategory}</Typography>
										</Stack>
									</Stack>

									<Stack className="option">
										<Stack className="svg-box exp">
											<SchoolIcon />
										</Stack>
										<Stack className="option-includes">
											<Typography className="title">Experience</Typography>
											<Typography className="option-data">{job?.jobExperience} years</Typography>
										</Stack>
									</Stack>

									<Stack className="option">
										<Stack className="svg-box salary">
											<AttachMoneyIcon />
										</Stack>
										<Stack className="option-includes">
											<Typography className="title">Salary Type</Typography>
											<Typography className="option-data">{job?.salaryType}</Typography>
										</Stack>
									</Stack>

									<Stack className="option">
										<Stack className="svg-box status">
											<CheckCircleIcon />
										</Stack>
										<Stack className="option-includes">
											<Typography className="title">Status</Typography>
											<Typography className="option-data">{job?.jobStatus}</Typography>
										</Stack>
									</Stack>
								</Stack>
								<Stack className={'prop-desc-config'}>
									<Stack className={'top'}>
										<Typography className={'title'}>Job Description</Typography>
										<Typography className={'desc'}>{job?.jobDesc ?? 'No Description!'}</Typography>
									</Stack>
									<Stack className={'bottom'}>
										<Typography className={'title'}>Job Details</Typography>
										<Stack className={'info-box'}>
											<Stack className={'left'}>
												<Box component={'div'} className={'info'}>
													<Typography className={'title'}>Salary:</Typography>
													<Typography className={'data'} style={{ marginLeft: '88px' }}>
														${formatterStr(job?.jobSalary)}
													</Typography>
												</Box>
												<Box component={'div'} className={'info'}>
													<Typography className={'title'}>Experience:</Typography>
													<Typography className={'data'} style={{ marginLeft: '58px' }}>
														{job?.jobExperience} years
													</Typography>
												</Box>
												<Box component={'div'} className={'info'}>
													<Typography className={'title'}>Job Type:</Typography>
													<Typography className={'data'}>{job?.jobType}</Typography>
												</Box>
												<Box component={'div'} className={'info'}>
													<Typography className={'title'}>Category:</Typography>
													<Typography className={'data'} style={{ marginLeft: '65px' }}>
														{job?.jobCategory}
													</Typography>
												</Box>
											</Stack>
											<Stack className={'right'}>
												<Box component={'div'} className={'info'}>
													<Typography className={'title'}>Posted At:</Typography>
													<Typography className={'data'}>{moment(job?.postedAt).format('YYYY-MM-DD')}</Typography>
												</Box>
												<Box component={'div'} className={'info'}>
													<Typography className={'title'}>Deadline:</Typography>
													<Typography className={'data'}>
														{moment(job?.jobApplicationDeadline).format('YYYY-MM-DD')}
													</Typography>
												</Box>
												<Box component={'div'} className={'info'}>
													<Typography className={'title'}>Location:</Typography>
													<Typography className={'data'} style={{ marginLeft: '75px' }}>
														{job?.jobLocation}
													</Typography>
												</Box>
												<Box component={'div'} className={'info'}>
													<Typography className={'title'}>Remote:</Typography>
													<Typography className={'data'} style={{ marginLeft: '80px' }}>
														{job?.jobRemote ? 'Yes' : 'No'}
													</Typography>
												</Box>
											</Stack>
										</Stack>
									</Stack>
								</Stack>
								<Stack className={'requirements-section'}>
									<Typography variant="h5" className={'section-title'}>
										Job Requirements
									</Typography>
									<Divider className={'section-divider'} />
									<Box className={'requirements-content'}>
										<Box className={'requirements-text'}>
											{job?.jobRequirements ? (
												<Typography
													variant="body1"
													component="div"
													className={'requirements-paragraph'}
													dangerouslySetInnerHTML={{
														__html: job.jobRequirements.replace(/\n/g, '<br />'),
													}}
												/>
											) : (
												<Typography variant="body2" color="textSecondary" className={'no-requirements'}>
													No specific requirements listed.
												</Typography>
											)}
										</Box>
										{job?.jobSkills && job.jobSkills.length > 0 && (
											<Box className={'skills-tags'}>
												<Typography variant="h6" className={'skills-title'}>
													Key Skills
												</Typography>
												<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
													{job.jobSkills.map((skill, index) => (
														<Chip
															key={index}
															label={skill}
															variant="filled"
															color="primary"
															size="small"
															className={'skill-chip'}
														/>
													))}
												</Stack>
											</Box>
										)}
									</Box>
								</Stack>
								<Stack className={'address-config'}>
									<Typography className={'title'}>Job Address</Typography>
									<Stack className={'map-box'}>
										<iframe
											src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25867.098915951767!2d128.68632810247993!3d35.86402299180927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35660bba427bf179%3A0x1fc02da732b9072f!2sGeumhogangbyeon-ro%2C%20Dong-gu%2C%20Daegu!5e0!3m2!1suz!2skr!4v1695537640704!5m2!1suz!2skr"
											width="100%"
											height="100%"
											style={{ border: 0 }}
											allowFullScreen={true}
											loading="lazy"
											referrerPolicy="no-referrer-when-downgrade"
										></iframe>
									</Stack>
								</Stack>
								{commentTotal !== 0 && (
									<Stack className={'reviews-config'}>
										<Stack className={'filter-box'}>
											<Stack className={'review-cnt'}>
												<svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none">
													<g clipPath="url(#clip0_6507_7309)">
														<path
															d="M15.7183 4.60288C15.6171 4.35990 15.3413 4.18787 15.0162 4.16489L10.5822 3.85040L8.82988 0.64527C8.70050 0.409792 8.40612 0.257812 8.07846 0.257812C7.75080 0.257812 7.45630 0.409792 7.32774 0.64527L5.57541 3.85040L1.14072 4.16489C0.815641 4.18832 0.540363 4.36035 0.438643 4.60288C0.337508 4.84586 0.430908 5.11238 0.676772 5.28084L4.02851 7.57692L3.04025 10.9774C2.96794 11.2275 3.09216 11.4860 3.35771 11.6360C3.50045 11.7170 3.66815 11.7575 3.83643 11.7575C3.98105 11.7575 4.12577 11.7274 4.25503 11.667L8.07846 9.88098L11.9012 11.667C12.1816 11.7979 12.5342 11.7859 12.7992 11.6360C13.0648 11.4860 13.1890 11.2275 13.1167 10.9774L12.1284 7.57692L15.4801 5.28084C15.7259 5.11238 15.8194 4.84641 15.7183 4.60288Z"
															fill="#181A20"
														/>
													</g>
													<defs>
														<clipPath id="clip0_6507_7309">
															<rect width="15.36" height="12" fill="white" transform="translate(0.398438)" />
														</clipPath>
													</defs>
												</svg>
												<Typography className={'reviews'}>{commentTotal} reviews</Typography>
											</Stack>
										</Stack>
										<Stack className={'review-list'}>
											{jobComments?.map((comment: Comment) => {
												return <Review comment={comment} key={comment?._id} />;
											})}
											<Box component={'div'} className={'pagination-box'}>
												<MuiPagination
													page={commentInquiry.page}
													count={Math.ceil(commentTotal / commentInquiry.limit)}
													onChange={commentPaginationChangeHandler}
													shape="circular"
													color="primary"
												/>
											</Box>
										</Stack>
									</Stack>
								)}
								<Stack className={'leave-review-config'}>
									<Typography className={'main-title'}>Leave A Review</Typography>
									<Typography className={'review-title'}>Review</Typography>
									<textarea
										onChange={({ target: { value } }: any) => {
											setInsertCommentData({ ...insertCommentData, commentContent: value });
										}}
										value={insertCommentData.commentContent}
									></textarea>
									<Box className={'submit-btn'} component={'div'}>
										<Button
											className={'submit-review'}
											disabled={insertCommentData.commentContent === '' || user?._id === ''}
											onClick={createCommentHandler}
										>
											<Typography className={'title'}>Submit Review</Typography>
											<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
												<g clipPath="url(#clip0_6975_3642)">
													<path
														d="M16.1571 0.5H6.37936C6.13370 0.5 5.93491 0.698792 5.93491 0.944458C5.93491 1.19012 6.13370 1.38892 6.37936 1.38892H15.0842L0.731781 15.7413C0.558156 15.9150 0.558156 16.1962 0.731781 16.3698C0.818573 16.4566 0.932323 16.5 1.04603 16.5C1.15974 16.5 1.27345 16.4566 1.36028 16.3698L15.7127 2.01737V10.7222C15.7127 10.9679 15.9115 11.1667 16.1572 11.1667C16.4028 11.1667 16.6016 10.9679 16.6016 10.7222V0.944458C16.6016 0.698792 16.4028 0.5 16.1571 0.5Z"
														fill="#181A20"
													/>
												</g>
												<defs>
													<clipPath id="clip0_6975_3642">
														<rect width="16" height="16" fill="white" transform="translate(0.601562 0.5)" />
													</clipPath>
												</defs>
											</svg>
										</Button>
									</Box>
								</Stack>
							</Stack>
							<Stack className={'application-sidebar'}>
								{/* Company Info Card */}
								<Box className={'company-card'}>
									<Typography variant="h6" className={'card-title'}>
										Hiring Company
									</Typography>
									<Stack direction="row" spacing={2} alignItems="center" className={'company-info'}>
										<img
											className={'company-logo'}
											src={
												job?.memberData?.memberImage
													? `${REACT_APP_API_URL}/${job?.memberData?.memberImage}`
													: '/img/profile/defaultUser.svg'
											}
											alt={job?.companyName}
										/>
										<Box className={'company-details'}>
											<Link href={`/member?memberId=${job?.memberData?._id}`}>
												<Typography className={'company-name'}>{job?.companyName}</Typography>
											</Link>
											<Link href={`/member?memberId=${job?.memberData?._id}`}>
												<Typography className={'recruiter-name'}>{job?.memberData?.memberNick}</Typography>
											</Link>
											<Stack direction="row" alignItems="center" spacing={1} className={'contact-info'}>
												<PhoneIcon fontSize="small" />
												<Typography className={'phone-number'}>{job?.memberData?.memberPhone}</Typography>
											</Stack>
										</Box>
									</Stack>
									<Link href={`/member?memberId=${job?.memberData?._id}`}>
										<Button variant="outlined" fullWidth className={'view-jobs-btn'} startIcon={<WorkOutlineIcon />}>
											View All Jobs
										</Button>
									</Link>
								</Box>

								{/* Application Form Card */}
								<Box className={'application-card'}>
									<Typography variant="h5" className={'card-main-title'}>
										Apply for this Position
									</Typography>
									<Typography variant="body2" className={'card-subtitle'}>
										Complete the form below to submit your application
									</Typography>

									<Box component="form" className={'application-form'} spacing={3}>
										<Box className={'form-group'}>
											<Typography variant="body2" className={'form-label'}>
												Full Name *
											</Typography>
											<input type={'text'} placeholder={'Your full name'} className={'form-input'} required />
										</Box>

										<Box className={'form-group'}>
											<Typography variant="body2" className={'form-label'}>
												Email Address *
											</Typography>
											<input type={'email'} placeholder={'your.email@example.com'} className={'form-input'} required />
										</Box>

										<Box className={'form-group'}>
											<Typography variant="body2" className={'form-label'}>
												Phone Number *
											</Typography>
											<input type={'tel'} placeholder={'+1 (555) 000-0000'} className={'form-input'} required />
										</Box>

										<Box className={'form-group'}>
											<Typography variant="body2" className={'form-label'}>
												Cover Message
											</Typography>
											<textarea
												placeholder={'Why are you interested in this position? What makes you a good fit?...'}
												className={'form-textarea'}
												rows={4}
											/>
										</Box>

										<Box className={'form-group'}>
											<Typography variant="body2" className={'form-label'}>
												Upload Resume *
											</Typography>
											<Box className={'file-upload'}>
												<CloudUploadIcon className={'upload-icon'} />
												<Typography variant="body2">Drop your resume here or click to browse</Typography>
												<input type="file" className={'file-input'} accept=".pdf,.doc,.docx" />
											</Box>
										</Box>

										<Button
											variant="contained"
											fullWidth
											className={'submit-application-btn'}
											size="large"
											type="submit"
										>
											<SendIcon className={'send-icon'} />
											Submit Application
										</Button>
									</Box>

									<Typography variant="caption" className={'privacy-note'}>
										By applying, you agree to our Privacy Policy. Your data will be processed securely.
									</Typography>
								</Box>

								{/* Quick Stats Card */}
								<Box className={'stats-card'}>
									<Typography variant="h6" className={'card-title'}>
										Job Statistics
									</Typography>
									<Stack spacing={2} className={'stats-grid'}>
										<Box className={'stat-item'}>
											<RemoveRedEyeIcon className={'stat-icon'} />
											<Box className={'stat-content'}>
												<Typography variant="body2" className={'stat-label'}>
													Views
												</Typography>
												<Typography variant="h6" className={'stat-value'}>
													{job?.jobViews}
												</Typography>
											</Box>
										</Box>

										<Box className={'stat-item'}>
											<AssignmentIcon className={'stat-icon'} />
											<Box className={'stat-content'}>
												<Typography variant="body2" className={'stat-label'}>
													Applications
												</Typography>
												<Typography variant="h6" className={'stat-value'}>
													{job?.jobApplications}
												</Typography>
											</Box>
										</Box>

										<Box className={'stat-item'}>
											<FavoriteIcon className={'stat-icon'} />
											<Box className={'stat-content'}>
												<Typography variant="body2" className={'stat-label'}>
													Likes
												</Typography>
												<Typography variant="h6" className={'stat-value'}>
													{job?.jobLikes}
												</Typography>
											</Box>
										</Box>

										<Box className={'stat-item'}>
											<EventIcon className={'stat-icon'} />
											<Box className={'stat-content'}>
												<Typography variant="body2" className={'stat-label'}>
													Posted
												</Typography>
												<Typography variant="body2" className={'stat-value'}>
													{moment(job?.postedAt).format('MMM DD, YYYY')}
												</Typography>
											</Box>
										</Box>
									</Stack>
								</Box>
							</Stack>
						</Stack>
						{destinationJobs.length !== 0 && (
							<Stack className={'similar-properties-config'}>
								<Stack className={'title-pagination-box'}>
									<Stack className={'title-box'}>
										<Typography className={'main-title'}>Similar Jobs</Typography>
										<Typography className={'sub-title'}>Other job opportunities you might be interested in</Typography>
									</Stack>
									<Stack className={'pagination-box'}>
										<WestIcon className={'swiper-similar-prev'} />
										<div className={'swiper-similar-pagination'}></div>
										<EastIcon className={'swiper-similar-next'} />
									</Stack>
								</Stack>
								<Stack className={'cards-box'}>
									<Swiper
										className={'similar-homes-swiper'}
										slidesPerView={'auto'}
										spaceBetween={35}
										modules={[Autoplay, Navigation, Pagination]}
										navigation={{
											nextEl: '.swiper-similar-next',
											prevEl: '.swiper-similar-prev',
										}}
										pagination={{
											el: '.swiper-similar-pagination',
										}}
									>
										{destinationJobs.map((job: Job) => {
											return (
												<SwiperSlide className={'similar-homes-slide'} key={job.jobTitle}>
													<PropertyBigCard job={job} key={job?._id} likeJobHandler={likeJobHandler} />
												</SwiperSlide>
											);
										})}
									</Swiper>
								</Stack>
							</Stack>
						)}
					</Stack>
				</div>
			</div>
		);
	}
};

JobDetail.defaultProps = {
	initialComment: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			commentRefId: '',
		},
	},
};

export default withLayoutFull(JobDetail);
