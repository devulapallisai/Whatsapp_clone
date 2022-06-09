import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { setfetchAgain, setUserInfo } from "../redux/reducers/signuporlogin";
import { useNavigate } from "react-router-dom";
import { setcloseornot, setgroupusers, setname } from "../redux/reducers/popup";
import {
  setChatloading,
  setchats,
  setloading,
  setuserInfo,
} from "../redux/reducers/chat";
import { setsearchChat } from "../redux/reducers/chat";
import { setdisplayusers } from "../redux/reducers/chat";
import { setcloseornotremove, setgroupName } from "../redux/reducers/groupchat";

function Modal() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const type = useSelector((state: RootState) => state.popup.type);
  const pic = useSelector((state: RootState) => state.popup.pic);
  const email = useSelector((state: RootState) => state.popup.email);
  const name = useSelector((state: RootState) => state.popup.name);
  const groupusers = useSelector((state: RootState) => state.popup.groupusers);
  const logout = () => {
    localStorage.removeItem("userInfo");
    dispatch(setUserInfo(null));
    dispatch(setcloseornot(false));
    dispatch(setuserInfo([]));
    dispatch(setdisplayusers(false));
    dispatch(setsearchChat(""));
    dispatch(setname(""));
    dispatch(setchats([]));
    dispatch(setdisplayusers(false));
    dispatch(setUserInfo(null));
    dispatch(setcloseornotremove(false));
    dispatch(setgroupName(""));
    dispatch(setgroupusers([]));
    dispatch(setsearchChat(""));
    dispatch(setname(""));
    navigate("/");
  };
  return (
    <>
      <div
        id="popup-modal"
        tabIndex={-1}
        className={`overflow-y-auto overflow-x-hidden fixed top-0 
          right-0 left-0 z-50 md:inset-0 h-full bg-[#232223c9] flex justify-center items-center z-100000`}
      >
        <div className="relative w-full max-w-[360px] md:h-auto m-auto">
          <div
            className="relative bg-white rounded-lg shadow  border-2 
            border-black mx-auto"
          >
            <button
              type="button"
              className="absolute top-3 right-2.5 text-black bg-transparent
                 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              onClick={() => {
                dispatch(setcloseornot(false));
                dispatch(setname(""));
              }}
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            <div className="p-6 text-center">
              <img src={pic} alt="" className="w-[50%] mx-auto pb-2" />
              {type !== "group" ? (
                <>
                  <h3 className="text-[16px] font-normal ">Email : {email}</h3>
                  <h3 className="text-[16px] font-normal ">
                    Username : {name}
                  </h3>
                  {type === "user" && (
                    <>
                      <h3 className="mb-2 text-[16px] font-normal">
                        Do you want to logout?
                      </h3>
                      <button
                        data-modal-toggle="popup-modal"
                        type="button"
                        className="text-white bg-red-600 hover:bg-red-800 
                        outline-none font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                        onClick={() => logout()}
                      >
                        Logout
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <h3 className="text-[16px] font-normal ">Users :</h3>
                  <div className="flex flex-wrap">
                    {groupusers.map((item, index) => (
                      <h3
                        className="text-[16px] font-normal px-1 text-center justify-center items-center"
                        key={index}
                      >
                        {item.name}
                      </h3>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
