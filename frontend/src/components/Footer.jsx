import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-[3fr_2fr] gap-14 my-10 mt-20 text-sm">
        <div>
          <img src={assets.logo} className="mb-5 w-20" alt="" />
          <p className="w-[80%] md:w-auto text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio
            delectus similique quibusdam omnis quasi quisquam a in explicabo
            possimus error aperiam eius, ab voluptas animi! Animi voluptatum
            quas explicabo molestiae.
          </p>
        </div>

        {/* <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div> */}

        <div>
          <p className="text-xl font-medium mb-5">LIÊN HỆ</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>
              <b>Số điện thoại: </b>0987654321
            </li>
            <li>
              <b>Thư điện tử: </b>banchqsphuongcairang@gmail.com
            </li>
            <li>
              <b>Địa chỉ: </b>Đường Nguyên Hồng, P. Cái Răng, TP. Cần Thơ
            </li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright 2025 @ banchqsphuongcairang.com - Create by PhD Nghĩa
        </p>
      </div>
    </div>
  );
};

export default Footer;
