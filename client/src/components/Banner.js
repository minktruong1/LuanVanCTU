import React, { useEffect, useState } from "react";
import icons from "../ultils/icons.js";
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

const imagesLink = [
  {
    id: 1,
    link: "https://theme.hstatic.net/1000288298/1001020793/14/categorybanner_1_img.jpg?v=198",
  },
  {
    id: 2,
    link: "https://theme.hstatic.net/1000288298/1001020793/14/slide_1_img.jpg?v=198",
  },
  {
    id: 3,
    link: "https://theme.hstatic.net/200000637319/1000990988/14/categorybanner_2_img.jpg?v=279",
  },
];

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
