import React from 'react'
import { useSelector } from 'react-redux';

const RoundCards = ({ service,color }) => { 

    const userData = useSelector((state) => state.getUserInfo);
    return (
        <>
            {
                service && service.subService && service.subService.map((item, id) =>
                    <div key={id} className="our_services_inner">
                        <div className='text_price' >
                            <h1 className="our_services_heading" style={{color:color}}>{item.title}</h1>
                            <p className="our_services_heading" style={{color:color}}>{item && item.charges ? 
                        userData && 
                        ( userData?.userInfo &&
                         userData?.userInfo?.data &&
                         userData?.userInfo?.data?.countryCode === '+971' ? 'AED ' : '$')
                         + item.charges : ""}</p>
                        </div>

                        <p className="our_services_subheading2">
                            {item.description}
                        </p>

                    </div>

                )
            }

        </>
    )
}

export default RoundCards