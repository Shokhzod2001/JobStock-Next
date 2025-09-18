import React, { useCallback, useEffect, useState } from 'react';
import {
	Stack,
	Typography,
	Checkbox,
	OutlinedInput,
	Tooltip,
	IconButton,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Box,
	Collapse,
	Button,
	ListItemText,
} from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { JobCategory, JobLocation, JobType, SalaryType } from '../../enums/job.enum';
import { JobsInquiry } from '../../types/job/job.input';
import { useRouter } from 'next/router';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useTranslation } from 'next-i18next';

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

interface FilterType {
	searchFilter: JobsInquiry;
	setSearchFilter: any;
	initialInput: JobsInquiry;
}

const Filter = (props: FilterType) => {
	const { searchFilter, setSearchFilter, initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [jobLocations, setJobLocations] = useState<JobLocation[]>(Object.values(JobLocation));
	const [jobTypes, setJobTypes] = useState<JobType[]>(Object.values(JobType));
	const [jobCategories, setJobCategories] = useState<JobCategory[]>(Object.values(JobCategory));
	const [salaryTypes, setSalaryTypes] = useState<SalaryType[]>(Object.values(SalaryType));
	const [searchText, setSearchText] = useState<string>('');
	const [showMore, setShowMore] = useState<boolean>(false);
	const [showMoreCategories, setShowMoreCategories] = useState<boolean>(false);
	const { t, i18n } = useTranslation('common');

	/** LIFECYCLES **/
	useEffect(() => {
		if (searchFilter?.search?.locationList?.length == 0) {
			delete searchFilter.search.locationList;
			setShowMore(false);
			router
				.push(
					`/job?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/job?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.typeList?.length == 0) {
			delete searchFilter.search.typeList;
			router
				.push(
					`/job?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/job?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.categoryList?.length == 0) {
			delete searchFilter.search.categoryList;
			router
				.push(
					`/job?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/job?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.skillsList?.length == 0) {
			delete searchFilter.search.skillsList;
			router
				.push(
					`/job?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/job?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.options?.length == 0) {
			delete searchFilter.search.options;
			router
				.push(
					`/job?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/job?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.salaryTypeList?.length == 0) {
			delete searchFilter.search.salaryTypeList;
			router
				.push(
					`/job?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/job?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.locationList) setShowMore(true);
	}, [searchFilter]);

	/** HANDLERS **/
	const jobLocationSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/job?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, locationList: [...(searchFilter?.search?.locationList || []), value] },
						})}`,
						`/job?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, locationList: [...(searchFilter?.search?.locationList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.locationList?.includes(value)) {
					await router.push(
						`/job?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
							},
						})}`,
						`/job?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}
			} catch (err: any) {
				console.log('ERROR, jobLocationSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const jobTypeSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/job?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						`/job?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.typeList?.includes(value)) {
					await router.push(
						`/job?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						`/job?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}
			} catch (err: any) {
				console.log('ERROR, jobTypeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const jobCategorySelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/job?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, categoryList: [...(searchFilter?.search?.categoryList || []), value] },
						})}`,
						`/job?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, categoryList: [...(searchFilter?.search?.categoryList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.categoryList?.includes(value)) {
					await router.push(
						`/job?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								categoryList: searchFilter?.search?.categoryList?.filter((item: string) => item !== value),
							},
						})}`,
						`/job?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								categoryList: searchFilter?.search?.categoryList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}
			} catch (err: any) {
				console.log('ERROR, jobCategorySelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const salaryTypeSelectHandler = useCallback(
		async (e: any) => {
			try {
				const value = e.target.value;

				if (value && value.length > 0) {
					const updatedFilter = {
						...searchFilter,
						search: { ...searchFilter.search, salaryTypeList: value },
					};

					setSearchFilter(updatedFilter);
					await router.push(
						`/job?input=${JSON.stringify(updatedFilter)}`,
						`/job?input=${JSON.stringify(updatedFilter)}`,
						{ scroll: false },
					);
				} else {
					const updatedFilter = { ...searchFilter };
					if (updatedFilter.search) {
						delete updatedFilter.search.salaryTypeList;
					}

					setSearchFilter(updatedFilter);
					await router.push(
						`/job?input=${JSON.stringify(updatedFilter)}`,
						`/job?input=${JSON.stringify(updatedFilter)}`,
						{ scroll: false },
					);
				}
			} catch (err: any) {
				console.log('ERROR, salaryTypeSelectHandler:', err);
			}
		},
		[searchFilter, setSearchFilter],
	);

	const jobOptionSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/job?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, options: [...(searchFilter?.search?.options || []), value] },
						})}`,
						`/job?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, options: [...(searchFilter?.search?.options || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.options?.includes(value)) {
					await router.push(
						`/job?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								options: searchFilter?.search?.options?.filter((item: string) => item !== value),
							},
						})}`,
						`/job?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								options: searchFilter?.search?.options?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}
			} catch (err: any) {
				console.log('ERROR, jobOptionSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const jobSalaryHandler = useCallback(
		async (value: number, type: string) => {
			if (type == 'start') {
				await router.push(
					`/job?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							salaryRange: { ...searchFilter.search.salaryRange, start: value * 1 },
						},
					})}`,
					`/job?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							salaryRange: { ...searchFilter.search.salaryRange, start: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			} else {
				await router.push(
					`/job?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							salaryRange: { ...searchFilter.search.salaryRange, end: value * 1 },
						},
					})}`,
					`/job?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							salaryRange: { ...searchFilter.search.salaryRange, end: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			}
		},
		[searchFilter],
	);

	const jobExperienceHandler = useCallback(
		async (value: number, type: string) => {
			if (type == 'start') {
				await router.push(
					`/job?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							experienceRange: { ...searchFilter.search.experienceRange, start: value * 1 },
						},
					})}`,
					`/job?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							experienceRange: { ...searchFilter.search.experienceRange, start: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			} else {
				await router.push(
					`/job?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							experienceRange: { ...searchFilter.search.experienceRange, end: value * 1 },
						},
					})}`,
					`/job?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							experienceRange: { ...searchFilter.search.experienceRange, end: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			}
		},
		[searchFilter],
	);

	const refreshHandler = async () => {
		try {
			setSearchText('');
			setShowMoreCategories(false);
			await router.push(`/job?input=${JSON.stringify(initialInput)}`, `/job?input=${JSON.stringify(initialInput)}`, {
				scroll: false,
			});
		} catch (err: any) {
			console.log('ERROR, refreshHandler:', err);
		}
	};

	const toggleShowMore = (section: string) => {
		if (section === 'category') {
			setShowMoreCategories(!showMoreCategories);
		}
	};

	if (device === 'mobile') {
		return <div>JOBS FILTER</div>;
	} else {
		return (
			<Stack className={'filter-main'}>
				<Stack className={'find-your-job'} mb={'40px'}>
					<Typography className={'title-main'}>{t('Find Your Job')}</Typography>
					<Stack className={'input-box'}>
						<OutlinedInput
							value={searchText}
							type={'text'}
							className={'search-input'}
							placeholder={t('What job are you looking for')}
							onChange={(e: any) => setSearchText(e.target.value)}
							onKeyDown={(event: any) => {
								if (event.key == 'Enter') {
									setSearchFilter({
										...searchFilter,
										search: { ...searchFilter.search, text: searchText },
									});
								}
							}}
							endAdornment={
								<>
									<CancelRoundedIcon
										onClick={() => {
											setSearchText('');
											setSearchFilter({
												...searchFilter,
												search: { ...searchFilter.search, text: '' },
											});
										}}
									/>
								</>
							}
						/>
						<img src={'/img/icons/search_icon.png'} alt={''} />
						<Tooltip title="Reset">
							<IconButton onClick={refreshHandler}>
								<RefreshIcon />
							</IconButton>
						</Tooltip>
					</Stack>
				</Stack>

				{/* Location Filter */}
				<Stack className={'find-your-job'} mb={'30px'}>
					<p className={'title'} style={{ textShadow: '0px 3px 4px #b9b9b9' }}>
						{t('Location')}
					</p>
					<Stack
						className={`job-location`}
						style={{ height: showMore ? '420px' : '115px' }}
						onMouseEnter={() => setShowMore(true)}
						onMouseLeave={() => {
							if (!searchFilter?.search?.locationList) {
								setShowMore(false);
							}
						}}
					>
						{jobLocations.map((location: string) => {
							return (
								<Stack className={'input-box'} key={location}>
									<Checkbox
										id={`location-${location}`}
										className="job-checkbox"
										color="default"
										size="small"
										value={location}
										checked={(searchFilter?.search?.locationList || []).includes(location as JobLocation)}
										onChange={jobLocationSelectHandler}
									/>
									<label htmlFor={`location-${location}`} style={{ cursor: 'pointer' }}>
										<Typography className="job-type">{location}</Typography>
									</label>
								</Stack>
							);
						})}
					</Stack>
				</Stack>

				{/* Job Type Filter */}
				<Stack className={'find-your-job'} mb={'30px'}>
					<Typography className={'title'}>{t('Job Type')}</Typography>
					{jobTypes.map((type: string) => (
						<Stack className={'input-box'} key={type}>
							<Checkbox
								id={`type-${type}`}
								className="job-checkbox"
								color="default"
								size="small"
								value={type}
								onChange={jobTypeSelectHandler}
								checked={(searchFilter?.search?.typeList || []).includes(type as JobType)}
							/>
							<label htmlFor={`type-${type}`} style={{ cursor: 'pointer' }}>
								<Typography className="job_type">{type.replace('_', ' ')}</Typography>
							</label>
						</Stack>
					))}
				</Stack>

				{/* Category Filter */}
				<Stack className={'find-your-job'} mb={'30px'}>
					<Box display="flex" justifyContent="space-between" alignItems="center">
						<Typography className={'title'}>{t('Category')}</Typography>
						<Button
							size="small"
							endIcon={showMoreCategories ? <ExpandLessIcon /> : <ExpandMoreIcon />}
							onClick={() => toggleShowMore('category')}
						>
							{showMoreCategories ? 'Show Less' : 'Show More'}
						</Button>
					</Box>
					<Collapse in={showMoreCategories} timeout="auto" unmountOnExit>
						{jobCategories.map((category: string) => (
							<Stack className={'input-box'} key={category} direction="row" alignItems="center">
								<Checkbox
									id={`category-${category}`}
									className="job-checkbox"
									color="default"
									size="small"
									value={category}
									onChange={jobCategorySelectHandler}
									checked={(searchFilter?.search?.categoryList || []).includes(category as JobCategory)}
								/>
								<label htmlFor={`category-${category}`} style={{ cursor: 'pointer' }}>
									<Typography className="job_category">{category.replace('_', ' ')}</Typography>
								</label>
							</Stack>
						))}
					</Collapse>
				</Stack>

				{/* Salary Type Filter */}
				<Stack className={'find-your-job'} mb={'30px'}>
					<Typography className={'title'}>{t('Salary Type')}</Typography>
					<FormControl fullWidth size="small">
						<InputLabel id="salary-type-label">{t('Select Salary Type')}</InputLabel>
						<Select
							labelId="salary-type-label"
							id="salary-type-select"
							multiple
							value={searchFilter?.search?.salaryTypeList || []}
							onChange={salaryTypeSelectHandler}
							input={<OutlinedInput label="Select Salary Type" />}
							renderValue={(selected) => (selected as string[]).join(', ')}
							MenuProps={MenuProps}
						>
							{salaryTypes.map((salaryType) => (
								<MenuItem key={salaryType} value={salaryType}>
									<Checkbox checked={(searchFilter?.search?.salaryTypeList || []).includes(salaryType)} size="small" />
									<ListItemText primary={salaryType} />
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Stack>

				{/* Options Filter */}
				<Stack className={'find-your-job'} mb={'30px'}>
					<Typography className={'title'}>{t('Options')}</Typography>
					<Stack className={'input-box'}>
						<Checkbox
							id={'Remote'}
							className="job-checkbox"
							color="default"
							size="small"
							value={'jobRemote'}
							checked={(searchFilter?.search?.options || []).includes('jobRemote')}
							onChange={jobOptionSelectHandler}
						/>
						<label htmlFor={'Remote'} style={{ cursor: 'pointer' }}>
							<Typography className="job-type">Remote</Typography>
						</label>
					</Stack>
					<Stack className={'input-box'}>
						<Checkbox
							id={'Visa'}
							className="job-checkbox"
							color="default"
							size="small"
							value={'jobVisaSponsor'}
							checked={(searchFilter?.search?.options || []).includes('jobVisaSponsor')}
							onChange={jobOptionSelectHandler}
						/>
						<label htmlFor={'Visa'} style={{ cursor: 'pointer' }}>
							<Typography className="job-type">Visa Sponsor</Typography>
						</label>
					</Stack>
				</Stack>

				{/* Salary Range Filter */}
				<Stack className={'find-your-job'} mb={'30px'}>
					<Typography className={'title'}>{t('Salary Range')}</Typography>
					<Stack direction="row" alignItems="center" spacing={1}>
						<FormControl fullWidth size="small">
							<InputLabel htmlFor="min-salary">Min</InputLabel>
							<OutlinedInput
								id="min-salary"
								type="number"
								placeholder="Min"
								value={searchFilter?.search?.salaryRange?.start ?? ''}
								onChange={(e: any) => {
									if (e.target.value >= 0) {
										jobSalaryHandler(e.target.value, 'start');
									}
								}}
								startAdornment={<Typography sx={{ mr: 1 }}>$</Typography>}
								label="Min"
							/>
						</FormControl>
						<Typography>-</Typography>
						<FormControl fullWidth size="small">
							<InputLabel htmlFor="max-salary">Max</InputLabel>
							<OutlinedInput
								id="max-salary"
								type="number"
								placeholder="Max"
								value={searchFilter?.search?.salaryRange?.end ?? ''}
								onChange={(e: any) => {
									if (e.target.value >= 0) {
										jobSalaryHandler(e.target.value, 'end');
									}
								}}
								startAdornment={<Typography sx={{ mr: 1 }}>$</Typography>}
								label="Max"
							/>
						</FormControl>
					</Stack>
				</Stack>

				{/* Experience Range Filter */}
				<Stack className={'find-your-job'}>
					<Typography className={'title'}>{t('Experience Range')}</Typography>
					<Stack direction="row" alignItems="center" spacing={1}>
						<FormControl fullWidth size="small">
							<InputLabel htmlFor="min-experience">Min</InputLabel>
							<OutlinedInput
								id="min-experience"
								type="number"
								placeholder="Min years"
								value={searchFilter?.search?.experienceRange?.start ?? ''}
								onChange={(e: any) => {
									if (e.target.value >= 0) {
										jobExperienceHandler(e.target.value, 'start');
									}
								}}
								endAdornment={<Typography sx={{ ml: 1 }}>yrs</Typography>}
								label="Min"
							/>
						</FormControl>
						<Typography>-</Typography>
						<FormControl fullWidth size="small">
							<InputLabel htmlFor="max-experience">Max</InputLabel>
							<OutlinedInput
								id="max-experience"
								type="number"
								placeholder="Max years"
								value={searchFilter?.search?.experienceRange?.end ?? ''}
								onChange={(e: any) => {
									if (e.target.value >= 0) {
										jobExperienceHandler(e.target.value, 'end');
									}
								}}
								endAdornment={<Typography sx={{ ml: 1 }}>yrs</Typography>}
								label="Max"
							/>
						</FormControl>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Filter;
