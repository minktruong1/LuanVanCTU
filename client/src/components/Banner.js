import React, { useEffect, useState } from "react";
import Slider from "react-slick";

const reactSlickSetting = {
  dot: true,
  infinite: true,
  autoplay: true,
  lazyLoad: true,
  autoplaySpeed: 3000,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const Banner = () => {
  const [banner, setBanner] = useState(null);

  const fetchBanner = async (url, setter) => {
    const response = await fetch(
      `http://localhost:5000/api/imagestore/getDetail/banner`
    );
    const data = await response.json();
    setBanner(data.imageStore[0].images);
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  return (
    <div className="">
      <Slider {...reactSlickSetting} className="custom">
        {banner?.map((element, index) => (
          <div
            key={index}
            className="h-[188px] md:w-full md:h-[320px] rounded overflow-hidden"
          >
            <img
              alt=""
              src={element}
              className="w-full h-full object-cover"
            ></img>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Banner;
