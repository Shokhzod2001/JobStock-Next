import React from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';

const Advertisement = () => {
	const device = useDeviceDetect();
	const videoSrc = '/video/ads.mp4';

	if (device === 'mobile') {
		return (
			<Stack className={'videoFrame'}>
				<video autoPlay muted loop playsInline preload="auto" className={'video'}>
					<source src={videoSrc} type="video/mp4" />
				</video>

				<Stack className={'overlay'}>
					<motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
						<Typography variant={device === 'mobile' ? 'h4' : 'h2'} className={'title'}>
							Your <span className={'highlight'}>Career Growth</span> Starts Here
						</Typography>
					</motion.div>

					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}>
						<Typography variant={device === 'mobile' ? 'body1' : 'h5'} className={'subtitle'}>
							Find jobs that fit your passion, skills & future 🌱
						</Typography>
					</motion.div>

					<motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
						<a href="/job">
							<Button variant="contained" className={'ctaBtn'}>
								Explore Jobs
							</Button>
						</a>
					</motion.div>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'videoFrame'}>
				<video autoPlay muted loop playsInline preload="auto" className={'video'}>
					<source src={videoSrc} type="video/mp4" />
				</video>

				<Stack className={'overlay'}>
					<motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
						<Typography variant={device === 'mobile' ? 'h4' : 'h2'} className={'title'}>
							Your <span className={'highlight'}>Career Growth</span> Starts Here
						</Typography>
					</motion.div>

					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}>
						<Typography variant={device === 'mobile' ? 'body1' : 'h5'} className={'subtitle'}>
							Find jobs that fit your passion, skills & future 🌱
						</Typography>
					</motion.div>

					<motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
						<a href="/job">
							<Button variant="contained" className={'ctaBtn'}>
								Explore Jobs
							</Button>
						</a>
					</motion.div>
				</Stack>
			</Stack>
		);
	}
};

export default Advertisement;
