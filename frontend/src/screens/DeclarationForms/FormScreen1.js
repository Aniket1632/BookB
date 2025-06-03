import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../components/Modal';
import InputsSectionColumn from '../../components/Modal/InputsSectionColumn';
import ModalButton from '../../components/Modal/ModalButton';
import ModalForm from '../../components/Modal/ModalForm';
import ModalHeading from '../../components/Modal/ModalHeading';
import Spinner from '../../components/Spinner/Spinner';
import { getFormByWaierLiabilityAction } from '../../redux/actions/formActions';
import formStyle from './form.module.css';

const FormScreen1 = ({ data }) => {
	const dispatch = useDispatch();
	const { selectUpdateModelUser, modalDoumentState, onFormModalClose } = data;
	const getFormByWaierLiability = useSelector((state) => state.getFormByWaierLiability);
	useEffect(
		() => {
			if (selectUpdateModelUser && selectUpdateModelUser._id) {
				dispatch(getFormByWaierLiabilityAction(selectUpdateModelUser._id));
			}
		},
		[selectUpdateModelUser, dispatch]
	);


	return (
		<Modal show={modalDoumentState}>
			<ModalHeading heading='WAIVER AND RELEASE OF LIABILITY' onClose={onFormModalClose} />
			<ModalForm style={{ overflowY: 'auto', maxHeight: '60rem' }}>
				<InputsSectionColumn>
					{
						getFormByWaierLiability &&
							getFormByWaierLiability.loading ?
							<Spinner />
							:
							getFormByWaierLiability &&
								getFormByWaierLiability.userInfo &&
								getFormByWaierLiability.userInfo.data ?
								<img className={formStyle.agreementImage} width="100%" height="100%" alt='image' src={getFormByWaierLiability.userInfo.data.formURL} />
								: (
									<div className='not_data_found'>
										<h1>No data found !</h1>
									</div>
								)
					}
				</InputsSectionColumn>







				
				{/* <InputsSectionColumn>
					<p className={formStyle.paragraphText}>
						IN  CONSIDERATION  OF  the  risk  of  injury  that  exists  while  participating  in FITNESS
						ASSESSMENTS,  1-ON-1,  SEMI-
						PRIVATE, AND GROUP TRAINING (hereinafter the "Activity"); and
					</p>
					<p className={formStyle.paragraphText}>	IN CONSIDERATION OF my desire to participate in said Activity and being given the right to
						participate in same;
					</p>
					<p className={formStyle.paragraphText}>I  HEREBY,  for  myself,  my  heirs,  executors,  administrators,  assigns,  or  personal
						representatives  (hereinafter  collectively,
						"Releasor," "I" or "me", which terms shall also include Releasor's parents or guardian if Releasor
						is under 18 years of age),
						knowingly and voluntarily enter into this WAIVER AND RELEASE OF LIABILITY and hereby waive any and
						all rights, claims or
						causes of action of any kind arising out of my participation in the Activity; and
					</p>
					<p className={formStyle.paragraphText}>I  HEREBY  release  and  forever  discharge &nbsp;
						{selectUpdateModelUser && selectUpdateModelUser.salon && selectUpdateModelUser.salon.name},  located  at  {selectUpdateModelUser && selectUpdateModelUser.salon && selectUpdateModelUser.salon.address},  their  affiliates,  managers,  members,  agents,  attorneys,  staff,  volunteers,  heirs,
						representatives,  predecessors,
						successors and assigns (collectively "Releasees"), from any physical or psychological injury that I
						may suffer as a direct result
						of          my participation in the aforementioned Activity.
					</p>
					<p className={formStyle.paragraphText}>

						I  AM  VOLUNTARILY  PARTICIPATING  IN  THE  AFOREMENTIONED  ACTIVITY  AND  I  AM  PARTICIPATING  IN
						THE
						ACTIVITY ENTIRELY AT MY OWN RISK. I AM AWARE OF THE RISKS ASSOCIATED WITH PARTICIPATING IN THIS
						ACTIVITY,  WHICH  MAY  INCLUDE,  BUT  ARE  NOT  LIMITED  TO:  PHYSICAL  OR  PSYCHOLOGICAL  INJURY,
						PAIN,
						SUFFERING,  ILLNESS,  DISFIGUREMENT,  TEMPORARY  OR  PERMANENT  DISABILITY  (INCLUDING  PARALYSIS),
						ECONOMIC  OR  EMOTIONAL  LOSS,  AND  DEATH.  I  UNDERSTAND  THAT  THESE  INJURIES  OR  OUTCOMES  MAY
						ARISE  FROM  MY  OWN  OR  OTHERS' NEGLIGENCE,  CONDITIONS  RELATED  TO  TRAVEL  TO  AND  FROM  THE
						ACTIVITY,   OR FROM  CONDITIONS  AT  THE  ACTIVITY  LOCATION(S).  NONETHELESS,  I  ASSUME  ALL
						RELATED
						RISKS, BOTH KNOWN AND UNKNOWN TO ME, OF MY PARTICIPATION IN THIS ACTIVITY.
					</p>
					<p className={formStyle.paragraphText}>


						I FURTHER AGREE to indemnify, defend and hold harmless the Releasees against any and all claims,
						suits or actions of any
						kind whatsoever for liability, damages, compensation or otherwise brought by me or anyone on my
						behalf, including attorney's
						fees and any related costs.
					</p>
					<p className={formStyle.paragraphText}>

						I FURTHER ACKNOWLEDGE that Releasees are not responsible for errors, omissions, acts or failures to
						act of any party or
						entity  conducting  a  specific  event  or  activity  on  behalf  of  Releasees.  In  the  event
						that  I  should  require  medical  care  or
						treatment, I authorize  {selectUpdateModelUser && selectUpdateModelUser.salon && selectUpdateModelUser.salon.name} to provide all emergency medical care deemed necessary,
						including but not limited to, first
						aid, CPR, the use of AEDs, emergency medical transport, and sharing of medical information with
						medical personnel. I further
						agree to assume all costs involved and agree to be financially responsible for any costs incurred
						as a result of such treatment.
						I am aware and understand that I should carry my own health insurance.
					</p>
					<p className={formStyle.paragraphText}>

						I FURTHER ACKNOWLEDGE that this Activity may involve a test of a person's physical and mental
						limits and may carry with
						it the potential for death, serious injury, and property loss. I agree not to participate in the
						Activity unless I am medically able
						and  properly  trained,  and  I  agree  to  abide  by  the  decision  of  the  {selectUpdateModelUser && selectUpdateModelUser.salon && selectUpdateModelUser.salon.name}  official
						or  agent,  regarding  my  approval  to
						participate in the Activity.
					</p>
					<p className={formStyle.paragraphText}>

						I   HEREBY  ACKNOWLEDGE   THAT   I   HAVE   CAREFULLY   READ   THIS   "WAIVER  AND   RELEASE"  AND
						FULLY
						UNDERSTAND  THAT  IT  IS A RELEASE  OF  LIABILITY.  I  EXPRESSLY AGREE  TO  RELEASE AND  DISCHARGE
						{selectUpdateModelUser && selectUpdateModelUser.salon && selectUpdateModelUser.salon.name} AND  ALL  OF  ITS  AFFILIATES,  MANAGERS,  MEMBERS,  AGENTS,  ATTORNEYS,  STAFF,  VOLUNTEERS,
						HEIRS,  REPRESENTATIVES,  PREDECESSORS,  SUCCESSORS  AND  ASSIGNS,  FROM  ANY  AND  ALL  CLAIMS  OR
						CAUSES OF ACTION AND I AGREE TO VOLUNTARILY GIVE UP OR WAIVE ANY RIGHT THAT I OTHERWISE HAVE
						TO BRING A LEGAL ACTION AGAINST  {selectUpdateModelUser && selectUpdateModelUser.salon && selectUpdateModelUser.salon.name} FOR PERSONAL INJURY OR PROPERTY DAMAGE.
					</p>
					<p className={formStyle.paragraphText}>
						To  the  extent  that  statute  or  case  law  does  not  prohibit  releases  for  ordinary
						negligence,  this  release  is  also  for  such
						negligence on the part of  {selectUpdateModelUser && selectUpdateModelUser.salon && selectUpdateModelUser.salon.name}, its agents, and employees.
					</p>
					<p className={formStyle.paragraphText}>
						I agree that this Release shall be governed for all purposes by Colorado law, without regard to any
						conflict of law principles.
						This Release supersedes any and all previous oral or written promises or other agreements.
					</p>
					<p className={formStyle.paragraphText}>
						In the event that any damage to equipment or facilities occurs as a result of my or my family's or
						my agent's willful actions,
						neglect or recklessness, I acknowledge and agree to be held liable for any and all costs associated
						with any such actions of
						neglect or recklessness.
					</p>
					<p className={formStyle.paragraphText}>
						THIS WAIVER AND RELEASE OF LIABILITY SHALL REMAIN IN EFFECT FOR THE DURATION OF MY PARTICIPATION
						IN THE ACTIVITY, DURING THIS INITIAL AND ALL SUBSEQUENT EVENTS OF PARTICIPATION.
					</p>
					<p className={formStyle.paragraphText}>
						THIS AGREEMENT was entered into at arm's-length, without duress or coercion, and is to be
						interpreted as an agreement
						between two parties of equal bargaining strength. Both Participant,
						and {selectUpdateModelUser && selectUpdateModelUser.salon && selectUpdateModelUser.salon.name}  agree
						that this agreement is clear and unambiguous as to its terms, and that no other evidence shall be
						used or admitted to alter or
					</p>
					<p className={formStyle.paragraphText}>

						explain the terms of this agreement, but that it will be interpreted based on the language in
						accordance with the purposes for
						which it is entered into.
					</p>
					<p className={formStyle.paragraphText}>
						In the event that any provision contained within this Release of Liability shall be deemed to be
						severable or invalid, or if any
						term,  condition,  phrase  or  portion  of  this  agreement  shall  be  determined  to  be
						unlawful  or  otherwise  unenforceable,  the
						remainder of this agreement shall remain in full force and effect. If a court should find that any
						provision of this agreement to
						be invalid or unenforceable, but that by limiting said provision it would become valid and
						enforceable, then said provision shall
						be deemed to be written, construed and enforced as so limited.
					</p>
					<p className={formStyle.paragraphText}>

						In the event of an emergency, please contact the following person(s) in the order presented:
					</p>
					<table className='table'>
						<thead>
							<tr>
								<th>Emergency Contact</th>
								<th> Contact Relationship </th>
								<th>Contact Telephone</th>
								<th />
							</tr>
						</thead>
						<tbody>
							{getFormByWaierLiability &&
								getFormByWaierLiability &&
								getFormByWaierLiability.userInfo &&
								getFormByWaierLiability.userInfo.data &&
								getFormByWaierLiability.userInfo.data.emergency &&
								getFormByWaierLiability.userInfo.data.emergency.length > 0 &&
								getFormByWaierLiability.userInfo.data.emergency.map((d, index) => (
									<tr key={index}>
										<td className='textCapitalize'>{d.emergencyContact}</td>
										<td className='textCapitalize' style={{ textAlign: 'left' }}>{d.realtionship}</td>
										<td>{d.telephone}</td>
									</tr>
								))}
						</tbody>
					</table>
					<p className={formStyle.paragraphText}>
						I, THE UNDERSIGNED PARTICIPANT, AFFIRM THAT I AM OF THE AGE OF 18 YEARS OR OLDER, AND THAT I AM
						FREELY   SIGNING   THIS  AGREEMENT.   I   CERTIFY   THAT   I   HAVE   READ   THIS  AGREEMENT,
						THAT   I   FULLY UNDERSTAND ITS CONTENT AND THAT THIS RELEASE CANNOT BE MODIFIED ORALLY. I AM AWARE THAT THIS
						IS A RELEASE OF LIABILITY AND A CONTRACT AND THAT I AM SIGNING IT OF MY OWN FREE WILL.
					</p>
					<p className={formStyle.paragraphText}>
						Participant's Name:
						{
							getFormByWaierLiability &&
							getFormByWaierLiability.userInfo &&
							getFormByWaierLiability.userInfo.data &&
							<span> {getFormByWaierLiability.userInfo.data.participantName}</span>
						}
					</p>
					<p className={formStyle.paragraphText}>
						Participant's Address:
						{
							getFormByWaierLiability &&
							getFormByWaierLiability.userInfo &&
							getFormByWaierLiability.userInfo.data &&
							<span> {getFormByWaierLiability.userInfo.data.participantAddress}</span>
						}
					</p>
					<p className={formStyle.paragraphText}>
						Signature: <br />
						{
							getFormByWaierLiability &&
							getFormByWaierLiability.userInfo &&
							getFormByWaierLiability.userInfo.data &&
							<img width="200px" height="100px" alt='image' src={getFormByWaierLiability.userInfo.data.formURL} />
						}
					</p>
					<p className={formStyle.paragraphText}>
						Date:
					</p>
					<p className={formStyle.paragraphText}>
						PARENT / GUARDIAN WAIVER FOR MINORS
					</p>
					<p className={formStyle.paragraphText}>

						In the event that the participant is under the age of consent (18 years of age), then this release
						must be signed by a parent or
						guardian, as follows:
					</p>
					<p className={formStyle.paragraphText}>
						I HEREBY CERTIFY that I am the parent or guardian of
						, named above, and do hereby
						give my consent without reservation to the foregoing on behalf of this individual.
					</p>
					<p className={formStyle.paragraphText}>
						Parent I Guardian Name:

					</p>	<p className={formStyle.paragraphText}>
						Relationship to Minor:

					</p>
					<p className={formStyle.paragraphText}>
						Signature: <br />
						{
							getFormByWaierLiability &&
							getFormByWaierLiability.userInfo &&
							getFormByWaierLiability.userInfo.data &&
							<img width="200px" height="100px" alt='image' src={getFormByWaierLiability.userInfo.data.formURL} />
						}
					</p>
					<p className={formStyle.paragraphText}>

						Date:

					</p>

				</InputsSectionColumn> */}
			</ModalForm>
		</Modal>
	);
};

export default FormScreen1;
