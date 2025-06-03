import React from 'react';
import Button from '../formInputs/Button';

const ModalButton = ({ varient, label, icon, onClick }) => {
	return <Button varient={varient} label={label} icon={icon} onClick={onClick} style={{ borderRadius: '0.8rem' }} />;
};

export default ModalButton;
