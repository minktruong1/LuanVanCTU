import React from "react";

const MiniPoster = ({ src }) => {
  return (
    <div className="w-min-[200px]">
      <img alt="MiniPoster" src={src} />
    </div>
  );
};

export default MiniPoster;
