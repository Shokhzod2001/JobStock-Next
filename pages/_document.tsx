import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="robots" content="index,follow" />
				<link rel="icon" type="image/png" href="/img/logo/favicon.png" />
				<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet"></link>

				{/* SEO */}
				<meta
					name="keywords"
					content="JobStock, JobStock.kr, jobs in South Korea, remote jobs, IT jobs, software developer jobs, MERN stack jobs, fullstack jobs, career, employment"
				/>
				<meta
					name="description"
					content={
						'Find your dream job on JobStock. Explore IT, developer, and remote jobs in South Korea and worldwide. ' +
						'Найдите работу своей мечты на JobStock. Просмотрите вакансии для IT-специалистов, разработчиков и удаленную работу в Южной Корее и за рубежом. ' +
						'JobStock에서 원하는 직업을 찾아보세요. 대한민국 및 전 세계의 IT, 개발자, 원격 근무 일자리를 확인하세요.'
					}
				/>
				<title>JobStock - Find Jobs in South Korea & Worldwide | IT, MERN, Remote</title>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
