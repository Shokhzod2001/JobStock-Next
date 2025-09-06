import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Button, Pagination, Menu, MenuItem, TextField, InputAdornment, Typography } from '@mui/material';
import { KeyboardArrowDownRounded, Search } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Member } from '../../libs/types/member/member';
import { useMutation, useQuery } from '@apollo/client';
import { LIKE_TARGET_MEMBER } from '../../apollo/user/mutation';
import { T } from '../../libs/types/common';
import { Messages } from '../../libs/config';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { GET_RECRUITERS } from '../../apollo/user/query';
import RecruiterCard from '../../libs/components/common/RecruiterCard';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const RecruiterList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [filterSortName, setFilterSortName] = useState('Recent');
	const [searchFilter, setSearchFilter] = useState<any>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [recruiters, setRecruiters] = useState<Member[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [searchText, setSearchText] = useState<string>('');

	/** APOLLO REQUESTS **/
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);
	const {
		loading: getRecruitersLoading,
		data: getRecruitersData,
		error: getRecruitersError,
		refetch: getRecruitersRefetch,
	} = useQuery(GET_RECRUITERS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setRecruiters(data?.getRecruiters?.list);
			setTotal(data?.getRecruiters?.metaCounter[0]?.total);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const input_obj = JSON.parse(router?.query?.input as string);
			setSearchFilter(input_obj);
		} else {
			router.replace(
				`/recruiter?input=${JSON.stringify(searchFilter)}`,
				`/recruiter?input=${JSON.stringify(searchFilter)}`,
			);
		}

		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, [router]);

	/** HANDLERS **/
	const likeMemberHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			await likeTargetMember({ variables: { input: id } });
			await getRecruitersRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeJobHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
	};

	const sortingCloseHandler = () => {
		setAnchorEl(null);
	};

	const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		let newFilter = { ...searchFilter };

		switch (e.currentTarget.id) {
			case 'recent':
				newFilter = { ...newFilter, sort: 'createdAt', direction: 'DESC' };
				setFilterSortName('Recent');
				break;
			case 'old':
				newFilter = { ...newFilter, sort: 'createdAt', direction: 'ASC' };
				setFilterSortName('Oldest');
				break;
			case 'likes':
				newFilter = { ...newFilter, sort: 'memberLikes', direction: 'DESC' };
				setFilterSortName('Most Liked');
				break;
			case 'views':
				newFilter = { ...newFilter, sort: 'memberViews', direction: 'DESC' };
				setFilterSortName('Most Viewed');
				break;
			case 'rating':
				newFilter = { ...newFilter, sort: 'memberRank', direction: 'DESC' };
				setFilterSortName('Highest Rated');
				break;
		}

		setSearchFilter(newFilter);
		router.push(`/recruiter?input=${JSON.stringify(newFilter)}`, `/recruiter?input=${JSON.stringify(newFilter)}`, {
			scroll: false,
		});
		setAnchorEl(null);
	};

	const paginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		const newFilter = { ...searchFilter, page: value };
		setSearchFilter(newFilter);
		await router.push(
			`/recruiter?input=${JSON.stringify(newFilter)}`,
			`/recruiter?input=${JSON.stringify(newFilter)}`,
			{ scroll: false },
		);
		setCurrentPage(value);
	};

	const handleSearch = () => {
		const newFilter = {
			...searchFilter,
			search: { ...searchFilter.search, text: searchText },
			page: 1,
		};
		setSearchFilter(newFilter);
		router.push(`/recruiter?input=${JSON.stringify(newFilter)}`, `/recruiter?input=${JSON.stringify(newFilter)}`, {
			scroll: false,
		});
	};

	if (device === 'mobile') {
		return <div>Recruiters List for Mobile</div>;
	} else {
		return (
			<Stack className={'recruiter-list-page'}>
				<Stack className={'container'}>
					<Stack className={'page-header'} direction="row" alignItems="center" justifyContent="space-between" mb={4}>
						<Typography variant="h3" component="h1" fontWeight="bold">
							Find Your Perfect Recruiter
						</Typography>
						<Typography variant="body1" color="text.secondary">
							{total} professional recruiter{total !== 1 ? 's' : ''} ready to help you
						</Typography>
					</Stack>

					{/* Search and Filter Section */}
					<Stack className={'filter-section'} direction="row" spacing={2} alignItems="center" mb={4}>
						<TextField
							placeholder="Search recruiters by name, location or specialty"
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
							sx={{
								flexGrow: 1,
								'& .MuiOutlinedInput-root': {
									borderRadius: 3,
									backgroundColor: 'white',
								},
							}}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<Search color="action" />
									</InputAdornment>
								),
							}}
						/>

						<Button
							variant="outlined"
							onClick={handleSearch}
							sx={{
								borderRadius: 3,
								px: 3,
								py: 1,
							}}
						>
							Search
						</Button>

						<Button
							variant="outlined"
							endIcon={<KeyboardArrowDownRounded />}
							onClick={sortingClickHandler}
							sx={{
								borderRadius: 3,
								px: 3,
								py: 1,
								minWidth: '180px',
							}}
						>
							Sort: {filterSortName}
						</Button>

						<Menu
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={sortingCloseHandler}
							PaperProps={{
								sx: {
									mt: 1,
									minWidth: 200,
									borderRadius: 2,
									boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
								},
							}}
						>
							<MenuItem onClick={sortingHandler} id={'recent'}>
								Recent
							</MenuItem>
							<MenuItem onClick={sortingHandler} id={'old'}>
								Oldest
							</MenuItem>
							<MenuItem onClick={sortingHandler} id={'likes'}>
								Most Liked
							</MenuItem>
							<MenuItem onClick={sortingHandler} id={'views'}>
								Most Viewed
							</MenuItem>
							<MenuItem onClick={sortingHandler} id={'rating'}>
								Highest Rated
							</MenuItem>
						</Menu>
					</Stack>

					<Stack className={'card-wrap'}>
						{recruiters?.length === 0 ? (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No Recruiters found!</p>
							</div>
						) : (
							recruiters.map((recruiter: Member) => {
								return (
									<RecruiterCard recruiter={recruiter} key={recruiter._id} likeMemberHandler={likeMemberHandler} />
								);
							})
						)}
					</Stack>

					{/* Pagination */}
					{recruiters.length > 0 && (
						<Stack className={'pagination-section'} direction="column" alignItems="center" spacing={2}>
							<Pagination
								page={currentPage}
								count={Math.ceil(total / searchFilter.limit)}
								onChange={paginationChangeHandler}
								shape="rounded"
								color="primary"
								size="large"
								sx={{
									'& .MuiPaginationItem-root': {
										borderRadius: 2,
										fontWeight: 'bold',
									},
								}}
							/>

							<Typography variant="body2" color="text.secondary">
								Showing {(currentPage - 1) * searchFilter.limit + 1} to{' '}
								{Math.min(currentPage * searchFilter.limit, total)} of {total} recruiters
							</Typography>
						</Stack>
					)}
				</Stack>
			</Stack>
		);
	}
};

RecruiterList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withLayoutBasic(RecruiterList);
