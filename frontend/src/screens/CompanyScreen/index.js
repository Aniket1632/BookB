import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Content from '../../components/Content';
import Spinner from '../../components/Spinner/Spinner';
import {
	createCompanyAction,
	deleteCompanyAction,
	getAllCompanyAction,
	changeCompanyStatusAction
} from '../../redux/actions/companyActions';
import {
	ADD_COMPANY_RESET,
	CHANGE_COMPANY_STATUS_RESET,
	DELETE_COMPANY_RESET
} from '../../redux/constants/companyConstants';

import { validateEmail, validatePhone } from '../../utils/validators';
import AddCompany from './AddCompany';
import DeleteCompany from './DeleteCompany';
import CompanyStyle from './Company.module.css';

const CompanyScreen = ({ history }) => {
	const dispatch = useDispatch();
	const getUserInfo = useSelector((state) => state.getUserInfo);
	const [ addModalActive, setAddModalActive ] = useState(false);
	const [ selectUpdateModel, setSelectUpdateModel ] = useState({});

	const companyList = useSelector((state) => state.companyList);
	const createCompany = useSelector((state) => state.createCompany);
	const deleteCompany = useSelector((state) => state.deleteCompany);
	const changeCompanyStatus = useSelector((state) => state.changeCompanyStatus);
	const [ modalDeleteState, setModalDeleteState ] = useState(false);

	const [ id, setCompanyId ] = useState('');

	const [ search, setSearch ] = useState('');

	const [ name, setName ] = useState('');
	const [ nameError, setNameError ] = useState('');
	const [ email, setEmail ] = useState('');
	const [ emailError, setEmailError ] = useState('');
	const [ address, setAddress ] = useState('');
	const [ addressError, setAddressError ] = useState('');
	const [ phone, setPhone ] = useState('');
	const [ phoneError, setPhoneError ] = useState('');

	const [ totalPageSize, setTotalPageSize ] = useState(1);
	const [ pageNumber, setPageNumber ] = useState(1);
	const pageLimit = 20;

	useEffect(
		() => {
			if (
				getUserInfo &&
				getUserInfo.userInfo &&
				getUserInfo.userInfo.data &&
				(getUserInfo.userInfo.data.role === 'salon' ||
					getUserInfo.userInfo.data.role === 'manager' ||
					getUserInfo.userInfo.data.role === 'superadmin')
			) {
				dispatch(getAllCompanyAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			} else {
				history.push('/');
			}
		},
		[ history, getUserInfo, dispatch ]
	);

	useEffect(
		() => {
			if (createCompany && createCompany.category && createCompany.category.status) {
				clearData();
				setAddModalActive(false);
				toast.success(createCompany.category.message);
				dispatch({ type: ADD_COMPANY_RESET });
				dispatch(getAllCompanyAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			} else if (createCompany && createCompany.category && !createCompany.category.status) {
				dispatch({ type: ADD_COMPANY_RESET });
				toast.error(createCompany.category.message);
			} else if (deleteCompany && deleteCompany.category && deleteCompany.category.status) {
				toast.success(deleteCompany.category.message);
				dispatch({ type: DELETE_COMPANY_RESET });
				dispatch(getAllCompanyAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			} else if (deleteCompany && deleteCompany.category && !deleteCompany.category.status) {
				toast.error(deleteCompany.category.message);
				dispatch({ type: DELETE_COMPANY_RESET });
				dispatch(getAllCompanyAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			} else if (changeCompanyStatus && changeCompanyStatus.category && changeCompanyStatus.category.status) {
				toast.success(changeCompanyStatus.category.message);
				setSelectUpdateModel({});
				dispatch({ type: CHANGE_COMPANY_STATUS_RESET });
				dispatch(getAllCompanyAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			} else if (changeCompanyStatus && changeCompanyStatus.category && !changeCompanyStatus.category.status) {
				toast.error(changeCompanyStatus.category.message);
				dispatch({ type: CHANGE_COMPANY_STATUS_RESET });
				dispatch(getAllCompanyAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			}
		},
		[ createCompany, changeCompanyStatus, deleteCompany, dispatch ]
	);

	const handleAddModalClose = () => {
		clearData();
		setSelectUpdateModel({});
		setAddModalActive(false);
	};

	const handleEditButton = (d) => {
		setCompanyId(d._id);
		setEmail(d.email);
		setPhone(d.phone);
		setName(d.name);
		setAddress(d.address);
		setSelectUpdateModel(d);
		setAddModalActive(true);
	};

	const clearData = () => {
		setCompanyId('');
		setEmail('');
		setPhone('');
		setAddress('');
		setName('');
		setEmailError('');
		setPhoneError('');
		setAddressError('');
		setNameError('');
		setSelectUpdateModel('');
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (name === '' && name.trim() === '') {
			setNameError('Please enter name');
		} else if (email === '' && email.trim() === '') {
			setEmailError('Please enter email address');
		} else if (!validateEmail(email)) {
			setEmailError('Please enter valid email address');
		} else if (phone === '' && phone.trim() === '') {
			setPhoneError('Please enter phone');
		} else if (!validatePhone(phone)) {
			setPhoneError('Phone number must be 10 digits');
		} else if (address === '' && address.trim() === '') {
			setAddressError('Please enter address');
		} else {
			const role = 'company';
			if (id !== '') {
				dispatch(createCompanyAction({ id, name, address, email, phone, role }));
			} else {
				dispatch(createCompanyAction({ name, address, email, phone, role }));
			}
		}
	};

	const handleEnableCategory = (id, enableStatus) => {
		dispatch(
			changeCompanyStatusAction(id, {
				enable: enableStatus ? true : false
			})
		);
	};

	const onDeleteModalClose = () => {
		clearData();
		setModalDeleteState(false);
	};

	const onDeleteHandler = () => {
		dispatch(deleteCompanyAction(selectUpdateModel._id));
		onDeleteModalClose();
	};

	const onSearchHandler = (event) => {
		setSearch(event.target.value);
		if (search.trim !== '' && search.length > 0) {
			setPageNumber(1);
		}
		dispatch(getAllCompanyAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: event.target.value }));
	};

	return (
		<Content
			currentMenu='stylist'
			headerTitle='Company'
			addBtn={
				getUserInfo &&
				getUserInfo.userInfo &&
				getUserInfo.userInfo.data &&
				(getUserInfo.userInfo.data.role === 'salon' ||
					getUserInfo.userInfo.data.role === 'manager' ||
					getUserInfo.userInfo.data.role === 'superadmin') ? (
					true
				) : (
					false
				)
			}
			addBtnText='Add Company'
			addBtnIcon='plus'
			addBtnClick={() => setAddModalActive(true)}
			search={true}
			searchPlaceholder='Search Company...'
			searchIcon='search'
			searchvalue={search}
			searchOnChange={onSearchHandler}>
			{companyList && companyList.loading ? (
				<Spinner />
			) : (
				<div>
					{companyList &&
					companyList.categories &&
					companyList.categories.data &&
					companyList.categories.data.result &&
					companyList.categories.data.result.length > 0 ? (
						<div className='tableContainer' style={{ height: '65vh' }}>
							<table className='table'>
								<thead>
									<tr>
										<th>#</th>
										<th>Company Name</th>
										<th>Email</th>
										<th>Phone</th>
										<th>Address</th>
										{/* <th>Created At</th> */}
										<th>Active Status</th>
										<th />
									</tr>
								</thead>
								<tbody>
									{companyList && companyList.loading ? (
										<tr>
											<td>
												<Spinner />
											</td>
										</tr>
									) : (
										companyList &&
										companyList.categories &&
										companyList.categories.data &&
										companyList.categories.data.result &&
										companyList.categories.data.result.length > 0 &&
										companyList.categories.data.result.map((res, index) => (
											<tr key={res._id}>
												<td>{index + 1}</td>
												<td>{res.name}</td>
												<td>{res.email}</td>
												<td>{res.phone}</td>
												<td className='text_wrap_desc'>{res.address}</td>
												<td>
													<label className='switch'>
														<input
															checked={res.active}
															onChange={() => {
																handleEnableCategory(res._id, res.active);
															}}
															type='checkbox'
															className='checkbox'
															name='active'
														/>
														<span className='slider round' />
													</label>
												</td>
												<td>
													<div className='table__iconBox'>
														<button className='table__button' onClick={() => handleEditButton(res)}>
															<svg className='table__button--icon'>
																<use xlinkHref={`/assets/sprite.svg#icon-edit`} />
															</svg>
															<span>Edit Company Details</span>
														</button>
														<button
															className='table__button table__button--delete'
															onClick={() => {
																setSelectUpdateModel(res);
																setModalDeleteState(true);
															}}>
															<svg className='table__button--icon-red'>
																<use xlinkHref={`/assets/sprite.svg#icon-delete`} />
															</svg>
															<span>Delete Company</span>
														</button>
													</div>
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>
					) : (
						<div className='not_data_found'>
							<h1>No data found !</h1>
						</div>
					)}
				</div>
			)}
			<AddCompany
				data={{
					addModalActive,
					handleAddModalClose,
					handleSubmit,
					selectUpdateModel,

					name,
					email,
					address,
					phone,

					setName,
					setEmail,
					setPhone,
					setAddress,

					nameError,
					addressError,
					phoneError,
					emailError,

					setNameError,
					setAddressError,
					setPhoneError,
					setEmailError
				}}
			/>

			<DeleteCompany data={{ modalDeleteState, onDeleteModalClose, onDeleteHandler }} />
		</Content>
	);
};

export default CompanyScreen;
