import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Box } from '@mui/material';
import moment from 'moment';
import { useTranslation } from 'next-i18next';

const Footer = () => {
	const device = useDeviceDetect();
	const { t, i18n } = useTranslation('common');

	if (device == 'mobile') {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-box'}>
							<img src="/img/logo/logoWhite.png" alt="" className={'logo'} />
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>{t('Total Free Customer Care')}</span>
							<p>+82 10 4390 2001</p>
						</Box>
					</Stack>
					<Stack className={'right'}>
						<Box component={'div'} className={'email-container'}>
							<div>
								<input type="text" placeholder={'Your Email'} />
								<span className="subscribe-btn">Subscribe</span>
							</div>
						</Box>
						<Box component={'div'} className={'bottom'}>
							<div className="footer-column">
								<strong>{t('Job Search')}</strong>
								<span>Job for Remote</span>
								<span>Job Low to Top</span>
							</div>
							<Box component={'div'} className="link-box">
								<div className="footer-links">
									<strong>{t('Quick Links')}</strong>
									<span>Terms of Use</span>
									<span>Privacy Policy</span>
									<span>Pricing Plans</span>
									<span>Our Services</span>
									<span>Contact Support</span>
									<span>FAQs</span>
								</div>
								<div className="footer-locations">
									<strong>{t('Discover')}</strong>
									<span>Seoul</span>
									<span>Gyeongido</span>
									<span>Busan</span>
									<span>Jejudo</span>
									<span>Chonju</span>
									<span>Gwangju</span>
								</div>
							</Box>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<span className="copyright">© JobStock - All rights reserved. JobStock {moment().year()}</span>
					<div className="footer-legal">
						<span>Privacy · Terms · Sitemap</span>
					</div>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-box'}>
							<img src="/img/logo/logoWhite.png" alt="" className={'logo'} />
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>{t('Total Free Customer Care')}</span>
							<p>+82 10 4390 2001</p>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>{t('New Live')}</span>
							<p>+82 10 5530 1112</p>
							<span>{t('Support')}?</span>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<p>{t('Follow Us On Social Media')}</p>
							<div className={'media-box'}>
								<FacebookOutlinedIcon />
								<TelegramIcon />
								<InstagramIcon />
								<TwitterIcon />
							</div>
						</Box>
					</Stack>
					<Stack className={'right'}>
						<Box component={'div'} className={'top'}>
							<strong>{t('Keep Yourself Up To Date')}</strong>
							<div>
								<input type="text" placeholder={'Your Email'} />
								<span>Subscribe</span>
							</div>
						</Box>
						<Box component={'div'} className={'bottom'}>
							<div>
								<strong>{t('Job Search')}</strong>
								<span>Job for Remote</span>
								<span>Job Low to Top</span>
							</div>
							<div>
								<strong>{t('Quick Links')}</strong>
								<span>Terms of Use</span>
								<span>Privacy Policy</span>
								<span>Pricing Plans</span>
								<span>Our Services</span>
								<span>Contact Support</span>
								<span>FAQs</span>
							</div>
							<div>
								<strong>{t('Discover')}</strong>
								<span>Seoul</span>
								<span>Gyeongido</span>
								<span>Busan</span>
								<span>Jejudo</span>
							</div>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<span>© JobStock - All rights reserved. JobStock {moment().year()}</span>
					<span>Privacy · Terms · Sitemap</span>
				</Stack>
			</Stack>
		);
	}
};

export default Footer;
