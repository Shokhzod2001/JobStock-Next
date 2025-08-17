import { Box, Stack } from '@mui/material';

const DescHome = () => {
	return (
		<Stack className={'desc animate-popup'}>
			<Box className={'title animate-delay-1'}>
				Discover Great Job Offer <br /> With Job Stock
			</Box>
			<Box className={'subtitle animate-delay-2'}>
				Getting a new job is never easy. Check what new jobs we have in store for you on Job Stock.
			</Box>
		</Stack>
	);
};

export default DescHome;
