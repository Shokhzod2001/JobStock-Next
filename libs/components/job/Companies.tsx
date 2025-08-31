import React from 'react';

interface Company {
	name: string;
	logo: string;
	url: string;
	logoHeight?: number;
}

const companies: Company[] = [
	{
		name: 'Google',
		logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/272px-Google_2015_logo.svg.png',
		url: 'https://careers.google.com/',
	},
	{
		name: 'Amazon',
		logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/263px-Amazon_logo.svg.png',
		url: 'https://www.amazon.jobs/',
	},
	{
		name: 'Microsoft',
		logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/320px-Microsoft_logo_%282012%29.svg.png',
		url: 'https://careers.microsoft.com/',
	},
	{
		name: 'Apple',
		logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/80px-Apple_logo_black.svg.png',
		url: 'https://www.apple.com/careers/',
		logoHeight: 45,
	},
	{
		name: 'Meta',
		logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/320px-Meta_Platforms_Inc._logo.svg.png',
		url: 'https://www.metacareers.com/',
	},
	{
		name: 'Netflix',
		logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/340px-Netflix_2015_logo.svg.png',
		url: 'https://jobs.netflix.com/',
		logoHeight: 35,
	},
	{
		name: 'Spotify',
		logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/168px-Spotify_logo_without_text.svg.png',
		url: 'https://www.lifeatspotify.com/jobs',
	},
	{
		name: 'IBM',
		logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/200px-IBM_logo.svg.png',
		url: 'https://www.ibm.com/careers',
	},
	{
		name: 'Salesforce',
		logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/320px-Salesforce.com_logo.svg.png',
		url: 'https://www.salesforce.com/company/careers/',
	},
	{
		name: 'Zoom',
		logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Zoom_Communications_Logo.svg/320px-Zoom_Communications_Logo.svg.png',
		url: 'https://careers.zoom.us/',
		logoHeight: 30,
	},
	{
		name: 'Dell',
		logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Dell_Logo.svg/200px-Dell_Logo.svg.png',
		url: 'https://jobs.dell.com/',
	},
	{
		name: 'Adobe',
		logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Adobe_Systems_logo_and_wordmark.svg/320px-Adobe_Systems_logo_and_wordmark.svg.png',
		url: 'https://adobe.wd5.myworkdayjobs.com/en-US/external_experienced',
	},
	{
		name: 'Intel',
		logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Intel_logo_%282006-2020%29.svg/200px-Intel_logo_%282006-2020%29.svg.png',
		url: 'https://jobs.intel.com/',
	},
	{
		name: 'Oracle',
		logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Oracle_logo.svg/200px-Oracle_logo.svg.png',
		url: 'https://careers.oracle.com/',
	},
	{
		name: 'Twitter (X)',
		logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/X_logo_2023.svg/100px-X_logo_2023.svg.png',
		url: 'https://careers.x.com/',
	},
	{
		name: 'LinkedIn',
		logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/240px-LinkedIn_logo_initials.png',
		url: 'https://careers.linkedin.com/',
	},
	{
		name: 'Airbnb',
		logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_Bélo.svg/200px-Airbnb_Logo_Bélo.svg.png',
		url: 'https://careers.airbnb.com/',
	},
	{
		name: 'Uber',
		logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Uber_logo_2018.png/320px-Uber_logo_2018.png',
		url: 'https://www.uber.com/global/en/careers/',
		logoHeight: 40,
	},
	{
		name: 'Shopify',
		logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Shopify_logo_2018.svg/320px-Shopify_logo_2018.svg.png',
		url: 'https://www.shopify.com/careers',
	},
	{
		name: 'Slack',
		logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/200px-Slack_icon_2019.svg.png',
		url: 'https://slack.com/careers',
	},
	{
		name: 'GitHub',
		logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/200px-Octicons-mark-github.svg.png',
		url: 'https://github.com/about/careers',
	},
	{
		name: 'Pinterest',
		logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Pinterest-logo.png/240px-Pinterest-logo.png',
		url: 'https://about.pinterest.com/en/careers',
	},
	{
		name: 'Twitch',
		logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Twitch_Glitch_Logo_Purple.svg/200px-Twitch_Glitch_Logo_Purple.svg.png',
		url: 'https://www.twitch.tv/jobs',
	},
];

const RemoteHiringCompanies: React.FC = () => {
	const scrollStyle = {
		animation: 'scroll 25s linear infinite',
	};

	return (
		<div style={{ textAlign: 'center', padding: '48px 0px 10px 0px', overflow: 'hidden' }}>
			<style>{`
				@keyframes scroll {
					0% { transform: translateX(0); }
					100% { transform: translateX(-50%); }
				}
			`}</style>

			<div style={scrollStyle}>
				<div
					style={{
						display: 'flex',
						whiteSpace: 'nowrap',
						width: 'fit-content',
					}}
				>
					{[...companies, ...companies].map((company, index) => (
						<a
							key={index}
							href={company.url}
							target="_blank"
							rel="noopener noreferrer"
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								justifyContent: 'center',
								width: '140px',
								height: '80px',
								margin: '0 12px',
								padding: '8px',
								textDecoration: 'none',
							}}
							onMouseEnter={(e) => {
								const target = e.currentTarget as HTMLElement;
								target.style.transform = 'scale(1.05)';
							}}
							onMouseLeave={(e) => {
								const target = e.currentTarget as HTMLElement;
								target.style.transform = 'scale(1)';
							}}
						>
							<img
								src={company.logo}
								alt={company.name}
								style={{
									maxHeight: `${company.logoHeight || 50}px`,
									objectFit: 'contain',
									maxWidth: '120px',
								}}
								onError={(e) => {
									const target = e.target as HTMLImageElement;
									target.src =
										'https://dummyimage.com/100x50/cccccc/000000.png&text=' + encodeURIComponent(company.name);
								}}
							/>
						</a>
					))}
				</div>
			</div>
		</div>
	);
};

export default RemoteHiringCompanies;
