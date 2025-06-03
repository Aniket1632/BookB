import React, { useEffect } from 'react';
import InputBox from '../../components/formInputs/InputBox';
import Modal from '../../components/Modal';
import InputsSection from '../../components/Modal/InputsSectionColumn';
import InputsSectionColumn from '../../components/Modal/InputsSectionColumn';
import ModalButton from '../../components/Modal/ModalButton';
import ModalForm from '../../components/Modal/ModalForm';
import ModalHeading from '../../components/Modal/ModalHeading';
import formStyle from './form.module.css';
import SignatureCanvas from 'react-signature-canvas';

const FormScreen2 = ({ data }) => {

	const {
		salonSignature,
		salonSignatureDate,
		salonSignatureDateError,
		setSalonSignature,
		setSalonSignatureDate,
		setSalonSignatureDateError,

		stylistSignature,
		stylistSignatureDate,

		selectUpdateModel,
		modalDoumentState,
		onFormModalClose,

		onFormHandler,

		// salonSignatureSrc,
		// setSalonSignatureSrc,
	} = data;



	// const onClearHandler = (e) => {
	// 	e.preventDefault();
	// 	setSalonSignatureSrc('');
	// 	setSalonSignatureDate('');
	// 	if (salonSignature) {
	// 		salonSignature.clear();
	// 	}
	// }

	return (
		<Modal show={modalDoumentState}>
			<ModalHeading heading='INDEPENDENT CONTRACTOR AGREEMENT' onClose={onFormModalClose} />
			<ModalForm style={{ overflowY: 'scroll', maxHeight: '60rem' }}>
				<InputsSectionColumn>
					<div>
						<p className={formStyle.paragraphText}>
							THIS AGREEMENT (the “Agreement") is being made on , by and between
							&nbsp;	{selectUpdateModel && selectUpdateModel.salon && selectUpdateModel.salon.name}, located at &nbsp; {selectUpdateModel && selectUpdateModel.salon && selectUpdateModel.salon.address} (the “CONTRACTOR’).
							The full name, address, email address and phone number of both parties appear again at the end of this document.
						</p>
						<p className={formStyle.paragraphText}>
							By their respective signatures at the bottom of this document both parties hereby acknowledge that they have read and understood all the terms contained herein and that they have the authority to bind themselves and their respective companies to the terms contained in this Agreement.
							Work To Be Perrormeo, CONTRACTOR hereby agrees to work for CLIENT as an independent contractor, providing the services described below starting on or about and for an indefinite period thereafter, until CONTRACTOR's services are no longer needed by CLIENT.
							The CLIENT shall have the right to terminate CONTRACTOR's services at any time it deems appropriate provided CLIENT complies with the relevant notice provisions of this Agreement.
						</p>
						<p className={formStyle.paragraphText}>
							The CONTRACTOR agrees to devote the necessary amount of time, energy and attention required to satisfactorily complete, conclude or achieve the following duties and responsibilities (‘Description of Services"):
						</p>
						<ul className={formStyle.paragraphText} style={{ listStyle: 'none', marginLeft: '3rem' }}>
							<li>-Consultations  </li>
							<li>-Fitness Assessments  </li>
							<li>-1-on-1 Training  </li>
							<li>-Semi-Private Training  </li>
							<li>-Group Training  </li>
							<li>-Physical Therapy  </li>
							<li>-Massage Therapy </li>
						</ul>
						<p className={formStyle.paragraphText}>
							<strong> <u> SCORE OF WORK. </u> </strong> CONTRACTOR's required services as stated herein, as well as any future assignments provided by CLIENT, shall be determined on a case-by-case basis only.
							CLIENT shall be under no legal obligation to guarantee CONTRACTOR any minimum number of assignments or any minimum number of hours of work.
							All work performed by CONTRACTOR for CLIENT shall be governed exclusively by the covenants contained in this Agreement.
							The CONTRACTOR shall perform any and all responsibilities and duties that may be associated within the Description of Services set for above, including, but not limited to, work which may already be in progress.
							The CONTRACTOR shall retain sole and absolute discretion in the manner and means for the carrying out of his/her activities and responsibilities contained in this Agreement,
							and shall have full discretion within the Scope of Work, but shall not engage in any activity which is not expressly set forth by this Agreement without first obtaining prior written authorization from CLIENT.
						</p>
						<p className={formStyle.paragraphText}>
							<strong> <u>INDEPENDENT CONTRACTOR. </u> </strong>
							CONTRACTOR and CLIENT specifically agree that the CONTRACTOR is performing the services described in this Agreement as an independent contractor and shall not be deemed an employee, partner, agent, or joint venturer of CLIENT under any circumstances.
							Nothing in this Agreement shall be construed as creating an employer- employee relationship.
							The CONTRACTOR shall not have the authority to bind the CLIENT in any manner, unless specifically authorized to do so in writing.
							The CONTRACTOR shall have no claim against CLIENT hereunder or otherwise for vacation pay, sick leave, retirement benefits, social security, worker's compensation, health or disability benefits, unemployment insurance benefits, or employee benefits of any kind.
							CONTRACTOR further agrees to be responsible for all of his/her own federal and state taxes, withholdings, and acknowledges that CLIENT will not make any FICA payments on CONTRACTOR's behalf.
							CONTRACTOR shall pay all taxes incurred while performing services under this Agreement—including all applicable income taxes and, if CONTRACTOR is not a corporation, self-employment (Social Security) taxes.
							The CONTRACTOR further acknowledges and recognized that s/he shall complete and return to the CLIENT an IRS Form 1099 and related tax statements.
							The CONTRACTOR herein pledges and agrees to indemnify the CLIENT for any damages or expenses, including any related attorney's fees and legal expenses, incurred by the CLIENT as a result of CONTRACTOR's failure to make such required payments.
							Upon demand, CONTRACTOR shall provide CLIENT with proof that such payments have been made.
						</p>
						<p className={formStyle.paragraphText}>
							<strong> <u>EQUIPMENT & MEANS OF SERVICES.</u> </strong>
							CONTRACTOR is responsible for providing all of his/her own equipment with which to complete the services contemplated by this Agreement.
							The CLIENT may, in its sole discretion, provide certain equipment if deemed necessary for a particular assignment or task without thereby creating a duty on CLIENT's part to do so again in the future.
							CONTRACTOR has the sole right to control and direct the means, manner, and method by which the services required herein will be performed.
							CONTRACTOR shall select the routes taken, days he/she is available to work, and manner in which the work is to be performed.
							CONTRACTOR shall always perform the work him/herself and does not have the right to refer any given assignment to an employee or subcontractor without prior written approval from CLIENT.
							The CONTRACTOR shall not receive any training from CLIENT in the professional skills necessary to perform the services required by this Agreement.
							Any directions or advice provided to the CONTRACTOR regarding the Description of Services shall be considered a suggestion only and not an instruction.
						</p>
						<p className={formStyle.paragraphText}>
							<strong> <u>COMPENSATION.</u> </strong>
							In consideration for the services to be performed by the CONTRACTOR, CLIENT hereby agrees to pay CONTRACTOR as follows:
						</p>
						<p className={formStyle.paragraphText}>
							Compensation Terms: The Independent Contractor shall be entitled to full compensation for their performance of those tasks, responsibilities, and/or duties related to the Scope of Work as follows:
						</p>
						<p className={formStyle.paragraphText}>
							Compensation Terms: All Stylists will be compensated by their clients directly and will pay &nbsp;	{selectUpdateModel && selectUpdateModel.salon && selectUpdateModel.salon.name} for each session serviced by the first of each month.
						</p>
						<p className={formStyle.paragraphText}>
							$10 per 1-on-1 session <br />
							$7.50 PER PERSON in semi-private or group sessions
						</p>
						<p className={formStyle.paragraphText}>
							Additionally, 5% of each Stylist's monthly session total must be added to monthly fees for maintenance and utilities.
						</p>
						<p className={formStyle.paragraphText}>
							Rent payments are to be paid to &nbsp;	{selectUpdateModel && selectUpdateModel.salon && selectUpdateModel.salon.name} ON THE FIRST OF EACH MONTH and no later than the 5th of each month.
						</p>
						<p className={formStyle.paragraphText}>
							Total Compensation Amount: 0.00
						</p>
						<p className={formStyle.paragraphText}>
							Said compensation shall become due and payable to the CONTRACTOR upon receipt of an invoice by the CLIENT.
							The invoice must include the following information: (a) an invoice number; (b) the dates or assignments covered by the invoice; and (c) a description of the work performed.
							CONTRACTOR's invoices shall be payable pursuant to the following schedule and method:
						</p>
						<p className={formStyle.paragraphText}>
							Compensation Schedule: N/A <br />
							Compensation Method: N/A
						</p>
						<p className={formStyle.paragraphText}>
							<strong> <u>EXPENSES. </u> </strong>
							CONTRACTOR shall be responsible for all expenses incurred while performing services under this Agreement.
							This includes but is not limited to, automobile, truck, and other travel expenses; vehicle maintenance and repair costs; vehicle and other license fees and permits;
							insurance premiums; road, fuel, and other taxes; fines; radio, pager, or cell phone expenses; meals; and all salary, expenses, and other compensation paid to
							employees or contract personnel the CONTRACTOR hires to assist on the work contemplated by this Agreement.
						</p>
						<p className={formStyle.paragraphText}>
							<strong> <u>CONTRACTOR'S REPRESENTATIONS AND WARRANTIES.</u> </strong>
							The CONTRACTOR hereby represents that s/he has complied with all Federal, State and local laws regarding business permits, licenses, reporting requirements, tax withholding requirements, and other legal requirements of any kind that may be required to carry out the services contemplated by this Agreement and shall provide proof of same upon request by the CLIENT.
							The CONTRACTOR also represents and warrants that his/her relationship with the CLIENT will not cause or require that s/ne breach any obligation or confidence related to any confidential, trade secret and/or proprietary information of any other person, company or entity.
							Furthermore, the CONTRACTOR acknowledges that s/he has not brought and will not bring or use in the performance of his or her duties for the CLIENT any proprietary or confidential information, whether or not in writing, of a former contracted company or other entity without that entity's written permission or authorization.
							The breach of this condition shall result in automatic termination of the relationship as of the time of the occurring breach.
						</p>
						<p className={formStyle.paragraphText}>
							<strong> <u>
								DEFINITION OF "PROPRIETARY INFORMATION."
							</u> </strong>
							For the purpose of this Agreement, "Proprietary Information" shall include, but is not limited to, any information, observation, data, written materials, records, documents, drawings, photographs, layouts, computer programs, software, multi-media, social media, firmware, inventions, discoveries, improvements, developments, tools, machines, apparatus, appliances, designs, work products, logo, system, promotional ideas and material, customer lists, customer files, needs, practices, pricing information, process, test, concept, formulas, method, marketing information, technique, trade secrets, products and/or research related to the actual or anticipated research development, products, organization, marketing, advertising, business or finances of the CLIENT, its affiliates, subsidiaries or other related entities.
							The CONTRACTOR herein acknowledges that the CLIENT has made, or may make, available to the CONTRACTOR its Proprietary Information including, without limitation, trade secrets, inventions, patents and copyrighted materials.
							The CONTRACTOR acknowledges that this information has economic value, actual or potential value, that is not generally known to the public or to others who could obtain economic value from its disclosure or use, and that this information is subject to a reasonable effort by the CLIENT to maintain its secrecy and confidentiality.
							The CONTRACTOR shall comply with any reasonable rules established from time to time by the CLIENT for the protection of the confidentiality of any Proprietary Information.
						</p>
						<p className={formStyle.paragraphText}>
							<strong> <u>
								OWNERSHIP OF SOCIAL MEDIA.
							</u> </strong>
							The CLIENT shall have sole ownership over any social medial contacts acquired throughout the CONTRACTOR's term of service, including, but not limited to: "followers"
							or "friends" which may be or have been acquired through such accounts as email addresses, blogs, Twitter, Facebook, YouTube or any other social media network that has been used or created on behalf of the CLIENT.
						</p>
						<p className={formStyle.paragraphText}>
							<strong> <u>RETURN OF PROPRIETARY INFORMATION.</u> </strong>
							Any and all documents, records and books which may be related to the Description of Services as set forth in this Agreement, or any other Proprietary Information shared with CONTRACTOR,
							shall be maintained by the CONTRACTOR at his/her principal place of business and be open to inspection by the CLIENT during regular working business hours.
							The documents, records and books which the CLIENT shall have the right to inspect and receive copies of include, but are not limited to, any and all contract documents, any change or purchase orders, and any other items related to the work which has been authorized by the CLIENT on an existing or a potential project related to the services contemplated by this Agreement.
							Upon termination of this Agreement, or upon the request of CLIENT, the CONTRACTOR shall promptly and immediately deliver to CLIENT any and all property in its possession or under its care and control, including but not limited to, documents, records, or books, or any other Proprietary Information such as customer names and lists, trade secrets and intellectual property, or items such as computers, equipment, pass keys, tools, plans, recordings, software, and all related records or accounting/financial information.
							CONTRACTOR acknowledges that any breach or threatened breach of this Section of the Agreement will result in irreparable harm to CLIENT for which monetary damages could be an inadequate remedy.
							Therefore, CLIENT shall be entitled to equitable relief, including an injunction, in the event of such breach or threatened breach by CONTRACTOR as outlined in this Agreement.
							Such equitable relief shall be in addition to CLIENT's rights and remedies otherwise available at law.
						</p>
						<p className={formStyle.paragraphText}>
							<strong> <u>PATENT APPLICATIONS</u> </strong>
							Excluded from this Agreement are any inventions and/or improvements which are related to the CLIENT's business that were made by the CONTRACTOR prior to commencement of this Agreement as follows: (i) as embodied in the United States Letters Patent or any application for a United States Letters Patent that was filed prior to commencement of this Agreement; or (ii) one in the possession of a former company who has already applied and who now owns the invention; or (ili) as set forth in any attachment hereto.
							Except as otherwise noted on the back of the signature page hereof, there are no inventions heretofore made or conceived by the CONTRACTOR that s/he deems to be excluded from the scope of this Agreement and CONTRACTOR hereby releases the CLIENT from any and all claims by the CONTRACTOR by reason of any use by CLIENT of any invention heretofore made or conceived by the CONTRACTOR.
						</p>
						<p className={formStyle.paragraphText}>
							<strong> <u>EXCIUSIVITY, MARKETING AND ADVERTISING.</u> </strong>
							CONTRACTOR understands that while working on an assignment provided by CLIENT he/she represents CLIENT and not any other business, including his/her own business.
							While on assignment for CLIENT, CONTRACTOR shall not advertise his/her own business, shall not solicit work for him/herself, and shall only distribute CLIENT's business cards, name, and marketing materials.
							While not on one of CLIENT's assignments, CONTRACTOR may pursue other work for him/herself as long as it does not directly compete with CLIENT as described in this Agreement.
						</p>
						<p className={formStyle.paragraphText}>
							<strong> <u>
								CLIENT'S RIGHT TO SUSPEND OR ALTER WORK.
							</u> </strong>
							Ihe CLIENT reserves the right to inspect, stop and/or alter the work of the CONTRACTOR at any time to assure its conformity with this Agreement and the CLIENT's needs.
							At any time, the CLIENT may, without cause, direct the CONTRACTOR, by way of providing 14 Days days prior written notice,
							to suspend, delay or interrupt work or services pursuant to this Agreement, in whole or in part, for such periods of time as the CLIENT in its sole discretion may see fit or necessary.
							Any such suspension shall be effected by the delivery of a written notice to the CONTRACTOR of said suspension specifying the extent to which the performance of the work or
							services under this Agreement is suspended, and the date upon which the suspension becomes effective.
							The suspension of work and/or services shall be treated as an excusable delay.
							Moreover, if at any time the CLIENT believes that the CONTRACTOR may not be adequately performing its obligations under this Agreement or may be likely to fail to complete
							their work/services on time as required, then the CLIENT may request from the CONTRACTOR provide written assurances of performance and
							a written plan to correct observed deficiencies in performance.
							Any failure to provide such written assurances constitutes grounds to declare a default under this Agreement.
						</p>
						<p className={formStyle.paragraphText}>
							<strong> <u>
								TERMINATION.
							</u> </strong> Either party may terminate this Agreement in whole or in part, whenever the they shall determine that termination
							is in their best interest. Termination shall be effected by providing Odays written notice of termination specifying the extent to
							which performance of the work and/or services under this Agreement is terminated, and the date upon which such termination
							shall become effective. The CONTRACTOR shall then be entitled to recover any costs expended up to that point, but no other
							loss, damage, expense or liability may be claimed, requested or recovered except as provided in this Agreement. In no event
							shall the CLIENT be liable for any costs incurred by or on behalf of the CONTRACTOR after the effective date of the notice of
							termination. The termination pursuant to the provisions contained within this paragraph shall not be construed as a waiver of
							any right or remedy otherwise available to the CLIENT. In addition, if the CONTRACTOR its convicted of any crime or offense,
							fails or refuses to comply with the written policies or reasonable directive of CLIENT, is guilty of serious misconduct in
							connection with performance hereunder, or materially breaches any provisions of this Agreement, the CLIENT may terminate
							the engagement of the CONTRACTOR immediately and without prior written notice.
						</p>
						<p className={formStyle.paragraphText}>
							<strong> <u>
								EXECUTION.
							</u> </strong>  During and throughout the duration of this Agreement, and upon the request of and without any compensation other than that which is herein contained,
							the CONTRACTOR shall execute any documents and take action which the CLIENT may deem necessary or appropriate to ensure the implementation of all the provisions of this Agreement,
							including without limitation, assisting the CLIENT in obtaining and/or maintaining any patents, copyrights or similar rights to any Proprietary Information assigned and
							allocated to the CLIENT.
							The CONTRACTOR further agrees that the obligations and undertakings herein stated within this section shall continue beyond termination of this Agreement.
							Should the CONTRACTOR be called upon for any such assistance after termination, then the CONTRACTOR shall be entitled to fair and reasonable payment in addition
							to reimbursement of any expenses which may have been incurred at the request of the CLIENT.
							The CONTRACTOR nevertheless agrees to execute and deliver any agreements and documents prepared by the CLIENT and to do all other lawful acts required to establish,
							document and protect such rights.
						</p>
						<p className={formStyle.paragraphText}>
							<strong> <u>	INJUNCTIVE RELIEF.</u> </strong>
							CONTRACTOR hereby acknowledges (i) the unique nature of the protections and provisions established and contained within this Agreement; (ii) that the CLIENT will suffer irreparable harm if CONTRACTOR were to breach any of said protections or provisions or his/her obligations under this Agreement; and (iii) that monetary damages may be inadequate to compensate the CLIENT for such a breach.
							Therefore, if CONTRACTOR were to breach any of the provisions of this Agreement, then CLIENT shall be entitled to injunctive relief, in addition to any other remedies at law or equity, to enforce such provisions.
						</p>
						<p className={formStyle.paragraphText}>
							<strong> <u>
								LIABILITY.
							</u> </strong>
							CONTRACTOR warrants and acknowledges that he/she shall be liable for any loss or any other financial liability suffered by CLIENT due to CONTRACTOR's failure to perform an assignment as contemplated by this Agreement.
							Other than a documented medical emergency or an "Act of Nature" beyond CONTRACTOR's control, CONTRACTOR shall be solely responsible for any loss caused by CONTRACTOR's failure to perform.
							In addition, CLIENT shall not be liable for any loss or damage to CONTRACTOR's equipment under the terms of this Agreement.
							CONTRACTOR's equipment shall be CONTRACTOR's sole and exclusive responsibility.
						</p>
						<p className={formStyle.paragraphText}>
							<strong> <u>
								INDEMNIFICATION.
							</u> </strong>
							The CONTRACTOR shall defend, indemnify, hold harmless, and insure the CLIENT from any and all potential damages, expenses or liabilities which may result from or arise out of any negligence or misconduct on part of the CONTRACTOR, or from any breach or default of this Agreement which may be caused or occasioned by the acts of the CONTRACTOR.
							The CONTRACTOR shall also insure that all of its employees and affiliates take all actions necessary to comply with all the terms and conditions established and set forth in this Agreement.
						</p>
						<p className={formStyle.paragraphText}>
							<strong> <u>
								NOTICE.
							</u> </strong>
							Any and all notices, which may be required hereunder by any party to the other party, shall be executed by either personal delivery in writing, or by mail, registered or certified, postage pre-paid with a return receipt requested.
							Mailed notices must be addressed to the parties at the addresses contained in this Agreement.
							However, each party may change their address, thus requiring written notice of such change of address in accordance with this section.
							Any hand delivered notice shall be deemed communicated as of actual receipt; mailed notices shall be deemed communicated after five (5) days of mailing.
							The CONTRACTOR herein agrees to keep the CLIENT informed of any change of business and/or mailing addresses, as well as telephone, facsimile, email or any other relevant means of contact and communication.
						</p>
						<p className={formStyle.paragraphText}>
							<strong> <u>
								CONTINUING EFFECTS.
							</u></strong>
							The CONTRACTOR's obligations with regards to all trade secrets and confidential information contained in this Agreement, shall continue to be in effect beyond the scope of the relationship as aforementioned, and said obligations shall continue to be binding upon not only the CONTRACTOR, but also the spouse, affiliates, assigns, heirs, executors, administrators and/or other legal representatives as well.
						</p>
						<p className={formStyle.paragraphText}>
							<strong> <u>
								CHOICE OF LAW.
							</u></strong>
							This Agreement is to be construed pursuant to the current laws of the State of Colorado without giving effect to any conflict of laws principle.
							Jurisdiction and venue for any claim arising out of this Agreement shall be made in the State of Colorado, in the County of Douglas.
						</p>
						<p className={formStyle.paragraphText}>
							<strong> <u>
								MEDIATION, LITIGATION & ARBITRATION.
							</u></strong>
							If a dispute arises out of or relates to this Agreement, or the alleged breach thereof, and if the dispute is not settled through negotiation, the parties agree first to try in good faith to settle the dispute through mediation.
							The mediation process shall be administered by the Colorado Mediation Services, or another administrator mutually agreed between the parties, and shall be a condition precedent to resorting to arbitration, litigation, or some other dispute resolution procedure.
							If the mediation process is unsuccessful, either party shall have the option of seeking either arbitration or filing a legal action in a court of competent jurisdiction.
							If the aggrieved party seeks arbitration, then the dispute shall be submitted to binding arbitration by the American Arbitration Association in accordance with the Association's commercial rules then in effect.
							The arbitration shall be conducted in the state of Colorado and shall be binding on both parties.
							Judgment upon the award rendered by the arbitrator may be entered in any court having jurisdiction to do so.
							Costs of arbitration, including attorney fees, will be allocated by the arbitrator.
							If, alternatively, the aggrieved party seeks to file an action in court, then the action must be brought a court of competent jurisdiction in the State of Colorado.
						</p>
						<p className={formStyle.paragraphText}>
							<strong> <u>
								LEGAL FEES.
							</u></strong>
							Should any party initiate litigation, arbitration, mediation or any other legal proceeding ("Proceeding") against another party to enforce,
							interpret or otherwise seek to obtain legal or judicial relief in connection with this Agreement, the prevailing party in said proceeding shall be entitled
							to recover from the unsuccessful party any and all legal fees, cost, expenses, attorney's fees and any other cost or expense and fees arising from (i) such proceeding,
							whether or not such proceeding progresses to judgment, and (ii) any post-judgment or post-award proceeding, including without limitation, one to enforce any judgment
							or award resulting from any such Proceeding.
							Any such judgment or award shall contain a specific provision for the recovery of all such attorney's fees, costs, and expenses, as well as specific provisions for the recovery
							of all such subsequently incurred costs, expenses and actual attorney's fees.
						</p>
						<p className={formStyle.paragraphText}>
							<strong> <u>
								ENTIRE UNDERSTANDING.
							</u></strong>
							This document and any schedules attached hereto constitute the entire understanding and agreement of the parties, and any and all prior agreements,
							understandings, and representations are hereby terminated and canceled in their entirety and carry no further force or effect.
							This Agreement shall be considered a separate and an independent document of which it shall supersede any and all other Agreements, either oral or written,
							between the parties hereto, except for any separately signed Confidentiality, Trade Secret,
							Non-Compete or Non-Disclosure Agreements to the extent that these terms are not in conflict with those set forth herein.
						</p>

						<p className={formStyle.paragraphText}>
							<strong> <u>
								HEADINGS.
							</u></strong>
							The headings of the sections of this Agreement are inserted for convenience only and shall not be deemed to constitute part of this Agreement or
							to affect the construction thereof.
						</p>
						<p className={formStyle.paragraphText}>
							<strong> <u>
								SEVERABILITY.
							</u></strong>
							If any part of this Agreement is determined to be void, invalid, inoperative or unenforceable by a court of
							competent jurisdiction or by any other legally constituted body having jurisdiction to make such determination, such decision shall not affect any other provisions
							hereof and the remainder of this Agreement shall be effective as though such void, invalid, inoperative or unenforceable provision had not been contained herein.
						</p>
						<p className={formStyle.paragraphText}>
							<strong> <u>
								MODIFICATIONS  OR AMENDMENTS.
							</u></strong>
							No amendment, change or modification of this Agreement shall be valid unless in writing and signed by both parties hereto with the same degree
							of formality as this Agreement.
						</p>
						<p className={formStyle.paragraphText}>
							<strong> <u>
								COUNTERPARTS.
							</u> </strong>
							This Agreement, at the discretion of the parties herein, may be executed in counterparts, each of which shall be deemed
							an original and all of which together shall constitute a single integrated document.Waiver.lf either party fails to enforce any provision contained within this Agreement,
							it shall not be construed as a waiver or limitation of that party's right to subsequently enforce and compel strict compliance with every provision of this Agreement.
						</p>
						<p className={formStyle.paragraphText}>
							<strong> <u>
								DRAFTING and AMBIGUITIES.
							</u></strong>
							All parties to this Agreement have reviewed and had the opportunity to revise this Agreement,
							and have had the opportunity to have legal counsel review and or revise this Agreement.The rule of construction that
							ambiguities are to be resolved against the drafting party shall not be employed in the interpretation of this Agreement or of any amendments or exhibits herein.
						</p>
						<p className={formStyle.paragraphText}>
							<strong> <u>
								COPIES.
							</u></strong>
							Both the CONTRACTOR and the CLIENT hereby acknowledges that they have received a signed copy of this Agreement.
						</p>


						<p className={formStyle.paragraphText}>
							<strong>
								IN WITNESS WHEREOF </strong> the undersigned have executed this Agreement as of the day and year first written above.
							The parties hereto agree that facsimile signatures shall be as effective as if originals.<br />
						</p>
					</div>
				</InputsSectionColumn>
				<InputsSection>
					<div style={{ display: 'flex', gap: '2rem' }}>
						<div style={{ minWidth: '50rem' }}>
							{/* <div style={{ display: 'flex', backgroundColor: '#fff', borderRadius: '1rem' }}>
								{
									salonSignatureSrc ?
										<img alt='image' src={salonSignatureSrc} />
										:
										<SignatureCanvas penColor='black'
											canvasProps={{ width: 500, height: 150, className: 'sigCanvas' }}
											ref={(ref) => {
												setSalonSignature(ref);
											}}
										/>
								}
							</div> */}
							<p className={formStyle.paragraphText} style={{ display: 'flex', justifyContent: 'space-between' }}>
								David Hayes Plowman / Owner and Operator <br />
								Against the &nbsp;	{selectUpdateModel && selectUpdateModel.salon && selectUpdateModel.salon.name} <br />
								<button
									className={formStyle.signDataAddBtn}
									onClick={onClearHandler} >
									Clear
								</button>
							</p>
						</div>
						{/* <div className={formStyle.paragraphText} 
						style={{ display: 'flex', justifyContent: 'end', alignItems: 'start' , flexDirection:'column'}}>
							<InputBox
								label=''
								icon='calendar'

								placeholder='Salon Signature'
								value={salonSignatureDate}
								type='date'
								onChange={(event) => {
									setSalonSignatureDate(event.target.value);
									setSalonSignatureDateError('');
								}}
								errorMessage={salonSignatureDateError}
							/>
							Date <br />
							<br />
						</div> */}
					</div>
				</InputsSection>
				<InputsSection>
					<div style={{ display: 'flex', gap: '2rem' }}>
						<div style={{ minWidth: '50rem' }}>
							<div style={{ display: 'flex', backgroundColor: '#fff', borderRadius: '1rem' }}>
								{
									stylistSignature &&
									<img alt='image' src={stylistSignature} />
								}
							</div>
							<div className={formStyle.paragraphText} style={{ display: 'flex', justifyContent: 'space-between' }}>
								{selectUpdateModel && selectUpdateModel.name} <br />
								Independent Contractor / Title <br />
							</div>
						</div>
						<div className={formStyle.paragraphText} 
						style={{ display: 'flex', justifyContent: 'end', alignItems: 'start' , flexDirection:'column'}}>
							{
								stylistSignatureDate &&
								<InputBox
									label=''
									icon='calendar'
									placeholder='Stylist Signature'
									value={stylistSignatureDate}
									type='date'
									disabled={true}
								/>
							}
							Date <br />
						</div>
					</div>
				</InputsSection>
			</ModalForm>
			<div className={formStyle.modal__headingContainer} style={{ paddingLeft: '4rem' }}>
				<ModalButton label='Submit' icon='plus' onClick={onFormHandler} />
			</div>
		</Modal >
	);
};

export default FormScreen2;
