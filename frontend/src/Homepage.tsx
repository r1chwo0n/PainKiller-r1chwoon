import React from 'react';

const Homepage: React.FC = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-1/5 bg-gray-100 p-4 flex flex-col items-center">
        <div className="flex flex-col items-center mb-8">
          <img
            src="/path-to-logo" // Replace with your logo's path
            alt="Logo"
            className="w-20 h-20 mb-4"
          />
          <h1 className="text-lg font-bold">มงคลสิทธิ์</h1>
        </div>
        <nav className="w-full">
          <a
            href="#"
            className="block p-2 mb-4 text-pink-500 font-medium bg-pink-100 rounded text-center"
          >
            คลังยา
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white p-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">คลังยา</h1>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="ค้นหาชื่อยา"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
            />
            <button className="p-2 bg-gray-100 rounded-full">
              <i className="fas fa-bell" />
            </button>
            <button className="p-2 bg-gray-100 rounded-full">
              <i className="fas fa-plus" />
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button className="px-6 py-2 bg-pink-500 text-white rounded-md">ทั้งหมด</button>
          <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md">ยา</button>
          <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md">สมุนไพร</button>
          <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md">ใกล้หมด</button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm flex flex-col"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">ชื่อ: ชื่อ</h2>
                <button className="text-red-500">
                  <i className="fas fa-trash" />
                </button>
              </div>
              <p className="text-sm mb-2">รหัสยา: xxxxxxxxx</p>
              <p className="text-sm mb-2">รายละเอียด: ยานี้ใช้เพื่ออะไร</p>
              <p className="text-sm mb-2">ขนาดและวิธีใช้: ขนาดและวิธีใช้</p>
              <p className="text-sm mb-2">วันหมดอายุ: xx xx xxxx</p>
              <p className="text-sm mb-4">จำนวนคงเหลือ: จำนวนคงเหลือ</p>
              <button className="mt-auto py-2 bg-pink-500 text-white text-center rounded-md">
                แก้ไข
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Homepage;