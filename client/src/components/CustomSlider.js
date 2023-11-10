import React from "react";
import Slider from "react-slick";
import Product from "./Product";

const reactSlickSetting = {
  dot: false,
  infinite: false,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
};

const CustomSlider = ({ products, targetTab }) => {
  return (
    <>
      {/* <div className="flex flex-col"> */}
      {products && (
        <Slider {...reactSlickSetting} className="custom">
          {products?.map((element, index) => (
            <Product
              key={index}
              pid={element.id}
              productData={element}
              isNew={targetTab === 3 && true}
              isHot={targetTab === 2 && true}
            />
          ))}
        </Slider>
      )}
      {/* </div> */}
    </>
  );
};

export default CustomSlider;
