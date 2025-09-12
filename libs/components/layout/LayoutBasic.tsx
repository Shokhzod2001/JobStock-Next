import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useTranslation } from 'next-i18next';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import ScrollToTop from '../common/ScrollToTop';

const withLayoutBasic = (Component: any) => {
	return (props: any) => {
		const router = useRouter();
		const { t, i18n } = useTranslation('common');
		const device = useDeviceDetect();
		const [authHeader, setAuthHeader] = useState<boolean>(false);
		const user = useReactiveVar(userVar);

		const memoizedValues = useMemo(() => {
			let title = '',
				desc = '',
				bgImage = '';

			switch (router.pathname) {
				case '/job':
					title = 'Find Jobs';
					desc = 'Browse thousands of job opportunities';
					bgImage = '/img/banner/job-search.webp';
					break;
				case '/recruiter':
					title = 'Recruiters';
					desc = 'Connect with top hiring managers';
					bgImage = '/img/banner/recruiters.jpg';
					break;
				case '/recruiter/detail':
					title = 'Recruiter Profile';
					desc = 'View recruiter details and contact information';
					bgImage = '/img/banner/recruiters.jpg';
					break;
				case '/mypage':
					title = 'My Profile';
					desc = 'Manage your resume and job applications';
					bgImage = '/img/banner/profile.jpg';
					break;
				case '/community':
					title = 'Community';
					desc = 'Tips and resources for job seekers';
					bgImage = '/img/banner/community.jpg';
					break;
				case '/community/detail':
					title = 'Community Detail';
					desc = 'Expert advice for your job search';
					bgImage = '/img/banner/community.jpg';
					break;
				case '/cs':
					title = 'Support Center';
					desc = 'Get help with your job search';
					bgImage = '/img/banner/support.jpg';
					break;
				case '/account/join':
					title = 'Login/Signup';
					desc = 'Join thousands of job seekers';
					bgImage = '/img/banner/auth1.jpg';
					setAuthHeader(true);
					break;
				case '/member':
					title = 'Member Page';
					desc = 'Track job applications and profile';
					bgImage = '/img/banner/dashboard.jpg';
					break;
				default:
					break;
			}

			return { title, desc, bgImage };
		}, [router.pathname]);

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		/** HANDLERS **/

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>JobStock</title>
						<meta name={'title'} content={`Nestar`} />
					</Head>
					<Stack id="mobile-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		} else {
			return (
				<>
					<Head>
						<title>JobStock</title>
						<meta name={'title'} content={`Nestar`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack
							className={`header-basic ${authHeader && 'auth'}`}
							style={{
								backgroundImage: `url(${memoizedValues.bgImage})`,
								backgroundSize: '100% auto',
								backgroundPosition: 'center ',
								backgroundRepeat: 'no-repeat',
								boxShadow: 'inset 10px 40px 150px 40px rgb(24 22 36)',
							}}
						>
							<Stack className={'container'}>
								<strong>{t(memoizedValues.title)}</strong>
								<span>{t(memoizedValues.desc)}</span>
							</Stack>
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						{router.pathname === '/404' ? '' : <Chat />}
						<ScrollToTop />

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutBasic;
