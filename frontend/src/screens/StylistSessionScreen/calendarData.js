
export const months = [
	{ index: 0, name: 'January', days: 31 },
	{ index: 1, name: 'February', days: 28 },
	{ index: 2, name: 'March', days: 31 },
	{ index: 3, name: 'April', days: 30 },
	{ index: 4, name: 'May', days: 31 },
	{ index: 5, name: 'June', days: 30 },
	{ index: 6, name: 'July', days: 31 },
	{ index: 7, name: 'August', days: 31 },
	{ index: 8, name: 'September', days: 30 },
	{ index: 9, name: 'October', days: 31 },
	{ index: 10, name: 'November', days: 30 },
	{ index: 11, name: 'December', days: 31 }
];


export const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const WeekDaysArray =  [
	{ day: 'Sun', slot: [{ startTime: "", endTime: "" }] },
	{ day: 'Mon', slot: [] },
	{ day: 'Tue', slot: [] },
	{ day: 'Wed', slot: [] },
	{ day: 'Thu', slot: [] },
	{ day: 'Fri', slot: [] },
	{ day: 'Sat', slot: [] },
];




export const getThisWeekDates = (current = new Date()) => {
	let weekDates = [];
	// Starting Monday not Sunday 
	let first = current.getDate() - current.getDay() + 1;
	current.setDate(first);
	for (let i = 0; i < 7; i++) {
		weekDates.push(new Date(+current));
		current.setDate(current.getDate() + 1);
	}

	return weekDates;
}


// export const WeekDays = [
// 	{ day: 'Sun', day: 'Sunday', slot: [{ startTime: "15:00", endTime: "20:00" }] },
// 	{ day: 'Mon', day: 'Monday', slot: [{ startTime: "15:00", endTime: "20:00" }] },
// 	{ day: 'Tue', day: 'Tuesday', slot: [{ startTime: "15:00", endTime: "20:00" }] },
// 	{ day: 'Wed', day: 'Wednesday', slot: [{ startTime: "", endTime: "" }] },
// 	{ day: 'Thu', day: 'Thursday', slot: [{ startTime: "", endTime: "" }] },
// 	{ day: 'Fri', day: 'Friday', slot: [{ startTime: "", endTime: "" }] },
// 	{ day: 'Sat', day: 'Saturday', slot: [{ startTime: "", endTime: "" }] },
// ];


