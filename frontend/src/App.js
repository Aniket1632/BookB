import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.min.css';
import { io } from 'socket.io-client';
import Navigation from './navigation';
import './App.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import { ToastContainer } from 'react-toastify';
import { getUserByTokenAction } from './redux/actions/userActions';
import { getAllEnabledSalonListAction } from './redux/actions/salonActions';
import { BASE_SOCKET_URL } from './redux/actions/ip';
import CongratulationModal from '../../frontend/src/components/ConragatulationModal/CongratulationModal'


const App = () => {
	const dispatch = useDispatch();
	const [socket, setSocket] = React.useState(null);
	const userLogin = useSelector((state) => state.userLogin);
	const userData = useSelector((state) => state.getUserInfo);

	const [isModalOpen, setIsModalOpen] = useState(false);

    // useEffect(() => {
    //     setIsModalOpen(false); 
	// }, []);
	
	const handleCloseModal = () => {
        setIsModalOpen(false); 
    };


	// console.log(userData, 'userData')

	// const setupSocket = React.useCallback(
	// 	id => {
	// 		const newSocket = io.connect(BASE_SOCKET_URL, {
	// 		  query: {

	// 			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
	// 		  },
	// 		});


	// 		newSocket.on('disconnect', () => {
	// 		  setSocket(null);
	// 		  setTimeout(setupSocket, 3000);
	// 		  console.log('connected')
	// 		  // toast.error('You went offline!', {
	// 		  //   style: {
	// 		  //     borderRadius: '10px',
	// 		  //     background: '#3C0016',
	// 		  //     color: '#fff',
	// 		  //   },
	// 		  // });
	// 		});

	// 		newSocket.on('connect', () => {
	// 		  // toast.success('You are now online!', {
	// 		  //   style: {
	// 		  //     borderRadius: '10px',
	// 		  //     background: '#3C0016',
	// 		  //     color: '#fff',
	// 		  //   },
	// 		  // });
	// 		});

	// 		setSocket(newSocket);
	// 	},
	// 	[socket]
	//   );

	useEffect(() => {

		if (
			userLogin &&
			userLogin.userInfo &&
			userLogin.userInfo.status &&
			userData &&
			userData.userInfo &&
			userData.userInfo.data
		) {
			const socket = io(BASE_SOCKET_URL, {
				query: {
					stylist: userData.userInfo.data?._id,
					role: userData.userInfo.data?.role,
					salon: userData.userInfo.data?.salon?._id,
				},
			});
			setSocket(socket);
			socket.on('connection', (data) => {
			});

			return () => {
				socket.disconnect();
			};
		}
	}, [userLogin, userData]);

	useEffect(() =>{
		if(socket){
		socket.on('appointment-request', (obj) => {
			if (obj && obj?.message) {
				console.log(obj, 'obj')
				toast.success(obj?.message)
			}
		});
	}
	},[socket])


	useEffect(
		() => {
			dispatch(getUserByTokenAction());
			dispatch(getAllEnabledSalonListAction());
		},
		[dispatch]
	);

	useEffect(() => {
		if (userLogin && userLogin.userInfo) {
			console.log("User login info:", userLogin.userInfo);
	
			// Check if `isFirstLogin` is true and the role is "stylist"
			if (userLogin.userInfo.isFirstLogin && userLogin.userInfo.data?.role === 'salon') {
				console.log("This is the first login for a stylist!");
				setIsModalOpen(true);  // Show the congratulation modal
			} else {
				console.log("This is not the first login .");
			}
		}
	}, [userLogin]);

	return (
		<Fragment>
			<Navigation userLogin={userLogin} socket={socket} />
			<ToastContainer position='bottom-right' />
			{isModalOpen &&
			<CongratulationModal 
				coins={50}
				onClose={handleCloseModal}
            />}
		</Fragment>
	);
};

export default App;