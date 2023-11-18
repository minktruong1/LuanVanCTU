import {
  Sidebar,
  Banner,
  SpecialOffer,
  MiniPoster,
  MobileToolbar,
} from "../../components/index.js";
import CategoriesList from "../../components/CategoriesList.js";
import BlogsMap from "../../components/BlogsMap.js";
import { useSelector } from "react-redux";
import ProductSuggestion from "../../components/ProductSuggestion.js";
import { useEffect, useState } from "react";

const Home = () => {
  const [poster, setPoster] = useState(null);
  const [leftPoster, setLeftPoster] = useState(null);

  const fetchData = async (url, setter) => {
    const response = await fetch(
      `http://localhost:5000/api/imagestore/getDetail/${url}`
    );
    const data = await response.json();
    setter(data.imageStore[0].images);
  };

  useEffect(() => {
    fetchData("mini-poster", setPoster);
    fetchData("left-poster", setLeftPoster);
    window.scrollTo(0, 0);
  }, []);

  const renderMiniPosters = (data) =>
    data?.map((element, index) => <MiniPoster key={index} src={element} />);
  return (
    <div
      className="w-full px-2"
      style={{
        maxWidth: "1200px",
      }}
    >
      <div className="flex mt-4 justify-between">
        <div className="flex flex-row gap-2 w-full">
          <div className="hidden md:w-[230px] md:block">
            <Sidebar />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="flex flex-row justify-center flex-wrap">
              <div className="w-screen sm:w-[unset] flex justify-center pr-2">
                <div className="flex flex-col sm:w-[630px] w-full pr-2 sm:pr-0">
                  <Banner />
                </div>
              </div>

              <div className="hidden xl:flex md:flex-col w-[300px]">
                {renderMiniPosters(leftPoster)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:flex md:flex-row w-full mt-4 ">
        {renderMiniPosters(poster)}
      </div>
      <div className="w-full hidden md:block">
        <SpecialOffer />
      </div>
      <div className="flex flex-row justify-center md:w-full">
        <CategoriesList />
      </div>
      <div className="flex flex-row justify-center md:w-full">
        <ProductSuggestion />
      </div>
      <div className="flex flex-row justify-center md:w-full">
        <BlogsMap />
      </div>
      <div className="w-full md:hidden">
        <MobileToolbar />
      </div>
    </div>
  );
};

export default Home;
