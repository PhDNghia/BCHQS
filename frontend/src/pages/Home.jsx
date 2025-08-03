import React, { useEffect, useState } from "react";
import Sidebar from "../components/SideBar";
import Navbar from "../components/Navbar";
import DetailUser from "./DetailUser";
import UpdateUser from "./UpdateUser";
import Footer from "../components/Footer";

const Home = () => {
  const [activeItem, setActiveItem] = useState("detail");

  return (
    <div className="w-[90%] mx-auto h-screen flex flex-col">
      <Navbar />
      <main id="main-content flex-grow overflow-y-auto">
        <div className="flex w-full mt-2 gap-x-2">
          <Sidebar
            activeItem={activeItem}
            setActiveItem={setActiveItem}
            className="flex-[2]"
          />
          <div className="flex-[3] rounded-2xl">
            {activeItem === "detail" && <DetailUser />}
            {activeItem === "update" && <UpdateUser />}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
