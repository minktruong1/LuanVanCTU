import {
  Sidebar,
  Banner,
  SpecialOffer,
  MiniPoster,
} from "../../components/index.js";
import CategoriesList from "../../components/CategoriesList.js";

const images = [
  "https://theme.hstatic.net/1000288298/1001020793/14/categorybanner_1_img.jpg?v=198",
  "https://theme.hstatic.net/1000288298/1001020793/14/slide_1_img.jpg?v=198",
  "https://theme.hstatic.net/200000637319/1000990988/14/categorybanner_2_img.jpg?v=279",
];

const Home = () => {
  return (
    <>
      <div className="flex mt-4">
        <div className="flex flex-row gap-5">
          <div className="w-[20%] flex-auto  ">
            <Sidebar />
          </div>
          <div className="w-[80%] flex-auto ">
            <div className="flex flex-row">
              <div className="flex flex-col w-[70%]">
                <Banner images={images} />
              </div>
              <div className="flex flex-col w-[30%] justify-between">
                <MiniPoster src="https://file.hstatic.net/200000722513/file/banner_slider_-_right_1_04cb85fcde584ec0a0818d9e5e212282.png" />
                <MiniPoster src="https://file.hstatic.net/200000722513/file/banner_slider_-_right_1_04cb85fcde584ec0a0818d9e5e212282.png" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row w-full mt-4 ">
        <MiniPoster src="https://file.hstatic.net/200000722513/file/banner_slider_-_right_1_04cb85fcde584ec0a0818d9e5e212282.png" />
        <MiniPoster src="https://file.hstatic.net/200000722513/file/banner_slider_-_right_1_04cb85fcde584ec0a0818d9e5e212282.png" />
        <MiniPoster src="https://file.hstatic.net/200000722513/file/banner_slider_-_right_1_04cb85fcde584ec0a0818d9e5e212282.png" />
        <MiniPoster src="https://file.hstatic.net/200000722513/file/banner_slider_-_right_1_04cb85fcde584ec0a0818d9e5e212282.png" />
      </div>
      <div className="w-full">
        <SpecialOffer />
      </div>
      <div className="w-full">
        <CategoriesList />
      </div>
    </>
  );
};

export default Home;
