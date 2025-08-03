import React from "react";

// mở popup xem hình
import ImagePopup from "../components/ImagePopup";
import { useImagePopup } from "../hooks/useImagePopup.js";

const DetailUser = () => {
  const token = localStorage.getItem("token");
  const person = JSON.parse(localStorage.getItem("person"));

  //popup image
  const { selectedImage, openPopup, closePopup } = useImagePopup();

  // Nếu không có dữ liệu trong localStorage, hiển thị thông báo
  if (!person) {
    return (
      <div className="text-center p-10 font-semibold text-red-500">
        Không có dữ liệu để hiển thị.
      </div>
    );
  }

  return (
    <div className="mx-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-gray-100 rounded-2xl">
      <div className="justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Thông tin cá nhân chi tiết
        </h1>
      </div>

      {/* --- KHỐI THÔNG TIN CÁ NHÂN --- */}
      <div className="p-5 border rounded-xl bg-white shadow-lg">
        <div className="flex justify-between items-start mb-4 border-b pb-3">
          <h3 className="text-xl font-semibold text-gray-700">
            Thông tin cơ bản
          </h3>
          {/* Chỉ hiển thị ảnh đầu tiên */}
          {person.image?.value?.length > 0 ? (
            <div onClick={() => openPopup(person.image.value[0])}>
              <img
                src={person.image.value[0]}
                alt="Ảnh đại diện"
                className="w-28 h-28 object-cover cursor-pointer rounded-lg shadow-md"
              />
            </div>
          ) : (
            <div className="w-28 h-28 flex items-center justify-center bg-gray-100 rounded-lg text-sm text-gray-500">
              <p className="text-center">Quản trị viên đang cập nhật ảnh</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Họ và tên */}
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Họ và tên</p>
            <div className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 min-h-[40px]">
              <p className="text-gray-800">
                {person.name?.value || (
                  <span className="text-gray-400">Chưa có</span>
                )}
              </p>
            </div>
          </div>
          {/* Ngày sinh */}
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Ngày sinh</p>
            <div className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 min-h-[40px]">
              <p className="text-gray-800">
                {person.birth?.value || (
                  <span className="text-gray-400">Chưa có</span>
                )}
              </p>
            </div>
          </div>
          {/* Giới tính */}
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Giới tính</p>
            <div className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 min-h-[40px]">
              <p className="text-gray-800">
                {person.sex?.value || (
                  <span className="text-gray-400">Chưa có</span>
                )}
              </p>
            </div>
          </div>
          {/* Số CCCD */}
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Số CCCD</p>
            <div className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 min-h-[40px]">
              <p className="text-gray-800">
                {person.idNumber?.value || (
                  <span className="text-gray-400">Chưa có</span>
                )}
              </p>
            </div>
          </div>
          {/* Dân tộc */}
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Dân tộc</p>
            <div className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 min-h-[40px]">
              <p className="text-gray-800">
                {person.ethnicity?.value || (
                  <span className="text-gray-400">Chưa có</span>
                )}
              </p>
            </div>
          </div>
          {/* Tôn giáo */}
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Tôn giáo</p>
            <div className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 min-h-[40px]">
              <p className="text-gray-800">
                {person.religion?.value || (
                  <span className="text-gray-400">Chưa có</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- KHỐI THÔNG TIN LIÊN HỆ & NGHỀ NGHIỆP --- */}
      <div className="p-5 border rounded-xl bg-white shadow-lg">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-3">
          Thông tin liên hệ & Nghề nghiệp
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nghề nghiệp */}
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Nghề nghiệp
            </p>
            <div className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 min-h-[40px]">
              <p className="text-gray-800">
                {person.occupation?.value || (
                  <span className="text-gray-400">Chưa có</span>
                )}
              </p>
            </div>
          </div>
          {/* Số điện thoại */}
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Số điện thoại
            </p>
            <div className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 min-h-[40px]">
              <p className="text-gray-800">
                {person.phone?.value || (
                  <span className="text-gray-400">Chưa có</span>
                )}
              </p>
            </div>
          </div>
          {/* Địa chỉ thường trú */}
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-gray-500 mb-1">
              Địa chỉ thường trú
            </p>
            <div className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 min-h-[40px]">
              <p className="text-gray-800">
                {person.permanentAddress?.value || (
                  <span className="text-gray-400">Chưa có</span>
                )}
              </p>
            </div>
          </div>
          {/* Địa chỉ tạm trú */}
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-gray-500 mb-1">
              Địa chỉ tạm trú
            </p>
            <div className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 min-h-[40px]">
              <p className="text-gray-800">
                {person.temporaryAddress?.value || (
                  <span className="text-gray-400">Chưa có</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- KHỐI HỌC VẤN --- */}
      <div className="p-5 border rounded-xl bg-white shadow-lg">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-3">
          Trình độ & Học vấn
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trình độ học vấn */}
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Trình độ học vấn
            </p>
            <div className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 min-h-[40px]">
              <p className="text-gray-800">
                {person.educationLevel?.value || (
                  <span className="text-gray-400">Chưa có</span>
                )}
              </p>
            </div>
          </div>
          {/* Trình độ chuyên môn */}
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Trình độ chuyên môn
            </p>
            <div className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 min-h-[40px]">
              <p className="text-gray-800">
                {person.professionalLevel?.value || (
                  <span className="text-gray-400">Chưa có</span>
                )}
              </p>
            </div>
          </div>
          {/* Quá trình học tập */}
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-gray-500 mb-1">
              Quá trình học tập
            </p>
            <div className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 min-h-[40px]">
              <p className="text-gray-800 whitespace-pre-wrap">
                {person.education?.value || (
                  <span className="text-gray-400">Chưa có</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- KHỐI GIA ĐÌNH --- */}
      <div className="p-5 border rounded-xl bg-white shadow-lg">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-3">
          Thông tin gia đình
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Thông tin cha */}
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Thông tin cha
            </p>
            <div className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 min-h-[40px]">
              <p className="text-gray-800">
                {person.fatherInfo?.value || (
                  <span className="text-gray-400">Chưa có</span>
                )}
              </p>
            </div>
          </div>
          {/* Thông tin mẹ */}
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Thông tin mẹ
            </p>
            <div className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 min-h-[40px]">
              <p className="text-gray-800">
                {person.motherInfo?.value || (
                  <span className="text-gray-400">Chưa có</span>
                )}
              </p>
            </div>
          </div>
          {/* Thông tin vợ/chồng */}
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Thông tin vợ/chồng
            </p>
            <div className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 min-h-[40px]">
              <p className="text-gray-800">
                {person.wife?.value || (
                  <span className="text-gray-400">Chưa có</span>
                )}
              </p>
            </div>
          </div>
          {/* Thông tin con */}
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Thông tin con
            </p>
            <div className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 min-h-[40px]">
              <p className="text-gray-800">
                {person.children?.value || (
                  <span className="text-gray-400">Chưa có</span>
                )}
              </p>
            </div>
          </div>
          {/* Thông tin anh chị em */}
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-gray-500 mb-1">
              Thông tin anh chị em
            </p>
            <div className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 min-h-[40px]">
              <p className="text-gray-800 whitespace-pre-wrap">
                {person.siblings?.value || (
                  <span className="text-gray-400">Chưa có</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      <ImagePopup imageUrl={selectedImage} onClose={closePopup} />
    </div>
  );
};

export default DetailUser;
