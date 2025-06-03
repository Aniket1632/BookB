import React from 'react'
import './Stars.css'

const Stars = ({ rating,color }) => {
  return (
    <div className="stars">
      <ul>
        <li className={rating >= 1 ? 'selected' : ''} style={rating >= 1 && {color:color}}>&#9733;</li>
        <li className={rating >= 2 ? 'selected' : ''} style={rating >= 2 &&{color:color} } >&#9733;</li>
        <li className={rating >= 3 ? 'selected' : ''} style={rating >= 3 &&{color:color}} >&#9733;</li>
        <li className={rating >= 4 ? 'selected' : ''} style={rating >= 4 &&{color:color}}>&#9733;</li>
        <li className={rating >= 5 ? 'selected' : ''}  style={rating =5 &&{color:color}}   >&#9733;</li>
      </ul>
    </div>
  );
}

export default Stars