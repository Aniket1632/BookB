import React from 'react';
import InputBox from '../../components/formInputs/InputBoxFogotPasswod';
import Modal from '../../components/Modal';
import ModalButton from '../../components/Modal/ModalButton';
import ModalForm from '../../components/Modal/ModalForm';
import ModalHeading from '../../components/Modal/ModalHeading';

const ChangePwdUser = ({ data }) => {
	const { modalChangePasswordState, onChangePwdModalClose, onChangePwdUserHandler, emailFPwd, setEmailFPwd } = data;

	return (
		<Modal show={modalChangePasswordState} style={{ background: '#ffffff' }}>
			<ModalHeading style={{color: 'black'}} heading='Password assistance' onClose={onChangePwdModalClose} />
			<ModalForm>
				<p className='modal__text' style={{ marginBottom: '0' , color: 'black'}}>
					Enter the email address associated with your salon account.{' '}
				</p>
				<br />
				<InputBox
					type='email'
					placeholder='eg, johndoe@example.com'
					value={emailFPwd.value}
					style={{ width: '100%', height: '5rem', color: 'black' }}
					onChange={(e) => setEmailFPwd({ value: e.target.value })}
					errorMessage={emailFPwd.error}
					label=''
					icon='email'
				/>
				<br />
				<p className='modal__text2'>We'll send the auto genrated password to user email address.</p>
				<ModalButton varient='danger' label='Reset Password' icon='key' onClick={onChangePwdUserHandler} />
			</ModalForm>
		</Modal>
	);
};

export default ChangePwdUser;
