import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, boxes }) => {
    const boxDivs = boxes.map((box, i) => {
        return (<div
            key={i}
            className='bounding-box'
            style={{ top: box.top, right: box.right, left: box.left, bottom: box.bottom }}
        ></div>);
    });

    return (
        <div className='center ma'>
            <div className='absolute mt2'>
                <img id='input-image' src={imageUrl} alt="" width='500px' height='auto' />
                {boxDivs}
            </div>
        </div>
    );
};

export default FaceRecognition;