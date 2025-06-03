import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import Button from '../../components/formInputs/Button';
import { addWebsiteContactUsAction, getWebsiteServiceAction, getWebsiteServiceActionById, getWebsiteSettingAction, getWebsiteSettingActionById } from '../../redux/actions/websiteSettingAction';
import Content from '../components/WebsiteContent/Content';
import RoundCards from './RoundCards';
import moment from 'moment';
import { inputPhoneMasking, validateEmail, validatePhone } from '../../utils/validators';
import { getAllProductsAction } from '../../redux/actions/productActions';
import { ADD_WEBSITE_CONTACT_US_RESET, GET_WEBSITE_SETTING_RESET } from '../../redux/constants/websiteSettingConstant';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Stars from '../components/Stars/Stars';
import './HomeScreen.css';
import SubHeadingContent from '../components/SubHeadingContent/SubHeadingContent';

const CustomHomeScreen = () => {
	const { salonId } = useParams();
	const dispatch = useDispatch();
	const history = useHistory();
	const getPublicWebsite = useSelector((state) => state.getPublicWebsite);
	const getWebsiteService = useSelector((state) => state.getWebsiteService);
	const addWebsiteContactUs = useSelector((state) => state.addWebsiteContactUs);
	const getAllProducts = useSelector((state) => state.getAllProducts);

	const [name, setName] = useState("");
	const [nameError, setNameError] = useState("");
	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState("");
	const [phone, setPhone] = useState("");
	const [phoneError, setPhoneError] = useState("");
	const [subject, setSubject] = useState("");
	const [subjectError, setSubjectError] = useState("");
	const [message, setMessage] = useState("");
	const [messageError, setMessageError] = useState("");
	const [categoryName, setCategoryName] = useState(null)
	const [color,setColor] = useState("")
	
	useEffect(()=>{
		if(getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.status){
			setColor(getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.bgColor)
			}
	},[])
	useEffect(() => {
		dispatch(getWebsiteSettingActionById(salonId));
	}, [salonId])

	useEffect(() => {
		if (getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data) {
			const formData = {
				"pageNumber": 1,
				"pageSize": 9,
				"filter": [],
				"minPrice": 10,
				"maxPrice": 10000,
				'name': salonId
			}
			// localStorage.setItem('salonId',salonId);
			dispatch(getWebsiteServiceActionById(salonId))
			dispatch(getAllProductsAction(formData));
		} else if (getPublicWebsite && getPublicWebsite.websiteInfo && !getPublicWebsite.websiteInfo.status) {
			toast.error(getPublicWebsite.websiteInfo.message);
			// setTimeout(() => {
			// 	window.location.replace('https://bookb.io');
			// }, 2500)
			dispatch({ type: GET_WEBSITE_SETTING_RESET });
		}
	}, [getPublicWebsite, dispatch])



	useEffect(() => {
		if (getWebsiteService &&
			getWebsiteService.session &&
			getWebsiteService.session.data &&
			getWebsiteService.session.data.result &&
			getWebsiteService.session.data.result.length > 0) {
			setCategoryName(getWebsiteService.session.data.result[0].category.title)
		}
	}, [getWebsiteService])

	const getFilteredList = () => {
		if (getWebsiteService &&
			getWebsiteService.session &&
			getWebsiteService.session.data &&
			getWebsiteService.session.data.result &&
			getWebsiteService.session.data.result.length > 0) {
			if (!categoryName) {
				return getWebsiteService.session.data.result;
			}

			return getWebsiteService.session.data.result.filter((item) => item && item.category && item.category.title === categoryName);
		}
	}

	useEffect(() => {
		getFilteredList();
	}, [categoryName])

	useEffect(
		() => {
			if (addWebsiteContactUs && addWebsiteContactUs.data && addWebsiteContactUs.data.status) {
				toast.success(addWebsiteContactUs.data.message);
				clearData();
				dispatch({ type: ADD_WEBSITE_CONTACT_US_RESET });
			} else if (addWebsiteContactUs && addWebsiteContactUs.data && addWebsiteContactUs.data.data && !addWebsiteContactUs.data.data.status) {
				dispatch({ type: ADD_WEBSITE_CONTACT_US_RESET });
				toast.error(addWebsiteContactUs.data.message);
			}
		},
		[addWebsiteContactUs]
	);


	let filteredList = useMemo(getFilteredList, [categoryName, getWebsiteService && getWebsiteService.session && getWebsiteService.session.data && getWebsiteService.session.data.result]);


	const handleClick = (e) => {
		e.preventDefault();
		if (name === "") {
			setNameError("Please enter name");
		}
		if (email === "") {
			setEmailError("Please enter email")
		}
		if (!validateEmail(email)) {
			setEmailError("Please enter valid email")
		}
		if (phone === "") {
			setPhoneError("Please enter phone no.")
		}

		if (subject === "") {
			setSubjectError("Please enter subject");
		}
		if (message === "") {
			setMessageError("Please enter message")
		}

		if (name && email && validateEmail(email) && phone && subject && message) {
			let data = {
				name,
				email,
				phone: phone,
				subject,
				message,
			}
			dispatch(addWebsiteContactUsAction(data));
		}
	}

	const clearData = () => {
		setName("");
		setEmail("");
		setPhone("");
		setSubject("");
		setMessage("");
		setNameError("");
		setEmailError("");
		setPhoneError("");
		setSubjectError("");
		setMessageError("");
	}


	return (
		<Content getPublicWebsite={getPublicWebsite} style={{backgroundColor:color}}>
			<SubHeadingContent
				title={getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.appearanceBarText}
				subTitle={getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.appearanceBarPara}
				style={{backgroundColor:color}}
			/>
			<div className="homescreen_banner" id="banner">
				<div className="homescreen_banner_outer">
					<div className="homescreen_motive">
						<h1 className="homescreen_banner__subtitle">
							{getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.websiteTitle}
						</h1>
						<h1 className="homescreen_banner__desc">
							{getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.websiteSubTitle}
						</h1>
						<div className='new_book'>
						<Button
							varient="primary"
							style={{
								width: '70%',
								justifyContent: 'center',
								backgroundColor:color,
								marginLeft: '0rem'
							}}
							onClick={() => {
								history.push(`/salon/${getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon.name}/book-appointment`);
							}}
							label="Book an Appointment"
							icon="arrow_right"
						/>
					</div>
					</div>
					<img src="./assets/styler.png" className="img-responsive1" alt="salon Image" />
				</div>

				<div>
					<img src={getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.websiteBannerImageURL} className="img-responsive" alt="salon Image" />
				</div>
			</div>
			{getAllProducts &&
				getAllProducts.products &&
				getAllProducts.products.data &&
				getAllProducts.products.data.result &&
				getAllProducts.products.data.result.length > 0 &&
				<div className="homescreen_products" id="products" style={{backgroundColor:color}}>
					<div className="CardHeader">
						<h1>{getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.productText}</h1>
					</div>
					<div className='product-container'>
						{
							getAllProducts.products.data.result.slice(0, 4).map((res, index) => (
								<div key={index + 1} className="product_card--layout" onClick={() => history.push(`/salon/${getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon.name}/product-info/${res._id}`)}>
									<img src={res.productImageURL} alt="product thumb" className="product_card" style={{ cursor: 'pointer' }} />
									<div className="porduct-desc">
										<h1 className="productCard__title">
											{res.rating > 0 ?
												<div className="product--rate">
													<Stars rating={res.rating} />
												</div> : null}
											<p>	{res.productName.length > 10 ? res.productName.slice(0, 20) : res.productName}  	</p>
											<br />
											$ {res.productPrice}  <span className="actualPrice">${res.actualPrice}</span>
										</h1>
									</div>
								</div>
							))}
					</div>
					<div className="all_products">
						<a className="all_products_button" href={`#/salon/${getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon.name}/products-list`}>
							View all
						</a>
					</div>
				</div>}
			<div className="services" id="services_our">
				<h1 className="servies_main_heading">{getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.serviceText}</h1>
				<div className='service_list'>
					{
						getWebsiteService && getWebsiteService.session && getWebsiteService.session.data && getWebsiteService.session.data.result && getWebsiteService.session.data.result.length > 0 && getWebsiteService.session.data.result.map((item, id) => {
							return (
								<button key={id} className={categoryName === item.category.title ? 'activeBtn' : 'serviceBtn'} onClick={() => setCategoryName(item.category.title)} style={categoryName === item.category.title ? {backgroundColor:color}: {borderColor:color,color:color}}>{item.category.title}</button>
							)
						})
					}
				</div>
				<div className="our_services">
					<div className="our_services_outer">
						{
							filteredList && filteredList.length > 0 &&
							filteredList.map((item, id) => (<RoundCards service={item} color={color}/>))
						}
					</div>
				</div>
			</div>

			<div className="working_time" id="hoursOfOperation">
				<div className="working_time_left" style={{backgroundColor:color}}>
					<h1 className="working_time_heading">WORKING HOURS</h1>
					<p className="our_services_subheading1">The hours and days we can serve you</p>
					<br />
					<br />
					{
						getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.workHour && getPublicWebsite.websiteInfo.data.workHour.map((item, id) =>
						(
							<>
								{item.isAvailable ?
									<div className="days_we_work">
										<p className="our_services_subheading">{item.day}</p>
										<p className="our_services_subheading">{moment(item && item.slot && item.slot.startTime, "hh:mm a").format('LT')} - {moment(item && item.slot && item.slot.endTime, "hh:mm a").format('LT')}</p>
									</div>
									:
									(<div className="days_we_work-sunday">
										<p className="our_services_subheading">{item.day}</p>
										<p className="our_services_subheading">Closed</p>
									</div>)

								}
							</>
						)
						)
					}
					<hr className="hr" />
					<div className="bookings">
						<h2 className="our_services_subheading1">
							Contact on this numer for appointments
						</h2>
						<p className="our_services_subheading">{getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon.phone}</p>
					</div>
				</div>
				<div className="working_time_right">
					<h1 className="working_time_heading">{getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.hourText}</h1>
					<br />

					<p className="our_services_subheading1">
						{getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.hourPara}
					</p>
					<br />
					<br />
					<div className='new_book'>
					<Button
						varient="primary"
						style={{
							width: '70%',
							justifyContent: 'center',
							backgroundColor:color
						}}
						onClick={() => {
							history.push(`/salon/${getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon.name}/book-appointment`);
						}}
						label="Book an Appointment"
						icon="arrow_right"
					/>
				</div>
				</div>
			</div>

			<div className="chat_section" id="contactus">
				<h1 className="servies_main_heading">{getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.contactText ? getPublicWebsite.websiteInfo.data.contactText : "Contact Us"}</h1>
				<p className="chat_subheading">{getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.contactPara}</p>
			</div>
			<div className='contact-container'>
				<div className='contact_input_container'>
					<div className='contact_input'>
						<label>Your Name</label>
						<input type='text' placeholder='Name' value={name} onChange={(e) => { setName(e.target.value); setNameError("") }} ></input>
						<p className='onboard_error'>{nameError}</p>
					</div>
					<div className='contact_input'>
						<label>Your Email</label>
						<input type='email' placeholder='Email' value={email} onChange={(e) => { setEmail(e.target.value); setEmailError("") }}></input>
						<p className='onboard_error'>{emailError}</p>
					</div>
				</div>
				<div className='contact_input_container'>
					<div className='contact_input'>
						<label>Your Phone No.</label>
						<input placeholder='Phone No.' value={inputPhoneMasking(phone)} onChange={(e) => { setPhone(e.target.value); setPhoneError("") }} ></input>
						<p className='onboard_error'>{phoneError}</p>
					</div>
					<div className='contact_input'>
						<label>Subject</label>
						<input type='text' placeholder='Subject' value={subject} onChange={(e) => { setSubject(e.target.value); setSubjectError("") }}></input>
						<p className='onboard_error'>{subjectError}</p>
					</div>
				</div>
				<div className='contact_input_container'>
					<div className='contact_input'>
						<label>Your Message</label>
						<textarea type='text' placeholder='Message' value={message} onChange={(e) => { setMessage(e.target.value); setMessageError("") }} />
						<p className='onboard_error'>{messageError}</p>
					</div>
				</div>
				<div className='contact_button_container'>

					<button style={{backgroundColor:color}} onClick={handleClick}>Submit</button>

				</div>
			</div>
		</Content>
	)
}

export default CustomHomeScreen