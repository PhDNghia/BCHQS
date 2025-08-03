import React, { useEffect, useState } from "react";

import { Routes, Route } from "react-router-dom";
import AddPerson from "./pages/AddPerson";
import ListPerson from "./pages/ListPerson";
import Navbar from "./components/Navbar";
import DetailPerson from "./pages/DetailPerson";
import Login from "./components/Login";
import PendingPerson from "./pages/PendingPerson";
import Footer from "./components/Footer";

import ScrollToTopButton from "./components/ScrollToTopButton";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <div className="flex flex-col min-h-screen">
            <Navbar token={token} setToken={setToken} />
            <main className="flex-grow">
              <div className="flex w-full">
                <div className="w-[90%] mx-auto my-8 text-gray-600 text-base">
                  <Routes>
                    <Route
                      path="/add-person"
                      element={<AddPerson token={token} />}
                    />
                    <Route
                      path="/list-person"
                      element={<ListPerson token={token} />}
                    />
                    <Route
                      path="/list-person/:id"
                      element={<DetailPerson token={token} />}
                    />
                    <Route
                      path="/list-search"
                      element={<ListPerson token={token} />}
                    />
                    <Route
                      path="/pending-person"
                      element={<PendingPerson token={token} />}
                    />
                  </Routes>
                </div>
              </div>
            </main>
            <Footer />
          </div>
        </>
      )}
      <ScrollToTopButton />
    </div>
  );
};

export default App;
