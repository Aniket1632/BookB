import React from 'react'
import { useHistory } from 'react-router-dom'

const Stylist = ({ data }) => {
    const history = useHistory()
    return (
        <div className='dashboard_box'>
            <p className='dashboard_p'>Stylist</p>
            <div className='stylist_list'>
                {
                    data &&
                    data.length > 0 ?
                    
                    data && data.map((item, id) => (
                    <div key={id + 1} className='stylist_info' onClick={() => history.push(`stylist-sessions/${item && item.stylistData && item.stylistData._id}/${item && item.stylistData && item.stylistData.name}`)}>
                            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                <img 
                                src={item && item.stylistData && item.stylistData.photo} 
                                className='stylist_img' style={{ width: '5rem', height: '5rem' }}
                                />
                                <p className='stylist_text'>{item && item.stylistData && item.stylistData.name}</p>
                            </div>
                            <div className='stylist_count'>
                                Appointments: {item && item.count}
                            </div>
                        </div>
                    ))
                    :
                    <span className='dashboard_span'>No appointments to show</span>
                }
            </div>

        </div>
    )
}

export default Stylist