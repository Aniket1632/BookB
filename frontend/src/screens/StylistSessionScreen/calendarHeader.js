

import React, { useState, useEffect, Fragment } from 'react';
import StylistSessionStyles from './StylistAvailability.module.css';

const CalendarHeader = ({ calendarRef, currentDayName, currentDate, currentMonth, currentYear, handleNextMonth, handlePreviousMonth }) => {
    const calendarApi = useState(calendarRef.current?.getApi());
    return (
        <div className={StylistSessionStyles.headers}>
            <div>
                <button className={StylistSessionStyles.prevNextBtn} onClick={() => calendarApi().prev()}>
                    &#10094; Prev
                </button>
                <button className={StylistSessionStyles.prevNextBtn} onClick={() => calendarApi().prev()}>
                    Next  &#10095;
                </button>
            </div>
            <p className={StylistSessionStyles.dayMonth}>
                {currentDayName + ' ' + currentDate}
                <span>
                    {currentMonth && currentMonth.name && currentMonth.name} {currentYear}
                </span>
            </p>
            <div>
                <button className={StylistSessionStyles.prevNextBtn} onClick={handleNextMonth}>
                    Month
                </button>
                <button className={StylistSessionStyles.prevNextBtn} onClick={handleNextMonth}>
                    Week
                </button>
                <button className={StylistSessionStyles.prevNextBtn} onClick={handleNextMonth}>
                    Day
                </button>
            </div>
        </div>
    )
}

export default CalendarHeader;