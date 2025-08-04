import React from "react";
import { assets } from "../assets/assets";
import { IoSearch } from "react-icons/io5";

const Hero = () => {
  return (
    <>
      <div className="w-[90%] flex flex-col my-25 sm:flex-row ">
        {/* Hero left side */}
        <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
          <div className="text-[#414141]">
            <div className="flex items-center gap-2">
              <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
              <p className="font-medium text-sm md:text-base">BAN</p>
            </div>
            <h1 className="prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed">
              CHỈ HUY QUÂN SỰ
            </h1>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm md:text-base">
                PHƯỜNG CÁI RĂNG
              </p>
              <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            </div>
          </div>
        </div>
        {/* Hero Right Side */}
        <img src={assets.logo} className="w-full sm:w-[50%]" alt="" />
      </div>

      {/* Khu vực Header và thanh tìm kiếm chính */}
      <div className="w-full text-center mt-8 bg-gray-100 py-12">
        <h1 className="text-2xl font-extrabold text-gray-900">
          Thư viện Văn bản Pháp luật
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Tra cứu, tìm kiếm và khám phá các văn bản pháp luật Việt Nam.
        </p>
        <div className="mt-6 max-w-2xl mx-auto relative">
          <input
            type="text"
            placeholder="Gõ tên, số hiệu văn bản để tìm kiếm..."
            className="w-full p-4 pr-12 text-lg border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500"
            // onKeyDown={(e) => {
            //   if (e.key === "Enter") setSearchTerm(e.target.value);
            // }}
          />
          <IoSearch className="absolute top-1/2 right-5 transform -translate-y-1/2 text-gray-400 text-2xl" />
        </div>
      </div>
    </>
  );
};

export default Hero;
