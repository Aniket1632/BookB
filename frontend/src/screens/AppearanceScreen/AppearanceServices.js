import React, { useEffect, useMemo, useState } from 'react'
import Button from '../../components/formInputs/Button'
import RoundCards from '../../website/CustomHomeScreen/RoundCards'
import './Appearance.css';

const AppearanceServices = ({ data }) => {
    const { serviceModal,
        setServiceModal,
        setIsUpdate,
        serviceDeleteModal,
        setServiceDeleteModal, handleEditService,
        getWebsiteService,
        clickService,
        setCLickService,
        serviceText,
        setServiceText,
        handleServiceClick,
        color,
        serviceTitle } = data

    const [categoryName, setCategoryName] = useState(null)


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

    var filteredList = useMemo(getFilteredList, [categoryName, getWebsiteService && getWebsiteService.session && getWebsiteService.session.data && getWebsiteService.session.data.result]);

    return (

        <div className="services" id="services_our">
            <div className="apperance_servies_heading">
                <div className='appearnce-button-container'>
                    <button className='appearance-btn' onClick={() => setCLickService(!clickService)}>
                        <svg className="table__button--icon">
                            <use xlinkHref={`/assets/sprite.svg#icon-edit`} />
                        </svg>
                    </button>
                    {clickService && <button className='appearance-btn' onClick={handleServiceClick}>
                        SUBMIT
                    </button>}
                </div>
                <h1 contentEditable={clickService ? true : false}
                onInput={(e) => setServiceText(e.target.innerText)}>{serviceTitle ? serviceTitle : "Our Service"}</h1>
            </div>
            {/* <h1 className="servies_main_heading">Our Services</h1> */}
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
                        filteredList && filteredList.length > 0 ?
                        filteredList.map((item, id) => (<RoundCards service={item} color={color} />)) : 
                        <div> Your services will be listed here.</div>
                    }
                </div>
            </div>
        </div>
        // <div className="appearance_services" id="services_our">
        //     <h1 className="servies_main_heading">Our Services</h1>
        //     <div className="our_services">
        //         <div className="our_appearance_services_outer">{
        //             ServiceArray && ServiceArray.map((item,index)=>(
        //                 <div className="our_appearance_services_inner">

        //                 <div className='appearnce-button-container'>
        //                     <button className='appearance-btn' onClick={()=>{setIsUpdate(true);handleEditService(item)}}>
        //                     <svg className="table__button--icon">
        //                         <use xlinkHref={`/assets/sprite.svg#icon-edit`} />
        //                     </svg>
        //                     </button>
        //                     <button className='appearance-btn' onClick={()=>{setServiceDeleteModal(!serviceDeleteModal)}}>
        //                     <svg className="table__button--icon">
        //                         <use xlinkHref={`/assets/sprite.svg#icon-delete`} />
        //                     </svg>
        //                 </button>


        //                 </div>
        //                 <div className="our_services_logo">
        //                     <svg className="filter__input--icon">
        //                         <use xlinkHref={`/assets/sprite.svg#${item.serviceIcon}`} />
        //                     </svg>
        //                 </div>
        //                 <h1 className="our_services_heading">{item.serviceName}</h1>
        //                 <p className="our_services_subheading">
        //                     {item.ServiceDesc}
        //                 </p>
        //             </div>

        //             ))
        //         }

        //             <div className="our_appearance_services_inner" onClick={()=>{setIsUpdate(false); setServiceModal(!serviceModal)}}>
        //                 <div className="our_services_logo">
        //                     <svg className="filter__input--icon">
        //                         <use xlinkHref={`/assets/sprite.svg#icon-plus2`} />
        //                     </svg>
        //                 </div>
        //                 <h1 className="our_services_heading">Add More..</h1>
        //             </div>
        //         </div>
        //     </div>
        // </div>

    )
}

export default AppearanceServices