import { useEffect, useState } from 'react';
import { Fab, Zoom } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const ScrollToTop = () => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setVisible(window.scrollY > 300);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<Zoom in={visible}>
			<Fab
				onClick={scrollToTop}
				size="small"
				sx={{
					width: '40px',
					height: '40px',
					position: 'fixed',
					bottom: 35,
					right: 35,
					zIndex: 998,
					bgcolor: '#4CAF50',
					color: '#fff',
					boxShadow: '0px 0px 10px rgba(0,0,0,0.2)',
					transition: 'all 1s ease',
					'&:hover': {
						cursor: 'pointer',
						bgcolor: '#388E3C',
						color: '#fff',
						transition: 'all 1s ease',
						width: '50px',
						height: '50px',
						right: 30,
						bottom: 30,
					},
				}}
			>
				<KeyboardArrowUpIcon />
			</Fab>
		</Zoom>
	);
};

export default ScrollToTop;
