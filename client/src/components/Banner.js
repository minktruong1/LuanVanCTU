import React, { useState, useEffect } from "react";
import icons from "../ultils/icons.js";

const Banner = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((currentSlide + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((currentSlide - 1 + images.length) % images.length);
  };

  const { ImMinus, MdOutlineArrowBackIos, MdOutlineArrowForwardIos } = icons;

  useEffect(() => {
    //Set timeout for slide change
    const slideInterval = setInterval(() => {
      nextSlide();
    }, 3500);

    return () => {
      clearInterval(slideInterval);
    };
  }, [currentSlide]);

  return (
    <div className="relative w-full ">
      <div className="overflow-hidden w-full h-full rounded-lg">
        <img
          src={images[currentSlide]}
          alt={`Slide ${currentSlide + 1}`}
          className="w-full h-[326px] object-cover"
        />
      </div>
      <div className="absolute top-1/2 -mt-8 left-5 right-5 flex justify-between space-x-2">
        <button onClick={prevSlide} className=" text-white text-[32px]">
          <MdOutlineArrowBackIos />
        </button>
        <button onClick={nextSlide} className=" text-white text-[32px]">
          <MdOutlineArrowForwardIos />
        </button>
      </div>
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex flex-row text-white">
        {images.map((_, index) => (
          <span
            key={index}
            className={`text-[18px] cursor-pointer  pr-2 ${
              currentSlide === index ? "text-red-600" : ""
            }`}
            onClick={() => setCurrentSlide(index)}
          >
            <ImMinus />
          </span>
        ))}
      </div>
    </div>
  );
};

export default Banner;
