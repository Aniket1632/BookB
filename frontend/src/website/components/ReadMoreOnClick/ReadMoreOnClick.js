
import React, { useState } from "react";
import readmore from "./readmore.module.css";

const ReadMoreOnClick = ({ children, onClick }) => {
    const text = children;
    const [isReadMore, setIsReadMore] = useState(true);

    return (
        <p className={readmore.text}>
            {isReadMore ? text.slice(0, 50) : text}
            {text.length > 50?
                <span onClick={onClick} className={readmore.readorhide}>
                    &nbsp;read More
                </span> : null
            }
        </p>
    );
};

export default ReadMoreOnClick;