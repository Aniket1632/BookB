import axios from 'axios';
import { BASE_URL } from './ip';

export const setSalonAppSetting = async (type, formData, token) => {
	try {
		const config = {
			headers: {
				token: token,
				'Content-Type': 'application/json'
			}
		};
		const { data } = await axios.post(`${BASE_URL}/app/add-app-setting?type=${type}`, formData, config);
		return data;
	} catch (error) {
		return error;
	}
};

export const getSalonAppSetting = async (type, token) => {
	try {
		const config = {
			headers: {
				token: token,
				'Content-Type': 'application/json'
			}
		};
		const { data } = await axios.get(`${BASE_URL}/app/get-app-setting?type=${type}`, config);
		return data;
	} catch (error) {
		return error;
	}
};
