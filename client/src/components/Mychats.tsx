import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import chat, { setsearchChat } from "../redux/chat";
import {
  setsnackbarMessage,
  setsnackbarclose,
  setsnackbarmode,
} from "../redux/signuporlogin";
import { setcloseornot, setEmailmodal, setPic, setType } from "../redux/popup";

function Mychats() {
  const userInfo = useSelector(
    (state: RootState) => state.signuporlogin.userInfo
  );
  type myType = {
    name: string;
    latestMessage: string;
  };
  const userSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setsearchChat(e.target.value));
  };
  const chats: Array<myType> = [
    {
      name: "hello",
      latestMessage: "Hi rey",
    },
    {
      name: "hello",
      latestMessage: "Hi rey",
    },
    {
      name: "hello",
      latestMessage: "Hi rey",
    },
    {
      name: "hello",
      latestMessage: "Hi rey",
    },
    {
      name: "hello",
      latestMessage: "Hi rey",
    },
  ];
  useEffect(() => {
    // fetch("http://localhost:5000/api/chat/", {
    //   headers: {},
    // });
  }, []);
  const openModal = () => {
    if (userInfo) {
      dispatch(setType("chat"));
      dispatch(setcloseornot(true));
      dispatch(setEmailmodal(userInfo?.email));
      dispatch(setPic(userInfo?.pic));
    }
  };
  const handlesearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchChat) {
      fetch(`http://localhost:5000/api/user?search=${searchChat}`, {
        headers: {
          authorization: "Bearer " + userInfo?.token,
          "Content-type": "application/json",
        },
      }).then((res) => {
        if (res.ok) {
          res.json().then((res) => console.log(res));
        }
      });
    } else {
      dispatch(setsnackbarMessage("Please try unempty name or email"));
      dispatch(setsnackbarmode("Warning"));
      dispatch(setsnackbarclose(true));
    }
  };
  const searchChat = useSelector((state: RootState) => state.chat.searchChat);
  const dispatch = useDispatch();
  return (
    <div className="w-1/3 border flex flex-col">
      <div className="py-2 px-3 bg-grey-lighter flex flex-row justify-between items-center">
        <div>
          <img
            className="w-10 h-10 rounded-full cursor-pointer"
            src={
              userInfo && userInfo.pic !== ""
                ? userInfo.pic
                : "https://imgs.search.brave.com/EK02tuos8b2SxHpUpDI4XnqIQKvn6DRXe2UVykEMpDY/rs:fit:900:900:1/g:ce/aHR0cDovL3d3dy5l/bW1lZ2kuY28udWsv/d3AtY29udGVudC91/cGxvYWRzLzIwMTkv/MDEvVXNlci1JY29u/LmpwZw"
            }
            onClick={() => openModal()}
          />
        </div>

        <div className="flex">
          <div className="ml-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path
                opacity=".55"
                fill="#263238"
                d="M19.005 3.175H4.674C3.642 3.175 3 3.789 3 4.821V21.02l3.544-3.514h12.461c1.033 0 2.064-1.06 2.064-2.093V4.821c-.001-1.032-1.032-1.646-2.064-1.646zm-4.989 9.869H7.041V11.1h6.975v1.944zm3-4H7.041V7.1h9.975v1.944z"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <form
        className="py-2 px-2 bg-grey-lightest relative"
        onSubmit={(e) => {
          handlesearch(e);
          return false;
        }}
      >
        <input
          type="text"
          className="w-full px-2 py-2 text-sm outline-none"
          placeholder="Search or start new chat"
          value={searchChat}
          onChange={(e) => userSearch(e)}
        />
        <button
          type="submit"
          className="absolute right-2 text-white bg-blue-700
         hover:bg-blue-800 font-medium rounded-lg text-sm px-3 py-1 mr-2 mt-1 mx-4"
        >
          Go
        </button>
      </form>

      {/* Here we have chats section like it shows all chats that are found */}

      <div className="bg-grey-lighter flex-1 overflow-auto">
        {chats.length ? (
          <>
            {chats.map((chat, index) => (
              <div
                className="px-3 flex items-center bg-grey-light cursor-pointer"
                key={index}
              >
                <div>
                  <img
                    className="h-12 w-12 rounded-full"
                    src="https://darrenjameseeley.files.wordpress.com/2014/09/expendables3.jpeg"
                  />
                </div>
                <div className="ml-4 flex-1 border-b border-grey-lighter py-4">
                  <div className="flex items-bottom justify-between">
                    <p className="text-grey-darkest">{chat.name}</p>
                    <p className="text-xs text-grey-darkest">12:45 pm</p>
                  </div>
                  <p className="text-grey-dark mt-1 text-sm">
                    {chat.latestMessage}
                  </p>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="px-3 flex items-center bg-grey-light text-[24px]">
              <div className="ml-4 flex-1 py-4">
                <div className="flex items-bottom justify-between">
                  <p className="text-grey-darkest">No chats found</p>
                </div>
                <p className="text-grey-darkest">Search users & create chat</p>
                <p className="text-grey-dark mt-1 text-sm"></p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Mychats;
