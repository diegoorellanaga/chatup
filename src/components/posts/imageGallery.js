import React, { useState, useEffect } from "react";
import Carousel from 'react-bootstrap/Carousel'

const ImageGallery = ({imageList, setSelectedImage}) => {
     

    const [index, setIndex] = useState(7);

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
        setSelectedImage(imageList[selectedIndex])
       // alert(selectedIndex)
      };

    return (
        <Carousel activeIndex={index} onSelect={handleSelect} style={{ paddingLeft:'1rem', width: '5rem'}}>

                {imageList.map((rs, index) => (
                    <Carousel.Item interval={10000000} key={index}>
                        <img
                          //onSelect = {doSomething}
                          style={{ width: '3rem',height: '3rem'}}
                          variant="top"
                          className='img-fluid rounded-circle'
                          src={window.chatImagesURL+rs}
                          alt="First slide"
                        />
                    </Carousel.Item>
                  ))
                }
 

        </Carousel>
      );

}




export default ImageGallery;