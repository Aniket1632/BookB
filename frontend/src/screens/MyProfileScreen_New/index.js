import React, { useEffect, useState } from "react";
import Styles from "./MyProfileScreen.module.css";
import Content from "../../components/Content/Content";
import UserIconComponent from "../../components/UserIconComponent/UserIconComponent";
import MyProfileInputComponent from "../../components/MyProfileInputComponent/MyProfileInputComponent";
import BaseButton from "../../components/BaseButton/BaseButton";
import moment from "moment";
import TextBox from "../../components/formInputs/MultiDatePicker/TextBox.module.css";
import { Calendar } from "react-multi-date-picker";
import TimeDurationComponent from "../../components/TimeDurationComponent/TimeDurationComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  getMyProfileDeatilsAction,
  getUserByTokenAction,
  updateMyProfile,
} from "../../redux/actions/userActions";
import PasswordChangeComponent from "../../components/PasswordChangeComponent/PasswordChangeComponent";
import MyProfileSkeleton from "../../components/Skeletons/MyProfileSkeleton";
import RewardsModal from "../../components/RewardModal/RewardModal";

const MyProfileScreenNew = ({ value, onChange }) => {
  const [name, setName] = useState({ value: "", error: "" });
  const [textArea, setTextArea] = useState({ value: "", error: "" });
  const [imageSrc, setImageSrc] = useState("");
  const [phoneNo, setPhoneNo] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [previewURL, setPreviewURL] = useState(null);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  // const [lunchTime, setLunchTime] = useState({
  //   lunchStartTime: { value: '', error: '' },
  //   lunchEndTime: { value: '', error: '' },
  // });
  const [showChangePassword, setShowChangePassword] = useState(false);
  // const [loading, setLoading] = useState(true)
  const dispatch = useDispatch(false);
  const myProfileDetails = useSelector((state) => state.myProfileDetails);
  const { loading } = myProfileDetails;
  const initialLunchStartTime =
    myProfileDetails.userInfo && myProfileDetails.userInfo.data
      ? myProfileDetails.userInfo.data.lunchStartTime || ""
      : "";
  const initialLunchEndTime =
    myProfileDetails.userInfo && myProfileDetails.userInfo.data
      ? myProfileDetails.userInfo.data.lunchEndTime || ""
      : "";
  const [lunchTime, setLunchTime] = useState({
    lunchStartTime: { value: initialLunchStartTime, error: "" },
    lunchEndTime: { value: initialLunchEndTime, error: "" },
  });
  // console.log(initialLunchStartTime , initialLunchEndTime)
  React.useEffect(() => {
    if (
      myProfileDetails &&
      myProfileDetails.userInfo &&
      myProfileDetails.userInfo.data &&
      myProfileDetails.userInfo.data.name
    ) {
      setName({
        ...name,
        value: myProfileDetails.userInfo.data.name,
        error: "",
      });
      setEmail({
        ...email,
        value: myProfileDetails.userInfo.data.email,
        error: "",
      });
      setPhoneNo({
        ...phoneNo,
        value: myProfileDetails.userInfo.data.phone,
        error: "",
      });
      setTextArea({
        ...textArea,
        value: myProfileDetails.userInfo.data.description,
        error: "",
      });
    }
  }, [myProfileDetails]);
  useEffect(() => {
    if (
      myProfileDetails &&
      myProfileDetails.userInfo &&
      myProfileDetails.userInfo.data
    ) {
      const { lunchStartTime, lunchEndTime } = myProfileDetails.userInfo.data;
      setLunchTime({
        lunchStartTime: { value: lunchStartTime || "", error: "" },
        lunchEndTime: { value: lunchEndTime || "", error: "" },
      });
    }
  }, [myProfileDetails]);

  React.useEffect(() => {
    // console.log(myProfileDetails);
    if (
      myProfileDetails &&
      !myProfileDetails.loading &&
      myProfileDetails.userInfo &&
      myProfileDetails.userInfo.status
    ) {
      dispatch(getUserByTokenAction());
    }
  }, [myProfileDetails, dispatch]);

  useEffect(() => {
    if (
      myProfileDetails &&
      myProfileDetails.userInfo &&
      myProfileDetails.userInfo.data &&
      myProfileDetails.userInfo.data.photo
    ) {
      setImageSrc(myProfileDetails.userInfo.data.photo);
      setPreviewURL(myProfileDetails.userInfo.data.photo);
    }
  }, [myProfileDetails]);

  useEffect(() => {
    dispatch(getMyProfileDeatilsAction());
  }, [dispatch]);

  const handleSubmit = (e, updateData) => {
    e.preventDefault();

    if (name.value === "" && name.value.trim() === "") {
      setName({ ...name, error: "Please enter your name" });
    }
    if (phoneNo.value === "" && phoneNo.value.trim() === "") {
      setPhoneNo({ ...phoneNo, error: "Please enter phone no." });
    }
    if (email.value === "" && email.value.trim() === "") {
      setEmail({ ...email, error: "Please enter your email" });
    } else {
      setName({ ...name, error: "" });
      setPhoneNo({ ...phoneNo, error: "" });
      setEmail({ ...email, error: "" });

      const formData = new FormData();
      formData.append("name", name.value)
      formData.append("phone", phoneNo.value)
      formData.append("photo", imageSrc)
      formData.append("email", email.value)
      formData.append("lunchStartTime", lunchTime.lunchStartTime.value)
      formData.append("lunchEndTime", lunchTime.lunchEndTime.value)
      formData.append("description", textArea.value)

      dispatch(updateMyProfile(formData));
    }
  };

  return (
    <Content
      containerStyle={{
        paddingTop: "10rem",
        marginTop: "0rem",
        height: "89vh",
      }}
      headerTitle={"My Profile"}
      currentMenu={"My-Profile"}
    >
      {loading ? (
        <MyProfileSkeleton />
      ) : (
        <>
          {showChangePassword ? (
            <PasswordChangeComponent
              setShowChangePassword={setShowChangePassword}
              imageSrc={imageSrc}
              setImageSrc={setImageSrc}
            />
          ) : (
            <div className={Styles.container}>
              <div className={Styles.content}>
                <UserIconComponent
                  imageSrc={imageSrc}
                  previewURL={previewURL}
                  setPreviewURL={setPreviewURL}
                  setImageSrc={setImageSrc}
                />
                <div className={Styles.text_input}>
                  <MyProfileInputComponent
                    title={"Name :"}
                    placeholder={"Reds Barber"}
                    value={name.value}
                    onChange={(e) =>
                      setName({
                        ...name,
                        value: e.target.value,
                        error: "",
                      })
                    }
                    errorMessage={name.error}
                  />
                  <MyProfileInputComponent
                    type={"textarea"}
                    title={"Description :"}
                    value={textArea.value}
                    onChange={(e) =>
                      setTextArea({
                        ...textArea,
                        value: e.target.value,
                      })
                    }
                  />
                  <MyProfileInputComponent
                    title={"Phone no:"}
                    placeholder={"123456789"}
                    value={phoneNo.value}
                    onChange={(e) =>
                      setPhoneNo({
                        ...phoneNo,
                        value: e.target.value,
                        error: "",
                      })
                    }
                    errorMessage={phoneNo.error}
                    countryCode= {myProfileDetails?.userInfo?.data?.countryCode}
                      />           
                      <div className={Styles.coinSection}>
                  <MyProfileInputComponent
                    title={"Email :"}
                    placeholder={"test@gmail.com"}
                    value={email.value}
                    onChange={(e) =>
                      setEmail({
                        ...email,
                        value: e.target.value,
                        error: "",
                      })
                    }
                    errorMessage={email.error}
                        />
                  {/* <svg className={Styles.coinIcon}>
		                   <use xlinkHref={`/assets/sprite.svg#icon-reward-coins`} />
	                </svg> */}
                  {/* <MyProfileInputComponent
                    title={"Coins:"}
                          placeholder={"Number of coins"}
                  />
                        <svg className={Styles.iconInfo}
                          onClick={() => setShowGoalsModal(true)}
                        >
													<use
														xlinkHref={`/assets/sprite.svg#icon-info`}
													/>
                        </svg>
                        <RewardsModal
                          showModal={showGoalsModal}
                          onClose={() => setShowGoalsModal(false)}
                        /> */}
                      </div>
                </div>
                {/* <div className={Styles.timeDurationComponent}>
                 <TimeDurationComponent lunchTime={lunchTime} setLunchTime={setLunchTime} />
                 
                </div> */}
                <span
                  className={Styles.change_password_text}
                  onClick={() =>
                    setShowChangePassword((prevState) => !prevState)
                  }
                >
                  Change Password
                </span>
                <div className={Styles.update_profile_button}>
                  <BaseButton
                    type={"Submit"}
                    className={Styles.update_button}
                    title={"Update"}
                    onClick={handleSubmit}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </Content>
  );
};

export default MyProfileScreenNew;
