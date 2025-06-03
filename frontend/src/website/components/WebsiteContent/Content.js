import React, { Fragment, useEffect, useState } from 'react';
import ContentStyle from './Content.module.css';
import WebHeader from '../Headers/Header';
import Footer from '../Footer';
import Spinner from '../WebsiteSpinner/Spinner';

const Content = ({ children, getPublicWebsite, style }) => {
	const [color, setColor] = useState("")
	useEffect(() => {
		if (getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.status) {
			setColor(getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.bgColor)
		}
	}, [])
	return (
		<main className={ContentStyle.container}>
			{getPublicWebsite && getPublicWebsite.loading ?
				<Spinner />
				: <Fragment>
					<WebHeader getPublicWebsite={getPublicWebsite} style={style} />
					<div className={ContentStyle.content}>
						<div style={{ minHeight: '60rem' }}>
							{children}
						</div>
						<Footer
							phone={getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon.phone}
							address={getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon.address}
							email={getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon.email}
							salonName={getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon.name}
							color={color}
						/>
					</div>
				</Fragment>
			}
		</main>
	);
};

export default Content;
