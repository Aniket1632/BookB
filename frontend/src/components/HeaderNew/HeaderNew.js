import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { changeAdminAction, changeUserRole, getUserByTokenAction, logout } from '../../redux/actions/userActions';
import { CHANGE_ADMIN_RESET } from '../../redux/constants/userConstants';
import InputBox from '../NewInputBox/index';
import Styles from './HeaderNew.module.css'
import Spinner from '../Spinner/Spinner';
import { toast } from 'react-toastify';
import HeaderSkeleton from '../Skeletons/HeaderSkeleton';

const HeaderNew = ({
    title,
    switchView,
    addBtn = false,
    addBtnText,
    addBtnIcon,
    addBtnClick,
    search = false,
    searchIcon,
    searchPlaceholder,
    searchvalue,
    searchOnChange,
    listFilter,
    listType,
    getTypeList,
    onTypeListChange,

}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const userData = useSelector((state) => state.getUserInfo);
    const changeAdmin = useSelector((state) => state.changeAdmin);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [checked, setChecked] = useState();
    const [stylistView, setStylistView] = useState(true);

    const salonEnabledList = useSelector((list) => list.salonEnabledList);
    const [currentClient, setCurrentClient] = useState({});

    useEffect(
        () => {
            if (userData && userData.error && userData.error.status === false) {
                dispatch(logout());
                history.push('/login');
            } else if (userData && userData.userInfo && userData.userInfo.status && userData.userInfo.data) {
                setCurrentClient(userData.userInfo.data);
            }
        },
        [userData, history, dispatch]
    );

    useEffect(
        () => {
            if (changeAdmin && changeAdmin.userInfo && changeAdmin.userInfo.status) {
                toast.success(changeAdmin.userInfo.message);
                dispatch(getUserByTokenAction());
                window.location.reload(false);
                dispatch({ type: CHANGE_ADMIN_RESET });
            } else if (changeAdmin && changeAdmin.userInfo && !changeAdmin.userInfo.status) {
                toast.error(changeAdmin.userInfo.message);
                dispatch({ type: CHANGE_ADMIN_RESET });
            }
        },
        // eslint-disable-next-line
        [changeAdmin, dispatch]
    );

    const onChangeClient = async (item) => {
        setCurrentClient(item.salon);
        dispatch(changeAdminAction(item._id, { enable: true }));
        history.push('/');
        setOpenDropdown(false);
    };

    const changeRole = (e) => {
        if (e.target.checked) {
            dispatch(changeUserRole('stylist'))
        }
        else {
            dispatch(changeUserRole('salon'))
        }
    };

    useEffect(() => {
        if (
            userData &&
            userData.userInfo &&
            userData.userInfo.status &&
            userData.userInfo.data &&
            userData.userInfo.data.role === 'stylist'
        ) {
            setChecked(true);
        } else {
            setChecked(false); // Ensure it's false if condition doesn't match
        }
    }, [userData]);

    return (
        <Fragment>
            <>
                <div className={Styles.header}>
                    {userData &&
                        userData.userInfo &&
                        userData.userInfo.status &&
                        userData.userInfo.data &&
                        userData.userInfo.data.role === 'stylist' && (
                            <h2 className={Styles.header__heading}>{title}</h2>
                        )
                    }

                    {
                        userData &&
                        userData.userInfo &&
                        userData.userInfo.status &&
                        userData.userInfo.data &&
                        userData.userInfo.data.salon &&
                        userData.userInfo.data.salon.name &&
                        userData.userInfo.data.role === 'stylist' | 'salon' && (
                            <h2 className={Styles.header__headings}>{userData?.userInfo?.data?.salon?.name}</h2>
                        )
                    }
                    {userData &&
                        userData.userInfo &&
                        userData.userInfo.status &&
                        userData.userInfo.data &&
                        (userData.userInfo.data.role === 'salon' || userData.userInfo.data.role === 'admin') && (
                            <div className={Styles.header__left}>
                                <h2 className={Styles.header__heading}>{title}</h2>
                                {
                                    listFilter && (
                                        <select
                                            value={listType}
                                            onChange={(e) => onTypeListChange(e.target.value)}
                                            name='listType'
                                            id='listType'
                                            className={Styles.typeSelectBox}>
                                            {getTypeList &&
                                                getTypeList.length > 0 &&
                                                getTypeList.map((type, index) => (
                                                    <option value={type.value} key={index + 1}>
                                                        {type.label}
                                                    </option>
                                                ))}
                                        </select>
                                    )
                                }

                                {addBtn && (
                                    <button onClick={addBtnClick} className={Styles.header__container__button}>
                                        <svg className={Styles.header__container__icon}>
                                            <use xlinkHref={`/assets/sprite.svg#icon-${addBtnIcon}`} />
                                        </svg>
                                        <span>{addBtnText}</span>
                                    </button>
                                )}
                            </div>)}
                    {switchView && userData &&
                        userData.userInfo &&
                        userData.userInfo.status &&
                        userData.userInfo.data &&
                        userData.userInfo.data.isMultiRole &&
                        <div style={{
                        display: 'flex',
                        gap: '1rem'
                    }}>
                        <span className='switch_text' style={{ color: 'white' }}>Stylist View</span>
                        <label className='switch'>
                            <input
                                // id={d._id}
                                // checked={d.active}
                                checked={checked}
                                onChange={(e) => {
                                    changeRole(e)
                                    // window.location.reload();
                                }}
                                type='checkbox'
                                className='checkbox'
                                name='active'
                            />
                            <span className='slider round' />
                        </label>
                    </div>}
                    <div className={Styles.header__left}>

                        {search && (
                            <InputBox
                                placeholder={searchPlaceholder}
                                icon={searchIcon}
                                value={searchvalue}
                                onChange={searchOnChange}
                                style={{ backgroundColor: '#121212' }}
                            />
                        )}

                        {userData && userData.loading ? (
                            <HeaderSkeleton />
                        ) : (
                            <div style={{ display: 'flex', gap: '2rem' }}>

                                {currentClient && (
                                    <div className={Styles.dropdown_container}>
                                        <div className={Styles.dropdown}>
                                                    {/* <span className={Styles.coinContainer}>
                                                    <svg className={Styles.coinIcon}>
                                                        <use xlinkHref={`/assets/sprite.svg#icon-reward-coins`} />
                                                    </svg>
                                                    <span className={Styles.coinNumber}>100</span>
                                                </span> */}
                                            <svg className={Styles.form_input__icon}>
                                                <use xlinkHref={`/assets/sprite.svg#icon-user`} />
                                            </svg>
                                            <h2 className={Styles.header__heading_Right}>
                                                {currentClient.name} &nbsp;
                                                <span
                                                    style={{ textTransform: 'capitalize', fontWeight: '400', fontSize: '1.2rem', color: '#ffffff' }}>
                                                    ({currentClient.role})
                                                    </span>
                                            </h2>
                                        </div>
                                    </div>
                                )}

                                {userData &&
                                    userData.userInfo &&
                                    userData.userInfo.status &&
                                    userData.userInfo.data &&
                                    userData.userInfo.data.role === 'superadmin' && (
                                        <div
                                            className={Styles.dropdown_container}
                                            onBlur={() => setOpenDropdown(false)}
                                            tabIndex='0'
                                            style={{ zIndex: 102 }}>
                                            <div className={Styles.dropdown} onClick={() => setOpenDropdown(!openDropdown)}>
                                                {currentClient &&
                                                    currentClient.salon && (
                                                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                                            <img src={currentClient.salon.photo} alt='role' className={Styles.role_image} />
                                                            <h2 className={Styles.header__heading}>{currentClient.salon.name}</h2>
                                                        </div>
                                                    )}
                                                {openDropdown ? (
                                                    <svg className={Styles.form_input__icon}>
                                                        <use xlinkHref={`/assets/sprite.svg#icon-up`} />
                                                    </svg>
                                                ) : (
                                                    <svg className={Styles.form_input__icon}>
                                                        <use xlinkHref={`/assets/sprite.svg#icon-down`} />
                                                    </svg>
                                                )}
                                                {
                                                    currentClient &&
                                                    currentClient.salon &&
                                                    openDropdown && (
                                                        <div className={Styles.list_container}>
                                                            {salonEnabledList &&
                                                                salonEnabledList.userInfo &&
                                                                salonEnabledList.userInfo.data &&
                                                                salonEnabledList.userInfo.data.result.map((item, index) => (
                                                                    <div
                                                                        className={currentClient.salon._id === item._id ? 'selected_dropdown_item' : 'dropdown_item'}
                                                                        key={index}
                                                                        onClick={() => onChangeClient(item)}>
                                                                        <p className={Styles.dropdown_item_userName}> {item.name}</p>
                                                                    </div>
                                                                ))}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    )}
                            </div>
                        )}
                    </div>

                </div>
                {userData &&
                    userData.userInfo &&
                    userData.userInfo.status &&
                    userData.userInfo.data &&
                    userData.userInfo.data.role === 'superadmin' && (
                        <div className={Styles.header_button}>
                            <button onClick={addBtnClick} className='header__container--button' style={{ backgroundColor: '#121212', padding: '1rem 2rem' }}>
                                <svg className='header__container--icon'>
                                    <use xlinkHref={`/assets/sprite.svg#icon-${addBtnIcon}`} />
                                </svg>
                                <span>{addBtnText}</span>
                            </button>
                        </div>)}
            </>
        </Fragment >
    );
};

export default HeaderNew;
