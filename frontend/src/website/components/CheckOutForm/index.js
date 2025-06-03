import React from "react";
import Styles from "./CheckOutForm.module.css";

const ProgressForm = ({ step }) => {

  let style1 = Styles.step;
  let style2 = Styles.step;
  let style3 = Styles.step;
  let style4 = Styles.step;
  let style5 = Styles.step

  if (step === 1) {
    style1 = Styles.Complete + " " + Styles.step;
  } else if (step === 2) {
    style1 = Styles.Complete + " " + Styles.step;
    style2 = Styles.Complete + " " + Styles.step;
  } else if (step === 3) {
    style1 = Styles.Complete + " " + Styles.step;
    style2 = Styles.Complete + " " + Styles.step;
    style3 = Styles.Complete + " " + Styles.step;
  } else if (step === 4) {
    style1 = Styles.Complete + " " + Styles.step;
    style2 = Styles.Complete + " " + Styles.step;
    style3 = Styles.Complete + " " + Styles.step;
    style4 = Styles.Complete + " " + Styles.step;
  } else if (step === 5) {
    style1 = Styles.Complete + " " + Styles.step;
    style2 = Styles.Complete + " " + Styles.step;
    style3 = Styles.Complete + " " + Styles.step;
    style4 = Styles.Complete + " " + Styles.step;
    style5 = Styles.Complete + " " + Styles.step;
  }

  return (
    <div className={Styles.container}>
      <div className={style1}>
        <div className={Styles.bullet}>
          <span>1</span>
        </div>
        <p>Shipping  Details</p>
      </div>
      {/*   <div className={style2}>
        <div className={Styles.bullet}>
          <span>2</span>
        </div>
        <p>Shipping Details</p>
      </div>
      <div className={style3}>
        <div className={Styles.bullet}>
          <span>3</span>
        </div>
        <p>Payment Details</p>
      </div>
    <div className={style5}>
        <div className={Styles.bullet}>
          <span>4</span>
        </div>
        <p>Order Details</p>
      </div> */}
    </div>
  );
};

export default ProgressForm;