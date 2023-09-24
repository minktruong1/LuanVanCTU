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
      <div className="flex flex-col">
        {products && (
          <Slider {...reactSlickSetting}>
            {products?.map((element, index) => (
              <Product
                key={index}
                pid={element.id}
                productData={element}
                isNew={targetTab === 1 ? false : true}
              />
            ))}
          </Slider>
        )}
      </div>
    </>
  );
};

export default CustomSlider;
