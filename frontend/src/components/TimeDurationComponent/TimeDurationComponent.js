import React, { useEffect, useState } from 'react';
import Styles from './TimeDurationComponent.module.css'

const TimeDurationComponent = ({ lunchTime, setLunchTime }) => {
    const [startHour, setStartHour] = useState(12);
    const [startMinute, setStartMinute] = useState('00');
    const [endHour, setEndHour] = useState(13);
    const [endMinute, setEndMinute] = useState('00');

    // Update state with lunch timings from user details
    useEffect(() => {
        if (lunchTime.lunchStartTime.value && lunchTime.lunchEndTime.value) {
            const [startHr, startMin] = lunchTime.lunchStartTime.value.split(':');
            const [endHr, endMin] = lunchTime.lunchEndTime.value.split(':');
            setStartHour(parseInt(startHr));
            setStartMinute(startMin);
            setEndHour(parseInt(endHr));
            setEndMinute(endMin);
        }
    }, [lunchTime]);

    
    const handleStartTimeChange = (e) => {
        const [hour, minute] = e.target.value.split(':');
        setStartHour(hour);
        setStartMinute(minute);
        updateLunchTimings(hour, minute, endHour, endMinute);
    };

    const handleEndTimeChange = (e) => {
        const [hour, minute] = e.target.value.split(':');
        setEndHour(hour);
        setEndMinute(minute);
        updateLunchTimings(startHour, startMinute, hour, minute);
    };
    const updateLunchTimings = (startHour, startMinute, endHour, endMinute) => {
        setLunchTime({
            lunchStartTime: { value: `${startHour}:${startMinute}`, error: '' },
            lunchEndTime: { value: `${endHour}:${endMinute}`, error: '' }
        });
    };
    // console.log(lunchTime)

    return (
        <div className={Styles.timeComponent} >
            <span>Lunch Time:</span>
            <div className={Styles.timeDurationLabel}>
                <label className={Styles.inputLabel} >
                    <input className={Styles.start_time}
                        type="time"
                        placeholder="HH:mm"
                        value={`${startHour.toString().padStart(2, '0')}:${startMinute}`}
                        onChange={handleStartTimeChange}
                    />
                </label>
                <span>to</span>
                <label>
                    <input className={Styles.end_time}
                        type="time"
                        placeholder="HH:mm"
                        value={`${endHour.toString().padStart(2, '0')}:${endMinute}`}
                        onChange={handleEndTimeChange}
                    />
                </label>
            </div>
            <div>
            <p>
            {/* Lunch Time: {lunchTime.lunchStartTime.value} to {lunchTime.lunchEndTime.value} */}
            </p>
            </div>

        </div>
    );
};

export default TimeDurationComponent;
