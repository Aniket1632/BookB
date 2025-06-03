import React from 'react'
import Button from '../../components/formInputs/Button'
import './Appearance.css'

const AppearanceBanner = ({ data }) => {
  const { setClickHeader,
    clickheader,
    clickSubHeader,
    setClickSubHeader,
    handleHeaderClick,
    handleSubHeaderClick,
    setHeader,
    setSubHeader, bannerImage, setBannerImage,
    handleChangeBannerImage,
    bannerImg,
    clickButton,
    setClickButton,
    buttonText,
    setButtonText,
    title,
    color,
    subTitle } = data



  return (
    <div className="appearancescreen_banner" id="banner">
      <div className="homescreen_banner_outer">
        <div className="homescreen_motive">
          <div className="appearancescreen_banner__subtitle">
            <div className='appearnce-button-container'>
              <button className='appearance-btn' onClick={() => setClickHeader(!clickheader)}>
                <svg className="table__button--icon">
                  <use xlinkHref={`/assets/sprite.svg#icon-edit`} />
                </svg>
              </button>
              {clickheader && <button className='appearance-btn' onClick={handleHeaderClick}>
                SUBMIT
              </button>}

            </div>

            <h1 contentEditable={clickheader ? true : false} onInput={(e) => setHeader(e.target.innerText)}>
              {title ? title :"Lorem ipsum dolor sit amet"}
            </h1>
          </div>
          <div className="appearancescreen_banner__desc">
            <div className='appearnce-button-container'>
              <button className='appearance-btn' onClick={() => setClickSubHeader(!clickSubHeader)}>
                <svg className="table__button--icon">
                  <use xlinkHref={`/assets/sprite.svg#icon-edit`} />
                </svg>
              </button>
              {clickSubHeader && <button className='appearance-btn' onClick={handleSubHeaderClick}>
                SUBMIT
              </button>}
            </div>
            <h1 contentEditable={clickSubHeader ? true : false} onInput={(e) => setSubHeader(e.target.innerText)}>
              {subTitle ? subTitle : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis"}
            </h1>
          </div>
          {/* <div className="appearancescreen_banner__button"> */}
            <Button
              varient="primary"
              style={{
                width: '70%',
                justifyContent: 'center',
                backgroundColor:color
              }}
              label="Book Appointment"
              icon="arrow_right"
              // contentEditable={clickSubHeader ? true : false} onInput={(e) => setButtonText(e.target.innerText)}
            />
          {/* </div> */}

        </div>
        {/* <img src="./assets/styler.png" className="img-responsive1" alt="salon Image" /> */}
      </div>

      <div className='banner-image'>
        <div className='appearnce-button-container'>
          {/* <button className='appearance-btn' onClick={()=>setLogoModal(!logoModal)}>
                  <svg className="table__button--icon">
                    <use xlinkHref={`/assets/sprite.svg#icon-plus`} />
                  </svg>
                </button> */}
          <div className='appearance-btn2'>
            <svg className="table__button--icon2">
              <use xlinkHref={`/assets/sprite.svg#icon-plus`} />
            </svg>
            <input type='file' name='uploadFiles' id='uploadFiles' accept='image/*' onChange={(e) => {
              handleChangeBannerImage(e)
              // setBannerImage(e.target.files);
              // setUploadFileDataError('');
            }} >

            </input>
          </div>
        </div>
        <img src={bannerImg} className="img-responsive" alt="salon Image" />
      </div>
    </div>



  )
}

export default AppearanceBanner