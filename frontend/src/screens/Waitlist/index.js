import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Content from '../../components/Content'
import './Waitlist.css'
import WaitlistTable from './WaitlistTable'

const Index = ({match}) => {
  const [updateWaitlistModal, setUpdateWaitlistModal] = useState(false)

  return (
    <Content
    headerTitle= {`${match.params.stylistName}'s Waitlist`}
    >
      <Link to={`/stylist-sessions/${match.params.stylistId}/${match.params.stylistName}`} style={{textDecoration: 'none', color:'var(--dark-grey)'}}>
        <h3>Back to Availabilities</h3>
      </Link>
    <WaitlistTable
    />
    </Content>


  )
}

export default Index