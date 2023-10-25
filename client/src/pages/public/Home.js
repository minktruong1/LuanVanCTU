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

const Home = () => {
  return (
    <div className="w-full md:w-main">
      <div className="flex mt-4">
        <div className="flex flex-row gap-2 w-full">
          <div className="hidden md:w-[20%] md:block">
            <Sidebar />
          </div>
          <div className="w-full md:w-[80%]">
            <div className="flex flex-row justify-center">
              <div className="flex flex-col w-[calc(100%-20px)] md:w-[70%]">
                <Banner />
              </div>
              <div className="hidden md:flex md:flex-col md:w-[30%] md:justify-between">
                <MiniPoster src="https://file.hstatic.net/200000722513/file/banner_slider_-_right_1_04cb85fcde584ec0a0818d9e5e212282.png" />
                <MiniPoster src="https://file.hstatic.net/200000722513/file/banner_slider_-_right_1_04cb85fcde584ec0a0818d9e5e212282.png" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:flex md:flex-row w-full mt-4">
        <MiniPoster src="https://file.hstatic.net/200000722513/file/banner_slider_-_right_1_04cb85fcde584ec0a0818d9e5e212282.png" />
        <MiniPoster src="https://file.hstatic.net/200000722513/file/banner_slider_-_right_1_04cb85fcde584ec0a0818d9e5e212282.png" />
        <MiniPoster src="https://file.hstatic.net/200000722513/file/banner_slider_-_right_1_04cb85fcde584ec0a0818d9e5e212282.png" />
        <MiniPoster src="https://file.hstatic.net/200000722513/file/banner_slider_-_right_1_04cb85fcde584ec0a0818d9e5e212282.png" />
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
