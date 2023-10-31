import React, { memo } from "react";
import { SyncLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <SyncLoader color="#ccc" className="" />
    </div>
  );
};

export default memo(Loading);
