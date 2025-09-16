import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import { Stack } from '@mui/material';
import Advertisement from '../libs/components/homepage/Advertisement';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Categories from '../libs/components/homepage/Categories';
import ChooseSection from '../libs/components/homepage/ChooseSection';
import TopRecruiters from '../libs/components/homepage/TopRecruiters';
import TrendJobs from '../libs/components/homepage/TrendJobs';
import PopularJobs from '../libs/components/homepage/PopularJobs';
import TopJobs from '../libs/components/homepage/TopJobs';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'home-page'}>
				<Categories />
				<ChooseSection />
				<TrendJobs />
				<PopularJobs />
				<Advertisement />
				<TopJobs />
				<TopRecruiters />
				<CommunityBoards />
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				<Categories />
				<ChooseSection />
				<TrendJobs />
				<PopularJobs />
				<Advertisement />
				<TopJobs />
				<TopRecruiters />
				<CommunityBoards />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
