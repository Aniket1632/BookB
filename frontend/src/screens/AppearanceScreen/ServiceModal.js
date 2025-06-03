import React from 'react'
import InputBox from '../../components/formInputs/InputBox'
import SelectBox from '../../components/formInputs/SelectBox'
import TextareaBox from '../../components/formInputs/TextareaBox'
import Modal from '../../components/Modal'
import InputsSection from '../../components/Modal/InputsSection'
import ModalButton from '../../components/Modal/ModalButton'
import ModalForm from '../../components/Modal/ModalForm'
import ModalHeading from '../../components/Modal/ModalHeading'

const ServiceModal = ({ serviceModal, setServiceModal, isUpdate, name, icon, desc }) => {
    return (
        <Modal show={serviceModal}>
            <ModalHeading heading={isUpdate ? "Update Service" : "Add Service"} onClose={() => setServiceModal(false)} />
            <ModalForm style={{ marginBottom: '2.5rem' }}>
                <InputsSection>
                    <InputBox
                        value={name}
                        label="Service Name"
                        icon="service"
                        placeholder="eg, Hair Cut"
                    />
                    <SelectBox
                        label="Select Service Icon"
                        value={icon}
                    >
                        <option disabled className="optionBox" value="">
                            Select Stylist
                        </option>
                        <option >
                            calendar
                        </option>
                    </SelectBox>
                </InputsSection>
                <InputsSection>
                    <TextareaBox
                        label="Service Description"
                        placeholder="Lorem Ipsum.."
                        value={desc}
                    >
                    </TextareaBox>
                </InputsSection>
                <ModalButton
                    label={isUpdate ? 'Update Service' : 'Add Service'}
                    icon={isUpdate ? 'edit' : 'plus'}
                />
            </ModalForm>
        </Modal>
    )
}

export default ServiceModal