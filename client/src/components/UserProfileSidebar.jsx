import React from 'react';

import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOut,
} from "../redux/user/userSlice";
import { SiShopware } from "react-icons/si";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { MdOutlineCancel } from "react-icons/md";
import { links } from "./UserSidebarContent";
import { showSidebarOrNot } from "../redux/adminSlices/adminDashboardSlice/DashboardSlice";
import { CiLogout } from "react-icons/ci";

const UserProfileSidebar = () => {
  const { activeMenu, screenSize } = useSelector(
    (state) => state.adminDashboardSlice
  );

  const { currentUser, isLoading } = useSelector(
    (state) => state.user
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const activeLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-black bg-blue-50 text-md  m-2";
  const normalLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg  text-md text-gray-700   dark:hover:text-black hover:bg-slate-100 m-2";

  const handleSignout = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/signout`, {
        method: "GET",
        credentials: 'include'
      });
      
      if (res.ok) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        dispatch(signOut());
        navigate("/signin");
      }
    } catch (error) {
      console.error("Signout error:", error);
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        dispatch(deleteUserFailure(data));
        return;
      }
      
      dispatch(deleteUserSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link
              to={`/`}
              className="items-center flex gap-3 mt-4 ml-3 text-xl font-extrabold text-black tracking-tight"
            >
              <SiShopware />
              VelociFleet
            </Link>
            <TooltipComponent content={"menu"} position="BottomCenter">
              <button
                className="text-xl rounded-full p-3 mt-4 block  hover:bg-gray-500"
                onClick={() => {dispatch(showSidebarOrNot(false))}}
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>
          
          <div className="mt-10">
            {links.map((cur, idx) => (
              <div key={idx}>
                {cur.links.map((link) => (
                  <NavLink
                    to={`/profile/${link.name}`}
                    key={link.name}
                    onClick={() => {
                      if (screenSize <= 900 && activeMenu) {
                        dispatch(showSidebarOrNot(false));
                      }
                    }}
                    className={({ isActive }) =>
                      isActive ? activeLink : normalLink
                    }
                  >
                    {link.icon}
                    <span className="capitalize text-gray-600">
                      {link.name}
                    </span>
                  </NavLink>
                ))}
              </div>
            ))}

            <div className="flex flex-col gap-y-5">
              <div className="flex items-center mt-10 gap-2">
                <button
                  type="button"
                  className="ml-4 text-red-400"
                  onClick={handleSignout}
                >
                  SignOut
                </button>
                <CiLogout />
              </div>
              
              <div className="ml-4">
                <button
                  className="text-red-400"
                  onClick={handleDelete}
                  type="button"
                >
                  {isLoading ? "Loading..." : "Delete User"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfileSidebar;