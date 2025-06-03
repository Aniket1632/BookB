import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";
import { toast } from 'react-toastify'
import Content from '../../components/Content/Content'
import Button from '../../components/formInputs/Button'
import { getAllProductsAction } from '../../redux/actions/productActions';
import { addWebsiteSettingAction, getWebsiteServiceAction, getWebsiteServiceActionById, getWebsiteSettingAction, getWebsiteSettingActionById, getWebsiteSlotsAction } from '../../redux/actions/websiteSettingAction'
import { ADD_WEBSITE_SETTING_RESET } from '../../redux/constants/websiteSettingConstant'
import { inputPhoneMasking } from '../../utils/validators';
import Footer from '../../website/components/Footer';
import Spinner from '../../website/components/WebsiteSpinner/Spinner';
import './Appearance.css'
import AppearanceAppointment from './AppearanceAppointment'
import AppearanceBanner from './AppearanceBanner'
import AppearanceBar from './AppearanceBar';
import AppearanceContact from './AppearanceContact';
import Navbar from './AppearanceNavbar'
import AppearanceProduct from './AppearanceProduct';
import AppearanceServices from './AppearanceServices'
import DeleteService from './DeleteService'
import LogoModal from './LogoModal'
import ServiceModal from './ServiceModal'
import WorkHourModal from './WorkHourModal'
import { SketchPicker } from 'react-color';

const WeekDaysArray = [
  { day: 'Sun', isAvailable: true, slot: { startTime: "", endTime: "" } },
  { day: 'Mon', isAvailable: false, slot: { startTime: "", endTime: "" } },
  { day: 'Tue', isAvailable: false, slot: { startTime: "", endTime: "" } },
  { day: 'Wed', isAvailable: false, slot: { startTime: "", endTime: "" } },
  { day: 'Thu', isAvailable: false, slot: { startTime: "", endTime: "" } },
  { day: 'Fri', isAvailable: false, slot: { startTime: "", endTime: "" } },
  { day: 'Sat', isAvailable: false, slot: { startTime: "", endTime: "" } },
]


const AppearanceScreen = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [clickheader, setClickHeader] = useState(false);
  const [clickSubHeader, setClickSubHeader] = useState(false)
  const [serviceModal, setServiceModal] = useState(false)
  const [logoModal, setLogoModal] = useState(false);
  const [serviceDeleteModal, setServiceDeleteModal] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)
  const [clickProduct, setClickProduct] = useState(false)
  const [clickService, setCLickService] = useState(false)
  const [clickHourText, setClickHourText] = useState(false);
  const [clickHourPara, setClickHourPara] = useState(false)
  const [clickContactText, setClickContactText] = useState(false);
  const [clickContactPara, setClickContactPara] = useState(false)
  const [clickAppearanceBarText, setClickAppearanceBarText] = useState(false);
  const [clickAppearanceBarPara, setClickAppearanceBarPara] = useState(false)
  const [header, setHeader] = useState("")
  const [subHeader, setSubHeader] = useState("")
  const [productText, setProductText] = useState("");
  const [serviceText, setServiceText] = useState("");
  const [hourText, setHourText] = useState("");
  const [hourPara, setHourPara] = useState("")
  const [contactText, setContactText] = useState("");
  const [contactPara, setContactPara] = useState("")
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [desc, setDesc] = useState("");
  const [imageSrc, setImageSrc] = useState("./assets/favicon.png");
  const [imageSrcError, setImageSrcError] = useState('');
  const [uploadFileData, setUploadFileData] = useState('');
  const [uploadFileDataError, setUploadFileDataError] = useState('');
  const [bannerImage, setBannerImage] = useState("./assets/styler.png");
  const [appointmentModal, setAppointmentModal] = useState(false)
  const [weekDays, setWeekDays] = useState(WeekDaysArray);
  const [clickButton, setClickButton] = useState(false);
  const [buttonText, setButtonText] = useState("Book Appointment");
  const [appearanceBarText, setAppearanceBarText] = useState("");
  const [appearanceBarPara, setAppearanceBarPara] = useState("");
  const [color,setColor] = useState("");
  const [colorPallete,showColorPallete] = useState(false)



  const [bannerPhoto, setBannerPhoto] = useState('')
  const [bannerPhotoError, setBannerPhotoError] = useState('');
  const publicWebsite = useSelector((state) => state.publicWebsite);
  const getUserInfo = useSelector((state) => state.getUserInfo);
  const getPublicWebsite = useSelector((state) => state.getPublicWebsite);
  const getAllProducts = useSelector((state) => state.getAllProducts);
  const getWebsiteService = useSelector((state) => state.getWebsiteService);

  useEffect(() => {
    if (publicWebsite && publicWebsite.session && publicWebsite.session.status) {
      toast.success(publicWebsite && publicWebsite.session && publicWebsite.session.message);
      setAppointmentModal(false);
      dispatch({ type: ADD_WEBSITE_SETTING_RESET })
    } else if (publicWebsite && publicWebsite.session && !publicWebsite.session.status) {
      toast.error(publicWebsite && publicWebsite.session && publicWebsite.session.message);
      setAppointmentModal(false);
      dispatch({ type: ADD_WEBSITE_SETTING_RESET })
    }
  }, [publicWebsite,dispatch]);
  
  useEffect(() => {
    dispatch(getWebsiteSettingActionById(getUserInfo && getUserInfo.userInfo && getUserInfo.userInfo.data && getUserInfo.userInfo.data._id))
  }, [getUserInfo, publicWebsite, dispatch])

  useEffect(() => {
    dispatch(getWebsiteServiceActionById(getUserInfo && getUserInfo.userInfo && getUserInfo.userInfo.data && getUserInfo.userInfo.data._id))
    const formData = {
      "pageNumber": 1,
      "pageSize": 9,
      "filter": [],
      "minPrice": 10,
      "maxPrice": 10000,
      'name': getUserInfo && getUserInfo.userInfo && getUserInfo.userInfo.data && getUserInfo.userInfo.data.name
    }
    dispatch(getAllProductsAction(formData));
  }, [getUserInfo, dispatch, getPublicWebsite])

  useEffect(() => {
    if (getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.workHour && getPublicWebsite.websiteInfo.data.workHour.length > 0) {
      setWeekDays(getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.workHour);
      setHeader(getPublicWebsite.websiteInfo.data.websiteTitle)
      setSubHeader(getPublicWebsite.websiteInfo.data.websiteSubTitle)
      // setProductText(getPublicWebsite.websiteInfo.data.productText)
      // setServiceText(getPublicWebsite.websiteInfo.data.serviceText)
      // setHourText(getPublicWebsite.websiteInfo.data.hourText)
      // setHourPara(getPublicWebsite.websiteInfo.data.hourPara)
      // setContactText(getPublicWebsite.websiteInfo.data.contactText)
      // setContactPara(getPublicWebsite.websiteInfo.data.contactPara)
    } else {
      setWeekDays(WeekDaysArray)
    }
  }, [getPublicWebsite])

  useEffect(()=>{
		if(getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.status){
			setColor(getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.bgColor)
			}
	},[])


  const handleHeaderClick = () => {
    setClickHeader(false)
    if (header === "") {
      console.log("error")
    }
    else {
      let fileData = new FormData();
      fileData.append('websiteTitle', header);
      dispatch(addWebsiteSettingAction(fileData))
    }
  }


  const handleSubHeaderClick = () => {
    setClickSubHeader(false)
    if (subHeader === "") {
      console.log("error")
    }
    else {
      let fileData = new FormData();
      fileData.append('websiteSubTitle', subHeader);
      dispatch(addWebsiteSettingAction(fileData))
    }
  }

  const handleWorkHourSubmit = (e) => {
    e.preventDefault();
    let fileData = new FormData();
    fileData.append('workHour', JSON.stringify(weekDays));
    dispatch(addWebsiteSettingAction(fileData))
  }

  const handleEditService = (item) => {
    setServiceModal(!serviceModal)
    setName(item.serviceName);
    setIcon(item.serviceIcon);
    setDesc(item.ServiceDesc)
  }


  const handleChangeImage = (e) => {
    e.preventDefault()
    let fileData = new FormData();
    fileData.append('websiteLogoImageURL', e.target.files[0]);
    dispatch(addWebsiteSettingAction(fileData))
  }

  const handleChangeBannerImage = (e) => {
    e.preventDefault()
    let fileData = new FormData();
    fileData.append('websiteBannerImageURL', e.target.files[0]);

    dispatch(addWebsiteSettingAction(fileData))
  }

  const handleProductClick = () => {
    setClickProduct(false)
    if (productText === "") {
      console.log("error")
    }
    else {
      let fileData = new FormData();
      fileData.append('productText', productText);
      dispatch(addWebsiteSettingAction(fileData))
    }
  }

  const handleServiceClick = () => {
    setCLickService(false)
    if (serviceText === "") {
      console.log("error")
    }
    else {
      let fileData = new FormData();
      fileData.append('serviceText', serviceText);
      dispatch(addWebsiteSettingAction(fileData))
    }
  }

  const handleHourTextClick = () => {
    setClickHourText(false)
    if (hourText === "") {
      console.log("error")
    }
    else {
      let fileData = new FormData();
      fileData.append('hourText', hourText);
      dispatch(addWebsiteSettingAction(fileData))
    }
  }

  const handleHourParaClick = () => {
    setClickHourPara(false)
    if (hourPara === "") {
      console.log("error")
    }
    else {
      let fileData = new FormData();
      fileData.append('hourPara', hourPara);
      dispatch(addWebsiteSettingAction(fileData))
    }
  }

  const handleContactTextClick = () => {
    setClickContactText(false)
    if (contactText === "") {
      console.log("error")
    }
    else {
      let fileData = new FormData();
      fileData.append('contactText', contactText);
      dispatch(addWebsiteSettingAction(fileData))
    }
  }

  const handleContactParaClick = () => {
    console.log(contactPara)
    setClickContactPara(false)
    if (contactPara === "") {
      console.log("error")
    }
    else {
      let fileData = new FormData();
      fileData.append('contactPara', contactPara);
      dispatch(addWebsiteSettingAction(fileData))
    }
  }

  const handleAppearanceBarTextClick = () => {
    setClickAppearanceBarText(false)
    if (appearanceBarText === "") {
      console.log("error")
    }
    else {
      let fileData = new FormData();
      fileData.append('appearanceBarText', appearanceBarText);
      dispatch(addWebsiteSettingAction(fileData))
    }
  }

  const handleAppearanceBarParaClick = () => {
    setClickAppearanceBarPara(false)
    if (appearanceBarPara === "") {
      console.log("error")
    }
    else {
      let fileData = new FormData();
      fileData.append('appearanceBarPara', appearanceBarPara);
      dispatch(addWebsiteSettingAction(fileData))
    }
  }

  const handleGotoWebsite = () => {
    window.open(`/#/salon/${getUserInfo && getUserInfo.userInfo && getUserInfo.userInfo.data && getUserInfo.userInfo.data._id}`);
    // history.push(`/salon/${getUserInfo && getUserInfo.userInfo && getUserInfo.userInfo.data && getUserInfo.userInfo.data.name}`);
  }


  const handleColorUpdate = () =>{
    showColorPallete(false)
    if (color === "") {
      console.log("error")
    }
    else {
      let fileData = new FormData();
      fileData.append('bgColor', color);
      dispatch(addWebsiteSettingAction(fileData))
    }
  }

  return (
    <Content
      headerTitle="Appearance"
      addBtn={true}
      websiteSettings={true}
      addBtnClick={handleGotoWebsite}
      addBtnText="Go To Website"
      addBtnIcon="sphere"
      showAppointment={false}
      containerStyle={{backgroundColor: 'white'}}
    >
      {getPublicWebsite && getPublicWebsite.loading ?
        <Spinner />
        :
        <>
        <div className='screen-container' style={{height:'10vh',marginBottom:'2rem',padding:'1rem',display:'flex',gap:'1rem',position:'relative'}}>
          <div className='colorPalletText'>
            <h3>Change Color</h3>
            <div style={{display:'flex', gap:'1rem'}}>
            <input onClick={()=>showColorPallete(!colorPallete)} onChange={(e)=>setColor(e.target.value)} type="text" value={color} placeholder="Select color"></input>
            <Button
          varient="primary"
          style={{
            width: '10rem',
            justifyContent: 'center',
            backgroundColor:color,
            height:'3rem'
          }}
          label="Update"
          // icon="arrow_right"
          onClick={handleColorUpdate}
        />
            </div>
          </div>
        {colorPallete &&  
        <div className="colorPallete" >
        <SketchPicker
        color={ color }
        onChangeComplete={ (color)=>setColor(color.hex) }
      /> 
      </div>}
        </div>
        <div className='screen-container'>
          <Navbar
            data={{
              logoModal, setLogoModal,
              imageSrc,
              setImageSrc,
              imageSrcError,
              setImageSrcError,
              uploadFileData,
              setUploadFileData,
              uploadFileDataError,
              setUploadFileDataError,
              handleChangeImage,
              color:color,
              logo: getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.websiteLogoImageURL
            }} />
          <AppearanceBar data={{
            clickAppearanceBarPara,
            setClickAppearanceBarPara,
            appearanceBarText,
            setAppearanceBarText,
            appearanceBarPara,
            setAppearanceBarPara,
            clickAppearanceBarText,
            setClickAppearanceBarText,
            handleAppearanceBarParaClick,
            handleAppearanceBarTextClick,
            color:color,
            title: getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.appearanceBarText,
            subTitle: getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.appearanceBarPara,
          }} />
          <AppearanceBanner
            data={{
              setClickHeader,
              clickheader,
              clickSubHeader,
              setClickSubHeader,
              handleHeaderClick,
              handleSubHeaderClick,
              setHeader,
              setSubHeader,
              clickButton,
              setClickButton,
              buttonText,
              setButtonText,
              bannerImage,
              setBannerImage,
              handleChangeBannerImage,
              color:color,
              bannerImg: getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.websiteBannerImageURL,
              title: getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.websiteTitle,
              subTitle: getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.websiteSubTitle,
            }} />
          <AppearanceProduct
            data={{
              getAllProducts,
              clickProduct,
              setClickProduct,
              productText,
              setProductText,
              handleProductClick,
              color:color,
              productTitle: getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.productText
            }} />
          <AppearanceServices
            data={{
              serviceModal,
              setServiceModal,
              setIsUpdate,
              serviceDeleteModal,
              setServiceDeleteModal,
              handleEditService,
              getWebsiteService,
              clickService,
              setCLickService,
              serviceText,
              setServiceText,
              handleServiceClick,
              color:color,
              serviceTitle: getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.serviceText
            }} />
          <AppearanceAppointment data={{
            appointmentModal, setAppointmentModal, getPublicWebsite,
            clickHourText,
            setClickHourText,
            clickHourPara,
            setClickHourPara,
            hourText,
            setHourText,
            hourPara,
            setHourPara,
            handleHourTextClick,
            handleHourParaClick,
            color:color,
            phone: getUserInfo && getUserInfo.userInfo && getUserInfo.userInfo.data && inputPhoneMasking(getUserInfo.userInfo.data.phone),
            hourTitle: getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.hourText,
            hourSubTitle: getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.hourPara,
          }} />
          <AppearanceContact
            data={{
              clickContactText,
              setClickContactText,
              clickContactPara,
              setClickContactPara,
              contactText,
              setContactText,
              contactPara,
              setContactPara,
              handleContactTextClick,
              handleContactParaClick,
              color:color,
              contactTitle: getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.contactText,
              contactSubTitle: getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.contactPara,
            }} />
          <Fragment>
            {/* <div className="chat_section" id="contactus">
            <h1 className="servies_main_heading">LET'S CHAT!</h1>
            <p className="chat_subheading">We would love to learn about your project</p>
          </div> */}
            {/* <div className="chat_contact_details">
            <div className="calling">
              <div className="our_services_logo">
                <svg className="filter__input--icon1">
                  <use xlinkHref={`/assets/sprite.svg#icon-phone`} />
                </svg>
              </div>
              <div className='our_services_appearance_subheading'>
                <div className='appearnce-button-container'>
                <button className='appearance-btn' onClick={()=>setClickContact(!clickContact)}>
                  <svg className="table__button--icon">
                    <use xlinkHref={`/assets/sprite.svg#icon-edit`} />
                  </svg>
                </button>
                {clickContact && <button className='appearance-btn' onClick={handleContactClick}>
                SUBMIT
                </button>}
              </div>
                <h1 >
                  Call us at</h1>
                <h1>
                  {getUserInfo && getUserInfo.userInfo && getUserInfo.userInfo.data && inputPhoneMasking(getUserInfo.userInfo.data.phone)}
                </h1>
              </div>

            </div>
            <div className="calling">
              <div className="our_services_logo">
                <svg className="filter__input--icon1">
                  <use xlinkHref={`/assets/sprite.svg#icon-pin`} />
                </svg>
              </div>
              <div className='our_services_appearance_subheading'>
                <div className='appearnce-button-container'>
                <button className='appearance-btn'  onClick={() => setClickAddress(!clickAddress)}>
                  <svg className="table__button--icon">
                    <use xlinkHref={`/assets/sprite.svg#icon-edit`} />
                  </svg>
                </button>
                {clickAddress && <button className='appearance-btn' onClick={handleAddressClick}>
                SUBMIT
                </button>}
              </div>
                <h1>
                  {getUserInfo && getUserInfo.userInfo && getUserInfo.userInfo.data && getUserInfo.userInfo.data.address}
                </h1></div>
            </div>
            <div className="calling">
              <div className="our_services_logo">
                <svg className="filter__input--icon1">
                  <use xlinkHref={`/assets/sprite.svg#icon-email`} />
                </svg>
              </div>
              <div className='our_services_appearance_subheading'>
                <div className='appearnce-button-container'>
                <button className='appearance-btn'  onClick={() => setClickEmail(!clickEmail)}>
                  <svg className="table__button--icon">
                    <use xlinkHref={`/assets/sprite.svg#icon-edit`} />
                  </svg>
                </button>
                {clickEmail && <button className='appearance-btn' onClick={handleEmailClick}>
                SUBMIT
                </button>}
              </div>
                <h1>
                  Email us at </h1>
                <h1>
                  {getUserInfo && getUserInfo.userInfo && getUserInfo.userInfo.data && getUserInfo.userInfo.data.email}
                </h1>
              </div>
            </div>
          </div> */}

            <Footer
            color={color}
              phone={getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon.phone}
              address={getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon.address}
              email={getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon.email}
              salonName={getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon.name}
            />
          </Fragment>
          <div className="chat_section" id="contactus">
          </div>
        </div>
        </>
        
      }
      <ServiceModal
        serviceModal={serviceModal}
        setServiceModal={setServiceModal}
        isUpdate={isUpdate}
        name={name}
        icon={icon}
        desc={desc}
      />
      <DeleteService
        serviceModal={serviceDeleteModal}
        setServiceModal={setServiceDeleteModal}
      />
      <LogoModal
        data={{ logoModal, setLogoModal }}
      />
      <WorkHourModal
        data={{ appointmentModal, setAppointmentModal, weekDays, setWeekDays, handleWorkHourSubmit }}
      />

    </Content>
  )
}

export default AppearanceScreen