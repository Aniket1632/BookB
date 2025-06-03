import React from 'react'

const AppearanceBar = ({data}) => {
    const {
        clickAppearanceBarPara, 
          setClickAppearanceBarPara,
          appearanceBarText, 
          setAppearanceBarText,
          appearanceBarPara, 
          setAppearanceBarPara,
          handleAppearanceBarParaClick,
          handleAppearanceBarTextClick,
          clickAppearanceBarText, 
          setClickAppearanceBarText,
          title,
          subTitle,
          color,
    } = data;
  return (
    <div className="products_discount" style={{marginTop:'0rem',backgroundColor:color}}>
        
        <div className="appearanceBarText">
                <div className='appearnce-button-container' >
                    <button className='appearance-btn' onClick={() => setClickAppearanceBarText(!clickAppearanceBarText)}>
                        <svg className="table__button--icon">
                            <use xlinkHref={`/assets/sprite.svg#icon-edit`} />
                        </svg>
                    </button>
                    {clickAppearanceBarText && <button className='appearance-btn' onClick={() =>handleAppearanceBarTextClick()}>
                        SUBMIT
                    </button>}
                </div>
                <h1 contentEditable={clickAppearanceBarText ? true : false} onInput={(e) => {setAppearanceBarText(e.target.innerText) }}>{title ? title:"Enter Offers"}</h1>
            </div>
            <div className="appearanceBarText">
                <div className='appearnce-button-container'>
                    <button className='appearance-btn' onClick={() => setClickAppearanceBarPara(!clickAppearanceBarPara)}>
                        <svg className="table__button--icon">
                            <use xlinkHref={`/assets/sprite.svg#icon-edit`} />
                        </svg>
                    </button>
                    {clickAppearanceBarPara && <button className='appearance-btn' onClick={() =>handleAppearanceBarParaClick()}>
                        SUBMIT
                    </button>}
                </div>
                <h1 contentEditable={clickAppearanceBarPara ? true : false} onInput={(e) => {setAppearanceBarPara(e.target.innerText) }}>{subTitle ? subTitle:"Enter Offers"}</h1>
            </div>

           
    </div>
  )
}

export default AppearanceBar