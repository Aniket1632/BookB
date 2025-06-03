import React from 'react';
import LoginScreen from '../../screens/LoginScreen';
import './LoginSidebar.css';

const LoginSidebar = () => {

	// const toggleMenu_website = () => {
	// 	let navigation = document.querySelector('.navigationLoginSidebar');
	// 	navigation.classList.toggle('active');
	// };

	return (
		<nav className='navigationLoginSidebar active'>
			{/* <div>
				<button className='navigationLoginSidebarIcon' onClick={toggleMenu_website}>
					<svg className='navigationLoginSidebarIcon--icon'>
						<use xlinkHref={`/assets/sprite.svg#icon-close`} />
					</svg>
				</button>
			</div> */}
			<LoginScreen />
		</nav>
	);
};

export default LoginSidebar;
