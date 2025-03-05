import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";

import Mybooking from "./Mybooking.jsx";
import Profile from "./Profile.jsx";

import useGetProfile from "../../hooks/userFetchData.jsx";
import { BASE_URL } from "../../config.js";

import Loading from "../../components/Loader/Loading.jsx";
import Error from "../../components/Error/Error.jsx";

const MyAccount = () => {
  const { dispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  const [tab, setTab] = useState("bookings");

  const {
    data: userData,
    loading,
    error,
  } = useGetProfile(`${BASE_URL}/users/profile/me`);

  console.log(userData, "userdata");

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };
  return (
    <section>
      <div className="max-w-[1170px] px-5 mx-auto">
        {loading && !error && <Loading />}

        {error && !loading && <Error errMessage={error} />}

        {!loading && !error && (
          <div className="grid md:grid-cols-5 gap-10">
            <div className="pb-[50px] px-[30px] rounded-md">
              <div className="flex items-center justify-center">
                <figure className="w-[100px] h-[100px] rounded-full border-2 border-lime-500">
                  <img
                    src={userData.photo}
                    alt=""
                    className="w-full h-full rounded-full"
                  />
                </figure>
              </div>

              <div className="text-center mt-4">
                <h3 className="text-[18px] leading-[30px] text-headingColor font-bold">
                  {userData.name}
                </h3>
                <p className="text-textColor tetx-[15px] leading-6 font-medium">
                  {userData.email}
                </p>

                <p className="text-textColor tetx-[15px] leading-6 font-medium">
                  Blood type :
                  <span className="ml-2 text-headingColor text-[22px] leading-6">
                    {userData.bloodType}
                  </span>
                </p>
              </div>

              <div className="mt-[50px] md:mt-[100px]">
                <button
                  onClick={handleLogout}
                  className="w-full bg-lime-500 p-3 text-[16px] leading-7 rounded-md text-white"
                >
                  Logout
                </button>
                <button className="w-full bg-red-500 p-3 text-[16px] leading-7 mt-4 rounded-md text-white">
                  Delete accout
                </button>
              </div>
            </div>

            <div className="md:col-span-2 md:px-[30px]">
              <div>
                <button
                  onClick={() => setTab("bookings")}
                  className={`${
                    tab === "bookings" && "bg-lime-500 text-white font-normal"
                  } p-2 mr-5 px-5 rounded-md text-headingColor font-semibold text-[16px] leading-7 border border-solid border-lime-500`}
                >
                  My Bookings
                </button>

                <button
                  onClick={() => setTab("settings")}
                  className={` ${
                    tab === "settings" && "bg-lime-500 text-white font-normal "
                  } py-2 px-5  rounded-md text-headingColor font-semibold text-[16px] leading-7 border border-solid border-lime-500`}
                >
                  Profile Setting
                </button>
              </div>

              {tab === "bookings" && <Mybooking />}
              {tab === "settings" && <Profile userData={userData} />}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MyAccount;
