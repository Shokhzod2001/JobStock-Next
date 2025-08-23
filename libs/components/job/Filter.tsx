import React, { useCallback, useEffect, useState } from 'react';
import {
	Stack,
	Typography,
	Checkbox,
	Button,
	OutlinedInput,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Tooltip,
	IconButton,
} from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { JobCategory, JobLocation, JobType } from '../../enums/job.enum';
import { JobsInquiry } from '../../types/job/job.input';
import { useRouter } from 'next/router';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { availableOptions } from '../../config';
import RefreshIcon from '@mui/icons-material/Refresh';

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
	const [searchText, setSearchText] = useState<string>('');
	const [showMore, setShowMore] = useState<boolean>(false);

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

				console.log('jobLocationSelectHandler:', e.target.value);
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

				console.log('jobTypeSelectHandler:', e.target.value);
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

				console.log('jobCategorySelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, jobCategorySelectHandler:', err);
			}
		},
		[searchFilter],
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

				console.log('jobOptionSelectHandler:', e.target.value);
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
			await router.push(`/job?input=${JSON.stringify(initialInput)}`, `/job?input=${JSON.stringify(initialInput)}`, {
				scroll: false,
			});
		} catch (err: any) {
			console.log('ERROR, refreshHandler:', err);
		}
	};

	if (device === 'mobile') {
		return <div>JOBS FILTER</div>;
	} else {
		return (
			<Stack className={'filter-main'}>
				<Stack className={'find-your-job'} mb={'40px'}>
					<Typography className={'title-main'}>Find Your Job</Typography>
					<Stack className={'input-box'}>
						<OutlinedInput
							value={searchText}
							type={'text'}
							className={'search-input'}
							placeholder={'What job are you looking for?'}
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
				<Stack className={'find-your-job'} mb={'30px'}>
					<p className={'title'} style={{ textShadow: '0px 3px 4px #b9b9b9' }}>
						Location
					</p>
					<Stack
						className={`job-location`}
						style={{ height: showMore ? '340px' : '115px' }}
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
										id={location}
										className="job-checkbox"
										color="default"
										size="small"
										value={location}
										checked={(searchFilter?.search?.locationList || []).includes(location as JobLocation)}
										onChange={jobLocationSelectHandler}
									/>
									<label htmlFor={location} style={{ cursor: 'pointer' }}>
										<Typography className="job-type">{location}</Typography>
									</label>
								</Stack>
							);
						})}
					</Stack>
				</Stack>
				<Stack className={'find-your-job'} mb={'30px'}>
					<Typography className={'title'}>Job Type</Typography>
					{jobTypes.map((type: string) => (
						<Stack className={'input-box'} key={type}>
							<Checkbox
								id={type}
								className="job-checkbox"
								color="default"
								size="small"
								value={type}
								onChange={jobTypeSelectHandler}
								checked={(searchFilter?.search?.typeList || []).includes(type as JobType)}
							/>
							<label style={{ cursor: 'pointer' }}>
								<Typography className="job_type">{type}</Typography>
							</label>
						</Stack>
					))}
				</Stack>
				<Stack className={'find-your-job'} mb={'30px'}>
					<Typography className={'title'}>Category</Typography>
					{jobCategories.map((category: string) => (
						<Stack className={'input-box'} key={category}>
							<Checkbox
								id={category}
								className="job-checkbox"
								color="default"
								size="small"
								value={category}
								onChange={jobCategorySelectHandler}
								checked={(searchFilter?.search?.categoryList || []).includes(category as JobCategory)}
							/>
							<label style={{ cursor: 'pointer' }}>
								<Typography className="job_category">{category}</Typography>
							</label>
						</Stack>
					))}
				</Stack>
				<Stack className={'find-your-job'} mb={'30px'}>
					<Typography className={'title'}>Options</Typography>
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
				<Stack className={'find-your-job'} mb={'30px'}>
					<Typography className={'title'}>Salary Range</Typography>
					<Stack className="salary-input">
						<input
							type="number"
							placeholder="$ min"
							min={0}
							value={searchFilter?.search?.salaryRange?.start ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									jobSalaryHandler(e.target.value, 'start');
								}
							}}
						/>
						<div className="central-divider"></div>
						<input
							type="number"
							placeholder="$ max"
							value={searchFilter?.search?.salaryRange?.end ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									jobSalaryHandler(e.target.value, 'end');
								}
							}}
						/>
					</Stack>
				</Stack>
				<Stack className={'find-your-job'}>
					<Typography className={'title'}>Experience Range</Typography>
					<Stack className="experience-input">
						<input
							type="number"
							placeholder="min years"
							min={0}
							value={searchFilter?.search?.experienceRange?.start ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									jobExperienceHandler(e.target.value, 'start');
								}
							}}
						/>
						<div className="central-divider"></div>
						<input
							type="number"
							placeholder="max years"
							value={searchFilter?.search?.experienceRange?.end ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									jobExperienceHandler(e.target.value, 'end');
								}
							}}
						/>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Filter;
