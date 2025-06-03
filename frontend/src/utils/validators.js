export const validateOnlyChacters = (name) => {
	const re = /^[a-zA-Z \s]+$/;
	return re.test(name);
};

export const validatePassword = (password) => {
	const re = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[$@$!%*?&#])[A-Za-z\d$@$!%*?&#]{7,}$/;
	return re.test(password);
  };

export const validateEmail = (email) => {
	const re = /[a-zA-Z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
	return re.test(email);
};

export const validatePhone = (phone) => {
	// const re = /^[0-9]{10}$/;
	const re = /^[0-9]{10}$/;
	return re.test(phone);
};

export const validateUrl = (url) => {
	const re = /[(http(s)?):(www.)?a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.~#?&//=]*)/g;
	return re.test(url);
};

export const validateOnlyNumber = (name) => {
	const re = /^[0-9 \s]+$/;
	return re.test(name);
};



export const validateOnlyNumberDecimal = (name) => {
	const re = /^[+-]?([0-9]+\.?[5]*|\.[0-9]+)$/;
	return re.test(name);
};

export const numberMasking = (e) => {
	let value = e
	value = value.replace(/\D/g, "")
	// value = value.replace(/(\d{3})(\d)/,"$1-$2")
	// value = value.replace(/(\d{3})(\d)/,"$1-$2")
	value = value.substr(0, 12)

	return value
};

export const inputPhoneMasking = (e) => {
	let value = e
	if (value) {
		value = value.replace(/\D/g, "")
		value = value.replace(/(\d{3})(\d)/, "$1-$2")
		value = value.replace(/(\d{3})(\d)/, "$1-$2")
		value = value.substr(0, 12)
	}
	return value

};

export const cardMasking = (e) => {
	let value = e
	value = value.replace(/\D/g, "")
	value = value.replace(/(\d{4})(\d)/, "$1-$2")
	value = value.replace(/(\d{4})(\d)/, "$1-$2")
	value = value.replace(/(\d{4})(\d)/, "$1-$2")
	value = value.substr(0, 19)

	return value
}
export const expiryMasking = (e) => {
	let value = e
	value = value.replace(/\D/g, "")
	value = value.replace(/(\d{2})(\d)/, "$1-$2")
	value = value.substr(0, 2)

	return value
}
export const cvvMasking = (e) => {
	let value = e
	value = value.replace(/\D/g, "")
	value = value.replace(/(\d{3})(\d)/, "$1-$2")
	value = value.substr(0, 3)

	return value
}
export const zipcodeMask = (e) => {
	let value = e
	value = value.replace(/\D/g, "")
	value = value.replace(/(\d{5})(\d)/, "$1-$2")
	value = value.substr(0, 5)

	return value
}


export const unMasking = (e) => {
	let value = e
	value = value.replaceAll("-", "")

	return value
}

export const formatNumber = (num) => {
    if (num >= 1000) {
        const units = ['K', 'M', 'B', 'T'];

        const unitIndex = Math.floor((num / 1000).toString().length / 3) - 1;
        const shortenedNumber = num / Math.pow(1000, unitIndex + 1);

        // Round the number to one decimal place
        const roundedNumber = Math.floor(shortenedNumber * 10) / 10;

        return `${roundedNumber.toFixed(1)}${units[unitIndex]}`;
    } else {
        return num;
    }
};