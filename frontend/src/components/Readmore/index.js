
import React, { useState } from "react";
import readmore from "./readmore.module.css";

const ReadMore = ({ children }) => {
    const text = children;
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };
    return (
        <p className={readmore.text}>
            {isReadMore ? text.slice(0, 20) : text}
            {text.length > 25 &&
                <span onClick={toggleReadMore} className={readmore.readorhide}>
                    {isReadMore ? "...read more" : " show less"}
                </span>
            }
        </p>
    );
};

export default ReadMore;