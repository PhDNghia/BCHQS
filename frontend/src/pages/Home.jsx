import React, { useEffect, useState } from "react";
import Sidebar from "../components/SideBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import FilterSidebar from "../components/FilterSidebar";
import DocumentList from "../components/DocumentList";
import { backendUrl } from "../App";
import MaintenancePage from "./MaintenancePage";
import axios from "axios";
import ScrollToTopButton from "../components/ScrollToTopButton";

const Home = () => {
  const [maintenanceMessage, setMaintenanceMessage] = useState("");
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);

  // Kiểm tra xem admin đã đăng nhập chưa bằng cách đọc sessionStorage
  const isAdminLoggedIn =
    sessionStorage.getItem("isAdminAuthenticated") === "true";

  console.log(isAdminLoggedIn);

  useEffect(() => {
    if (!isAdminLoggedIn) {
      const checkSystemStatus = async () => {
        try {
          const response = await axios.get(
            `${backendUrl}/api/settings/maintenance-status`
          );

          console.log(response);

          if (response.data.isMaintenance) {
            setIsMaintenance(true);
            setMaintenanceMessage(response.data.message);
          }
        } catch (error) {
          setIsMaintenance(false);
        } finally {
          setLoading(false);
        }
      };
      checkSystemStatus();
    } else {
      setLoading(false);
    }
  }, [isAdminLoggedIn]);

  // HÀM MỚI: Xử lý đăng xuất cho admin
  const handleAdminLogout = () => {
    sessionStorage.removeItem("isAdminAuthenticated");
    // Tải lại trang để Home component kiểm tra lại trạng thái bảo trì
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Nếu đang bảo trì VÀ admin chưa đăng nhập, hiển thị trang bảo trì
  if (isMaintenance && !isAdminLoggedIn) {
    return <MaintenancePage message={maintenanceMessage} />;
  }

  return (
    <div className="w-full">
      <Navbar onAdminLogout={handleAdminLogout} />
      <Hero />

      <div className="w-full">
        <div className="w-[90%] mx-auto py-18">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <FilterSidebar />
              <DocumentList />
            </div>

            <div className="lg:col-span-1">
              <Sidebar />
            </div>
          </div>
        </div>
      </div>

      <ScrollToTopButton />
      <Footer />
    </div>
  );
};

export default Home;
