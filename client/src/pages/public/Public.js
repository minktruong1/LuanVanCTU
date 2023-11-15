import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Footer, Header, MobileToolbar, Navigation } from "../../components";
import { useNavigate } from "react-router-dom";

const Public = () => {
  const [search, setSearch] = useState(null);
  const [productSearch, setProductSearch] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    console.log(search);
    sessionStorage.setItem("keysearch", search);
    window.location.href = `http://localhost:3000/search`;
    // navigate(`/search`);
  };

  return (
    <>
      <div className="w-full flex flex-col items-center ">
        <Header setSearch={setSearch} handleSearch={handleSearch} />
        <Navigation />
        <div className="w-full flex flex-col items-center bg-webBackground pb-6">
          <Outlet search={search} />
        </div>
        <Footer />
        <MobileToolbar />
      </div>
    </>
  );
};

export default Public;
