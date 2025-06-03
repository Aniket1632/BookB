import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Button from '../../components/formInputs/Button'
import Modal from '../../components/Modal'
import InputsSection from '../../components/Modal/InputsSection'
import ModalForm from '../../components/Modal/ModalForm'
import ModalHeading from '../../components/Modal/ModalHeading'
import InputBox from '../components/InputBox'
import { inputPhoneMasking, unMasking, validateEmail, validatePhone } from '../../utils/validators'
import { registerUserAction, webLogin } from '../../redux/actions/websiteSettingAction'
import { toast } from 'react-toastify'
import { CREATE_NEW_USER_RESET } from '../../redux/constants/userConstants'
import ModalButton from '../../components/Modal/ModalButton'

const CreateAccountModal = ({ data }) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const { modalCreateAccount, handleCreateAccountModalClose, handleLoginModalClose } = data;
    const createUser = useSelector((state) => state.createUser);
    const [name, setName] = useState({ value: '', error: '' });
    const [registerEmail, setRegisterEmail] = useState({ value: '', error: '' });
    const [registerPassword, setRegisterPassword] = useState({ value: '', error: '' });
    const [phone, setPhone] = useState({ value: '', error: '' });

    useEffect(
        () => {
            if (createUser && createUser.userInfo && createUser.userInfo.status) {
                toast.success(createUser.userInfo.message);
                dispatch({ type: CREATE_NEW_USER_RESET });
                dispatch(webLogin(registerEmail.value, registerPassword.value));
                handleCreateAccountModalClose()
                handleLoginModalClose()
            } else if (createUser && createUser.userInfo && !createUser.userInfo.status) {
                dispatch({ type: CREATE_NEW_USER_RESET });
                toast.error(createUser.userInfo.message);
            }
        },
        [createUser]
    );

    const registerUserHandler = (e) => {
        e.preventDefault();

        if (name.value === "") {
            setName({ error: "Please enter your Name" })
        } else if (registerEmail.value === "") {
            setRegisterEmail({ error: "Please enter your Email" })
        } else if (!validateEmail(registerEmail.value)) {
            setRegisterEmail({ error: "Invalid Email" })
        } else if (phone.value === "") {
            setPhone({ error: "Please enter your phone number." })
        } else if (!validatePhone(unMasking(phone.value))) {
            setPhone({ error: "Phone number must be of 10 digits." })
        } else if (registerPassword.value === "") {
            setRegisterPassword({ error: "Please select your gender" })
        }
        else {
            const formData = {
                name: name.value,
                email: registerEmail.value,
                phone: unMasking(phone.value),
                password: registerPassword.value
            }
            dispatch(registerUserAction(formData))
        }
    }

    return (
        <Modal show={modalCreateAccount}>
            <ModalHeading heading="Create Account" onClose={handleCreateAccountModalClose} />
            <ModalForm onSubmit={registerUserHandler} style={{ marginBottom: '2.5rem' }}>
                <InputsSection>
                    <InputBox
                        label="User Name"
                        icon="user"
                        placeholder="eg, John Doe"
                        value={name.value}
                        onChange={(event) => {
                            setName({ value: event.target.value, error: '' });
                        }}
                        errorMessage={name.error}
                    />
                    <InputBox
                        label="Email"
                        icon="email"
                        placeholder="eg, johndoe@example.com"
                        value={registerEmail.value}
                        onChange={(event) => {
                            setRegisterEmail({ value: event.target.value, error: '' });
                        }}
                        errorMessage={registerEmail.error}
                    />
                </InputsSection>
                <InputsSection >
                    <InputBox
                        label="Phone"
                        icon="phone"
                        type="text"
                        placeholder="eg, 123 456 7890"
                        value={phone.value}
                        onChange={(event) => {
                            setPhone({ value: inputPhoneMasking(event.target.value), error: '' });
                        }}
                        errorMessage={phone.error}
                    />
                    <InputBox
                        type='password'
                        placeholder='•••••••••••••'
                        value={registerPassword.value}
                        onChange={(e) => setRegisterPassword({ value: e.target.value })}
                        errorMessage={registerPassword.error}
                        label='Password'
                        icon='key'
                    />
                </InputsSection>

                <ModalButton
                    label='Create Account'
                    icon='arrow_right'
                    onClick={registerUserHandler}
                />
            </ModalForm>

        </Modal>
    )
}

export default CreateAccountModal