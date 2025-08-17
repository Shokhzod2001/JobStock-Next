import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Stack, Box, Modal, Divider, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { jobExperienceLevels, jobSalaryRanges } from '../../config';
import { JobLocation, JobType, JobCategory } from '../../enums/job.enum';
import { JobsInquiry } from '../../types/job/job.input';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 'auto',
	bgcolor: 'background.paper',
	borderRadius: '12px',
	outline: 'none',
	boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
};

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
			borderRadius: '8px',
			boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
		},
	},
};

interface HeaderFilterProps {
	initialInput: JobsInquiry;
}

const HeaderFilter = (props: HeaderFilterProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const { t, i18n } = useTranslation('common');
	const [searchFilter, setSearchFilter] = useState<JobsInquiry>(initialInput);
	const locationRef: any = useRef();
	const typeRef: any = useRef();
	const categoryRef: any = useRef();
	const router = useRouter();
	const [openAdvancedFilter, setOpenAdvancedFilter] = useState(false);
	const [openLocation, setOpenLocation] = useState(false);
	const [openType, setOpenType] = useState(false);
	const [openCategory, setOpenCategory] = useState(false);
	const [jobLocation, setJobLocation] = useState<JobLocation[]>(Object.values(JobLocation));
	const [jobType, setJobType] = useState<JobType[]>(Object.values(JobType));
	const [jobCategory, setJobCategory] = useState<JobCategory[]>(Object.values(JobCategory));
	const [salaryCheck, setSalaryCheck] = useState({ start: 0, end: 300000 });
	const [optionCheck, setOptionCheck] = useState('all');

	/** LIFECYCLES **/
	useEffect(() => {
		const clickHandler = (event: MouseEvent) => {
			if (!locationRef?.current?.contains(event.target)) {
				setOpenLocation(false);
			}

			if (!typeRef?.current?.contains(event.target)) {
				setOpenType(false);
			}

			if (!categoryRef?.current?.contains(event.target)) {
				setOpenCategory(false);
			}
		};

		document.addEventListener('mousedown', clickHandler);

		return () => {
			document.removeEventListener('mousedown', clickHandler);
		};
	}, []);

	/** HANDLERS **/
	const advancedFilterHandler = (status: boolean) => {
		setOpenLocation(false);
		setOpenCategory(false);
		setOpenType(false);
		setOpenAdvancedFilter(status);
	};

	const locationStateChangeHandler = () => {
		setOpenLocation((prev) => !prev);
		setOpenCategory(false);
		setOpenType(false);
	};

	const typeStateChangeHandler = () => {
		setOpenType((prev) => !prev);
		setOpenLocation(false);
		setOpenCategory(false);
	};

	const categoryStateChangeHandler = () => {
		setOpenCategory((prev) => !prev);
		setOpenType(false);
		setOpenLocation(false);
	};

	const disableAllStateHandler = () => {
		setOpenCategory(false);
		setOpenType(false);
		setOpenLocation(false);
	};

	const jobLocationSelectHandler = useCallback(
		async (value: any) => {
			try {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						locationList: [value],
					},
				});
				typeStateChangeHandler();
			} catch (err: any) {
				console.log('ERROR, jobLocationSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const jobTypeSelectHandler = useCallback(
		async (value: any) => {
			try {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						typeList: [value],
					},
				});
				categoryStateChangeHandler();
			} catch (err: any) {
				console.log('ERROR, jobTypeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const jobCategorySelectHandler = useCallback(
		async (value: any) => {
			try {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						categoryList: [value],
					},
				});
				disableAllStateHandler();
			} catch (err: any) {
				console.log('ERROR, jobCategorySelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const jobOptionSelectHandler = useCallback(
		async (e: any) => {
			try {
				const value = e.target.value;
				setOptionCheck(value);

				if (value !== 'all') {
					setSearchFilter({
						...searchFilter,
						search: {
							...searchFilter.search,
							options: [value],
						},
					});
				} else {
					delete searchFilter.search.options;
					setSearchFilter({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					});
				}
			} catch (err: any) {
				console.log('ERROR, jobOptionSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const salaryStartChangeHandler = async (event: any) => {
		setSalaryCheck({ ...salaryCheck, start: Number(event.target.value) });

		setSearchFilter({
			...searchFilter,
			search: {
				...searchFilter.search,
				salaryRange: { start: Number(event.target.value), end: salaryCheck.end },
			},
		});
	};

	const salaryEndChangeHandler = async (event: any) => {
		setSalaryCheck({ ...salaryCheck, end: Number(event.target.value) });

		setSearchFilter({
			...searchFilter,
			search: {
				...searchFilter.search,
				salaryRange: { start: salaryCheck.start, end: Number(event.target.value) },
			},
		});
	};

	const experienceChangeHandler = async (event: any) => {
		setSearchFilter({
			...searchFilter,
			search: {
				...searchFilter.search,
				experienceRange: { start: 0, end: Number(event.target.value) },
			},
		});
	};

	const resetFilterHandler = () => {
		setSearchFilter(initialInput);
		setOptionCheck('all');
		setSalaryCheck({ start: 0, end: 300000 });
	};

	const pushSearchHandler = async () => {
		try {
			if (searchFilter?.search?.locationList?.length == 0) {
				delete searchFilter.search.locationList;
			}

			if (searchFilter?.search?.typeList?.length == 0) {
				delete searchFilter.search.typeList;
			}

			if (searchFilter?.search?.categoryList?.length == 0) {
				delete searchFilter.search.categoryList;
			}

			if (searchFilter?.search?.options?.length == 0) {
				delete searchFilter.search.options;
			}

			await router.push(
				`/job?input=${JSON.stringify(searchFilter)}`, //
				`/job?input=${JSON.stringify(searchFilter)}`,
			);
		} catch (err: any) {
			console.log('ERROR, pushSearchHandler:', err);
		}
	};

	if (device === 'mobile') {
		return <div>HEADER FILTER MOBILE</div>;
	} else {
		return (
			<>
				<Stack className={'search-box'}>
					<Stack className={'select-box'}>
						<Box component={'div'} className={`box ${openLocation ? 'on' : ''}`} onClick={locationStateChangeHandler}>
							<span>{searchFilter?.search?.locationList ? searchFilter?.search?.locationList[0] : t('Location')} </span>
							<ExpandMoreIcon className={`icon ${openLocation ? 'rotate' : ''}`} />
						</Box>
						<Box className={`box ${openType ? 'on' : ''}`} onClick={typeStateChangeHandler}>
							<span> {searchFilter?.search?.typeList ? searchFilter?.search?.typeList[0] : t('Job type')} </span>
							<ExpandMoreIcon className={`icon ${openType ? 'rotate' : ''}`} />
						</Box>
						<Box className={`box ${openCategory ? 'on' : ''}`} onClick={categoryStateChangeHandler}>
							<span>{searchFilter?.search?.categoryList ? searchFilter?.search?.categoryList[0] : t('Category')}</span>
							<ExpandMoreIcon className={`icon ${openCategory ? 'rotate' : ''}`} />
						</Box>
					</Stack>
					<Stack className={'search-box-other'}>
						<Box className={'advanced-filter'} onClick={() => advancedFilterHandler(true)}>
							<img src="/img/icons/filter.svg" alt="" className="filter-icon" />
							<span>{t('Advanced')}</span>
						</Box>
						<Box className={'search-btn'} onClick={pushSearchHandler}>
							<img src="/img/icons/search_white.svg" alt="" className="search-icon" />
							<span className="search-text">{t('Search')}</span>
						</Box>
					</Stack>

					{/* MENU DROPDOWNS */}
					<div className={`filter-location ${openLocation ? 'on' : ''}`} ref={locationRef}>
						{jobLocation.map((location: string) => {
							return (
								<div onClick={() => jobLocationSelectHandler(location)} key={location} className="location-item">
									<img src={`img/banner/cities/${location.toLowerCase()}.webp`} alt="" className="location-image" />
									<span className="location-name">{location}</span>
								</div>
							);
						})}
					</div>

					<div className={`filter-type ${openType ? 'on' : ''}`} ref={typeRef}>
						{jobType.map((type: string) => {
							return (
								<div onClick={() => jobTypeSelectHandler(type)} key={type} className="type-item">
									<span>{type.replace('_', ' ')}</span>
								</div>
							);
						})}
					</div>

					<div className={`filter-category ${openCategory ? 'on' : ''}`} ref={categoryRef}>
						{jobCategory.map((category: string) => {
							return (
								<span onClick={() => jobCategorySelectHandler(category)} key={category} className="category-item">
									{category.replace('_', ' ')}
								</span>
							);
						})}
					</div>
				</Stack>

				{/* ADVANCED FILTER MODAL */}
				<Modal
					open={openAdvancedFilter}
					onClose={() => advancedFilterHandler(false)}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					{/* @ts-ignore */}
					<Box sx={style}>
						<Box className={'advanced-filter-modal'}>
							<div className={'close'} onClick={() => advancedFilterHandler(false)}>
								<CloseIcon />
							</div>
							<div className={'top'}>
								<span>Find your job</span>
								<div className={'search-input-box'}>
									<img src="/img/icons/search.svg" alt="" />
									<input
										value={searchFilter?.search?.text ?? ''}
										type="text"
										placeholder={'What job are you looking for?'}
										onChange={(e: any) => {
											setSearchFilter({
												...searchFilter,
												search: { ...searchFilter.search, text: e.target.value },
											});
										}}
									/>
								</div>
							</div>
							<Divider sx={{ mt: '30px', mb: '35px' }} />
							<div className={'middle'}>
								<div className={'row-box'}>
									<div className={'box'}>
										<span>Job Type</span>
										<div className={'inside'}>
											<FormControl>
												<Select
													value={searchFilter?.search?.typeList?.[0] || 'all'}
													onChange={(e) => jobTypeSelectHandler(e.target.value)}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
												>
													<MenuItem value="all">All Job Types</MenuItem>
													{jobType.map((type: string) => (
														<MenuItem value={type} key={type}>
															{type.replace('_', ' ')}
														</MenuItem>
													))}
												</Select>
											</FormControl>
										</div>
									</div>
									<div className={'box'}>
										<span>options</span>
										<div className={'inside'}>
											<FormControl>
												<Select
													value={optionCheck}
													onChange={jobOptionSelectHandler}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
												>
													<MenuItem value={'all'}>All Options</MenuItem>
													<MenuItem value={'jobRemote'}>Remote</MenuItem>
													<MenuItem value={'jobVisaSponsor'}>VisaSponsor</MenuItem>
												</Select>
											</FormControl>
										</div>
									</div>
								</div>
								<div className={'row-box'} style={{ marginTop: '44px' }}>
									<div className={'box'}>
										<span>Salary Range</span>
										<div className={'inside space-between align-center'}>
											<FormControl sx={{ width: '122px' }}>
												<Select
													value={salaryCheck.start.toString()}
													onChange={salaryStartChangeHandler}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
													MenuProps={MenuProps}
												>
													{jobSalaryRanges?.map((salary: number) => (
														<MenuItem value={salary} disabled={salaryCheck.end <= salary} key={salary}>
															${salary.toLocaleString()}
														</MenuItem>
													))}
												</Select>
											</FormControl>
											<div className={'minus-line'}></div>
											<FormControl sx={{ width: '122px' }}>
												<Select
													value={salaryCheck.end.toString()}
													onChange={salaryEndChangeHandler}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
													MenuProps={MenuProps}
												>
													{jobSalaryRanges
														?.slice(0)
														.reverse()
														.map((salary: number) => (
															<MenuItem value={salary} disabled={salaryCheck.start >= salary} key={salary}>
																${salary.toLocaleString()}
															</MenuItem>
														))}
												</Select>
											</FormControl>
										</div>
									</div>
									<div className={'box'}>
										<span>Experience Level</span>
										<div className={'inside'}>
											<FormControl sx={{ width: '100%' }}>
												<Select
													value={searchFilter?.search?.experienceRange?.end || 0}
													onChange={experienceChangeHandler}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
													MenuProps={MenuProps}
												>
													{jobExperienceLevels.map((exp: number) => (
														<MenuItem value={exp} key={exp}>
															{exp === 0 ? 'Any experience' : `${exp}+ years`}
														</MenuItem>
													))}
												</Select>
											</FormControl>
										</div>
									</div>
								</div>
							</div>
							<Divider sx={{ mt: '60px', mb: '18px' }} />
							<div className={'bottom'}>
								<div onClick={resetFilterHandler}>
									<img src="/img/icons/reset.svg" alt="" />
									<span>Reset all filters</span>
								</div>
								<Button
									startIcon={<img src={'/img/icons/search.svg'} />}
									className={'search-btn'}
									onClick={pushSearchHandler}
								>
									Search
								</Button>
							</div>
						</Box>
					</Box>
				</Modal>
			</>
		);
	}
};

HeaderFilter.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		search: {
			salaryRange: {
				start: 0,
				end: 300000,
			},
			experienceRange: {
				start: 0,
				end: 10,
			},
		},
	},
};

export default HeaderFilter;
