import React from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const steps = [
	{
		number: '01',
		title: 'Create An Account',
		description:
			'Post A Job To Tell Us About Your Project. We’ll Quickly Match You With The Right Freelancers Find Place Best. Nor again is there anyone who loves.',
	},
	{
		number: '02',
		title: 'Search Jobs',
		description:
			'Post A Job To Tell Us About Your Project. We’ll Quickly Match You With The Right Freelancers Find Place Best. Nor again is there anyone who loves.',
	},
	{
		number: '03',
		title: 'Save & Apply Jobs',
		description:
			'Post A Job To Tell Us About Your Project. We’ll Quickly Match You With The Right Freelancers Find Place Best. Nor again is there anyone who loves.',
	},
];

const ChooseSection: React.FC = () => {
	const device = useDeviceDetect();
	if (device === 'mobile') {
		return (
			<section className="choose-section">
				<div className="container">
					<h2 className="section-title">Choose What You Need</h2>
					<p className="section-subtitle">
						Find the right path to kickstart your journey — create an account, search jobs, and apply with ease.
					</p>
					<div className="card-grid">
						{steps.map((step, index) => (
							<div key={index} className="choose-card">
								<h3 className="step-number">{step.number}.</h3>
								<h4 className="step-title">{step.title}</h4>
								<p className="step-desc">{step.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>
		);
	} else {
		return (
			<section className="choose-section">
				<div className="container">
					<h2 className="section-title">Choose What You Need</h2>
					<p className="section-subtitle">
						Find the right path to kickstart your journey — create an account, search jobs, and apply with ease.
					</p>
					<div className="card-grid">
						{steps.map((step, index) => (
							<div key={index} className="choose-card">
								<h3 className="step-number">{step.number}.</h3>
								<h4 className="step-title">{step.title}</h4>
								<p className="step-desc">{step.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>
		);
	}
};

export default ChooseSection;
