import { Box, Stack } from '@mui/material';
import { useTranslation } from 'next-i18next';

const DescHome = () => {
	const { t, i18n } = useTranslation('common');

	return (
		<Stack className={'desc animate-popup'}>
			<Box className={'title animate-delay-1'}>{t('Discover Great Job Offer With Job Stock')}</Box>
			<Box className={'subtitle animate-delay-2'}>
				{t('Getting a new job is never easy. Check what new jobs we have in store for you on Job Stock')}
			</Box>
		</Stack>
	);
};

export default DescHome;
