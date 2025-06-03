import React, { Fragment } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { updatePlanAction, deletePlanAction, createPlanAction } from '../../redux/actions/subscriptionAction';
import PackagesStyles from './Packages.module.css';
import AddPriceModal from './AddPriceModal';
import NoData from '../../website/components/NoData';

const PackagesCard = ({
	packages,
	getPackages,
	setEditPackageModal,
	setDeletePackageModal,
	onChangeHandler,
	editPackageHandler
}) => {
	const dispatch = useDispatch();
	const [addPlan, setAddPlan] = React.useState({ interval: '', data: {}, status: false });
	const [priceValue, setPriceValue] = React.useState({ value: '', error: '' });

	const handleAddPlan = async () => {
		const formData = {
			amount: priceValue.value * 100,
			currency: 'usd',
			interval: addPlan.interval,
			product: addPlan.data.id
		};
		const data = await dispatch(createPlanAction(formData));
		if (data && data.status) {
			handleAddPlanModalClose();
			toast.success(data.message);
			getPackages();
		} else {
			toast.error('Something went wrong.');
		}
	};

	const handleAddPlanModalClose = () => {
		setAddPlan({ interval: '', data: {}, status: false });
		setPriceValue({ value: '', error: '' });
	};

	const togglePriceStatus = async (status, id) => {
		const data = await dispatch(updatePlanAction(status, id));

		if (data && data.status) {
			toast.success(data.message);
			getPackages();
		} else {
			toast.error('Something went wrong.');
		}
	};

	const deletePrice = async (id) => {
		const data = await dispatch(deletePlanAction(id));

		if (data && data.status) {
			toast.success(data.message);
			getPackages();
		} else {
			toast.error('Something went wrong.');
		}
	};
	;
	return (
		<div className={PackagesStyles.pricing_cards}>
			{
				packages &&
					packages.data &&
					packages.data.data &&
					packages.data.data &&
					packages.data.data.length > 0 ?
					(packages.data.data.map((data) => (
						<div className={PackagesStyles.pricing_card} key={data.id}>
							<div className={PackagesStyles.pricing_header}>
								<div className={PackagesStyles.pricing_card_icon_box}>
									<svg className={PackagesStyles.pricing_card_icon}>
										<use xlinkHref={`/assets/sprite.svg#icon-subscribe`} />
									</svg>
								</div>
								<h3 className={PackagesStyles.pricing_card_heading}>{data.name}</h3>
							</div>
							<div className={PackagesStyles.pricing_header} style={{ margin: '2rem 0' }}>
								{data.plans && data.plans.length > 0 ? (
									<Fragment>
										{data.plans.map((plan) => (
											<div className={PackagesStyles.pricing_card_price} key={plan.id}>
												<p>$</p>
												<p className={PackagesStyles.pricing_card_price_amount}>{plan.amount / 100}</p>
												<p>per {plan.interval} </p>
												<label className='switch'>
													<input
														id={plan.id}
														checked={plan.active}
														onChange={() => {
															togglePriceStatus(!plan.active, plan.id);
														}}
														type='checkbox'
														className='checkbox'
														name='active'
													/>
													<span className='slider round' />
												</label>
												<button
													className={PackagesStyles.pricing_card_action_btn_delete}
													onClick={() => deletePrice(plan.id)}>
													<svg className={PackagesStyles.pricing_card_action_icon}>
														<use xlinkHref={`/assets/sprite.svg#icon-delete`} />
													</svg>
												</button>
												{data.plans.length === 1 && (
													<button
														className={PackagesStyles.pricing_card_add_plan_btn}
														onClick={() =>
															setAddPlan({ interval: plan.interval === 'month' ? 'year' : 'month', data, status: true })}>
														Add {plan.interval === 'month' ? 'annual' : 'monthly'} plan
													</button>
												)}
											</div>
										))}
									</Fragment>
								) : (
									<button
										className={PackagesStyles.pricing_card_add_plan_btn}
										onClick={() => setAddPlan({ interval: 'month', data, status: true })}>
										Add monthly plan
									</button>
								)}

								{data &&
									data.plans &&
									(data.plans.length === 0 || data.plans.length === 1) && (
										<AddPriceModal
											data={addPlan.data}
											addPlanModal={addPlan.status}
											interval={addPlan.interval}
											priceValue={priceValue}
											setPriceValue={setPriceValue}
											handleAddPlan={handleAddPlan}
											handleAddPlanModalClose={handleAddPlanModalClose}
										/>
									)}
							</div>

							{data.metadata &&
								data.metadata.users && (
									<div className={PackagesStyles.pricing_card_features}>
										<div className={PackagesStyles.pricing_card_feature}>
											<div className={PackagesStyles.pricing_card_feature_icon_box}>
												<svg className={PackagesStyles.pricing_card_feature_icon}>
													<use xlinkHref={`/assets/sprite.svg#icon-check`} />
												</svg>
											</div>
											<p className={PackagesStyles.pricing_card_feature_text}>{data.description}</p>
										</div>
										<div className={PackagesStyles.pricing_card_feature}>
											<div className={PackagesStyles.pricing_card_feature_icon_box}>
												<svg className={PackagesStyles.pricing_card_feature_icon}>
													<use xlinkHref={`/assets/sprite.svg#icon-user`} />
												</svg>
											</div>
											<p className={PackagesStyles.pricing_card_feature_text}>{data.metadata.users} users</p>
										</div>
										<div className={PackagesStyles.pricing_card_feature}>
											<div className={PackagesStyles.pricing_card_feature_icon_box}>
												<svg className={PackagesStyles.pricing_card_feature_icon}>
													<use xlinkHref={`/assets/sprite.svg#icon-calendar`} />
												</svg>
											</div>
											<p className={PackagesStyles.pricing_card_feature_text}>
												{data.metadata.calendars} Calendar
											</p>
										</div>
									</div>
								)}

							<div className={PackagesStyles.pricing_card_actions}>
								<label className='switch'>
									<input
										id={data.id}
										checked={data.active}
										onChange={() => {
											onChangeHandler(data);
										}}
										type='checkbox'
										className='checkbox'
										name='active'
									/>
									<span className='slider round' />
								</label>
								<button
									className={PackagesStyles.pricing_card_action_btn}
									onClick={() => {
										setEditPackageModal({ data, status: true })
										editPackageHandler(data)
									}}
								>
									<svg className={PackagesStyles.pricing_card_action_icon}>
										<use xlinkHref={`/assets/sprite.svg#icon-edit`} />
									</svg>
								</button>
								<button
									className={PackagesStyles.pricing_card_action_btn_delete}
									onClick={() => setDeletePackageModal({ data, status: true })}>
									<svg className={PackagesStyles.pricing_card_action_icon}>
										<use xlinkHref={`/assets/sprite.svg#icon-delete`} />
									</svg>
								</button>
							</div>
						</div>
					))) : (
						<NoData
							title='No Data Found!'
							subName='We could not find any subscription data.'
							height='40vh'
						/>
					)
			}
		</div>
	);
};

export default PackagesCard;


