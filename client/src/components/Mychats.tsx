import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import "../css/loader.css";
import chat, {
  setChatloading,
  setchats,
  setdisplayusers,
  setloading,
  setsearchChat,
  setSinglechat,
  setuserInfo,
  setusersnull,
} from "../redux/reducers/chat";
import {
  setsnackbarMessage,
  setsnackbarclose,
  setsnackbarmode,
} from "../redux/reducers/signuporlogin";
import {
  setcloseornot,
  setEmailmodal,
  setname,
  setPic,
  setType,
  setgroupusers,
} from "../redux/reducers/popup";
import Loader from "./Loader";
import noti from "../assets/noti.svg";
import { getSender } from "../config/config";
import { setopenornot } from "../redux/reducers/groupchat";
import { setDisplayChatbox } from "../redux/reducers/mobile";
import { setNotifications } from "../redux/reducers/notifications";
type userInfo = {
  name: string;
  email: string;
  _id: string;
  pic: string;
  createdAt: string;
  updatedAt: string;
};

interface Chatarray extends userInfo {
  __v: number;
}

type Chatit = {
  createdAt: string;
  updatedAt: string;
  chatName: string;
  _id: string;
  isGroupchat: boolean;
  grpImage: string;
  __v: number;
  groupAdmin: userInfo;
  users: Array<Chatarray>;
};
function Mychats() {
  const userInfo = useSelector(
    (state: RootState) => state.signuporlogin.userInfo
  );
  const usersInfo = useSelector((state: RootState) => state.chat.usersInfo);
  const loading = useSelector((state: RootState) => state.chat.loading);
  const display = useSelector((state: RootState) => state.chat.displayusers);
  type myType = {
    name: string;
    latestMessage: string;
  };
  const userSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setsearchChat(e.target.value));
  };
  const notifications = useSelector(
    (state: RootState) => state.notification.notifications
  );
  const chats = useSelector((state: RootState) => state.chat.chats);
  const chatLoading = useSelector((state: RootState) => state.chat.Chatloading);
  const openModal = () => {
    if (userInfo) {
      dispatch(setType("chat"));
      dispatch(setcloseornot(true));
      dispatch(setEmailmodal(userInfo?.email));
      dispatch(setPic(userInfo?.pic));
      dispatch(setname(userInfo.name));
    }
  };
  const handlesearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!display) {
      if (searchChat) {
        dispatch(setloading(true));
        dispatch(setdisplayusers(true));
        fetch(`http://localhost:5000/api/user?search=${searchChat}`, {
          headers: {
            authorization: "Bearer " + userInfo?.token,
            "Content-type": "application/json",
          },
        }).then((res) => {
          if (res.ok) {
            res.json().then((res) => {
              if (res.length) {
                dispatch(setuserInfo(res));
              } else {
                dispatch(setuserInfo([]));
                dispatch(setusersnull(true));
              }
            });
          } else if (res.status === 401) {
          }
        });
        setTimeout(() => {
          dispatch(setloading(false));
        }, 1000);
      } else {
        dispatch(setsnackbarMessage("Please try unempty name or email"));
        dispatch(setsnackbarmode("Warning"));
        dispatch(setsnackbarclose(true));
      }
    } else {
      dispatch(setuserInfo([]));
      dispatch(setdisplayusers(false));
      dispatch(setsearchChat(""));
    }
  };

  const popup = () => {
    dispatch(setopenornot(true));
  };
  const sendChat = (chatId: string) => {
    // console.log(chatId);
    if (chatId) {
      dispatch(setChatloading(true));
      const data = { chatId: chatId };
      fetch(`http://localhost:5000/api/chat`, {
        method: "POST",
        headers: {
          authorization: "Bearer " + userInfo?.token,
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((res) => {
        if (res.ok) {
          res.json().then((res) => {
            dispatch(setuserInfo([]));
            dispatch(setdisplayusers(false));
            dispatch(setsearchChat(""));
            if (!chats.find((c) => c._id === chatId)) {
              let arr = [res, ...chats];
              dispatch(setchats(arr));
            }
          });
        } else if (res.status === 401) {
        } else {
          dispatch(setsnackbarMessage("Something wrong with server :("));
          dispatch(setsnackbarmode("Danger"));
          dispatch(setsnackbarclose(true));
        }
      });
      dispatch(setChatloading(false));
    }
  };
  const chatbox = useSelector(
    (state: RootState) => state.mobile.displaychatbox
  );
  const searchChat = useSelector((state: RootState) => state.chat.searchChat);
  const dispatch = useDispatch();

  const handleit = (p: Chatit | null) => {
    if (p) {
      dispatch(setSinglechat(p));
      dispatch(setDisplayChatbox(true));
    }
  };
  const [show, setshow] = useState(false);
  useEffect(() => {
    if (show === true) {
      setTimeout(() => {
        setshow(false);
      }, 2000);
    }
  }, [show]);

  const messages = useSelector((state: RootState) => state.message.messageChat);

  // useEffect(() => {
  //   if (localStorage.getItem("notifications") !== undefined) {
  //     dispatch(
  //       setNotifications(
  //         JSON.parse(localStorage.getItem("notifications") ?? "")
  //       )
  //     );
  //   }
  // }, []);
  return (
    <div
      className={`${
        chatbox ? "hidden" : "w-full flex flex-col"
      } ms:w-1/3 border ms:flex ms:flex-col`}
    >
      <div className="py-2 px-3 bg-[#F2F6F9] flex flex-row justify-between items-center">
        {/* Image showing logged in user's pic  */}
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
        {/* Button for creating group chat  */}
        <div className="flex">
          <div className="flex">
            <div className="ml-4 relative">
              <div className="relative">
                <img
                  src={noti}
                  alt="i"
                  className="cursor-pointer z-[100]"
                  style={{ opacity: "0.5" }}
                  onClick={() => setshow((prev) => !prev)}
                />
                {notifications && notifications.length ? (
                  <div
                    className="absolute z-[0] right-[-4px] px-[5px] 
                  bg-red-500 text-white top-[-6px] text-sm"
                    style={{ borderRadius: "50%" }}
                  >
                    {notifications?.length}
                  </div>
                ) : (
                  <></>
                )}
              </div>
              {show ? (
                <div className="absolute top-10 left-[-30vh] z-[100000000] px-4 py-1 bg-white border-[1px] border-black">
                  {notifications?.length ? (
                    <>
                      {notifications.map((item, index) => (
                        <>
                          <h1
                            className="z-[100000000] cursor-pointer"
                            onClick={() => {
                              dispatch(setDisplayChatbox(true));
                              dispatch(setSinglechat(item.chat));
                              dispatch(
                                setNotifications(
                                  notifications.filter((n) => n !== item)
                                )
                              );
                              localStorage.setItem(
                                "notifications",
                                JSON.stringify(notifications)
                              );
                              setshow(false);
                            }}
                          >{`New notification from ${
                            item.chat.isGroupchat && userInfo
                              ? item.chat.chatName
                              : userInfo
                              ? getSender(userInfo, item.chat.users).name
                              : ""
                          }`}</h1>
                          <hr />
                        </>
                      ))}
                    </>
                  ) : (
                    <h1 className="z-[100000000]">No messages found</h1>
                  )}
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="flex">
            <div className="ml-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="cursor-pointer"
                onClick={popup}
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
      </div>
      {/* Form for searching existing users */}
      {display ? (
        <>
          <div className="py-2 px-2 bg-[#f8fbfd] relative">
            <input
              type="text"
              className="w-full px-2 py-2 text-sm outline-none"
              placeholder="start new chat"
              value={searchChat}
              // onChange={(e) => userSearch(e)}
              readOnly
            />
            <button
              onClick={(e) => handlesearch(e)}
              className="absolute right-2 text-white bg-blue-700
         hover:bg-blue-800 font-medium rounded-sm text-sm px-3 py-1 mr-2 mt-1 mx-4"
            >
              X
            </button>
          </div>
        </>
      ) : (
        <form
          className="py-2 px-2 bg-[#f8fbfd] relative"
          onSubmit={(e) => {
            handlesearch(e);
            return false;
          }}
        >
          <input
            type="text"
            className="w-full px-2 py-2 text-sm outline-none"
            placeholder="start new chat"
            value={searchChat}
            onChange={(e) => userSearch(e)}
          />
          <button
            type="submit"
            className="absolute right-2 text-white bg-blue-700
         hover:bg-blue-800 font-medium rounded-sm text-sm px-3 py-1 mr-2 mt-1 mx-4"
          >
            Go
          </button>
        </form>
      )}

      {/* Here we have chats section like it shows all chats that are found */}

      {display ? (
        <div className="bg-grey-lighter flex-1 overflow-auto">
          {loading ? (
            <Loader middle={false} />
          ) : (
            <>
              {usersInfo.length ? (
                <>
                  <h1 className="ml-2 text-xl font-bold">Resultant users:</h1>
                  {usersInfo.map((chat, index) => (
                    <div
                      className="px-3 flex items-center bg-grey-light"
                      key={index}
                    >
                      <div>
                        <img
                          className="h-12 w-12 rounded-full cursor-pointer"
                          src={chat.pic}
                          onClick={() => {
                            dispatch(setType("chat"));
                            dispatch(setcloseornot(true));
                            dispatch(setEmailmodal(chat.email));
                            dispatch(setPic(chat.pic));
                            dispatch(setname(chat.name));
                          }}
                        />
                      </div>
                      <div
                        className="ml-4 flex-1 border-b border-grey-lighter py-4 cursor-pointer"
                        onClick={() => sendChat(chat._id)}
                      >
                        <div className="flex items-bottom justify-between">
                          <p className="text-grey-darkest">{chat.name}</p>
                          {/* <p className="text-xs text-grey-darkest">12:45 pm</p> */}
                        </div>
                        <div className="flex items-bottom justify-between">
                          <p className="text-grey-darkest">{chat.email}</p>
                          {/* <p className="text-xs text-grey-darkest">12:45 pm</p> */}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div className="px-3 flex items-center bg-grey-light text-[24px]">
                    <div className="ml-4 flex-1 py-4">
                      <div className="flex items-bottom justify-between">
                        <p className="text-grey-darkest">No users found</p>
                      </div>
                      <p className="text-grey-darkest">
                        Try using other keywords
                      </p>
                      <p className="text-grey-dark mt-1 text-sm"></p>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="bg-grey-100 flex-1 overflow-auto">
          {chatLoading ? (
            <>
              <Loader middle={false} />
            </>
          ) : (
            <>
              {chats.length ? (
                <>
                  {chats.map((chat, index) => (
                    <>
                      {chat.isGroupchat ? (
                        <>
                          <div
                            className="px-3 flex items-center bg-grey-light "
                            key={index}
                          >
                            <div>
                              <img
                                className="h-12 w-12 rounded-full cursor-pointer"
                                src={chat.grpImage}
                                onClick={() => {
                                  dispatch(setType("group"));
                                  dispatch(setcloseornot(true));
                                  dispatch(setPic(chat.grpImage));
                                  dispatch(setgroupusers(chat.users));
                                }}
                              />
                            </div>
                            <div
                              className="ml-4 flex-1 border-b border-grey-lighter py-4 cursor-pointer"
                              onClick={() => handleit(chat)}
                            >
                              <div className="flex items-bottom justify-between">
                                <p className="text-grey-darkest">
                                  {chat.chatName}
                                </p>
                              </div>
                              <p className="text-grey-dark mt-1 text-sm flex flex-wrap ">
                                {chat.users.map((item, index) => (
                                  <span key={index}>{item.name}&nbsp;</span>
                                ))}
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            className="px-3 flex items-center bg-grey-light"
                            key={index}
                          >
                            <div>
                              <img
                                className="h-12 w-12 rounded-full cursor-pointer"
                                src={
                                  userInfo
                                    ? getSender(userInfo, chat.users).pic
                                    : ""
                                }
                                onClick={() => {
                                  dispatch(setType("chat"));
                                  dispatch(setcloseornot(true));
                                  dispatch(
                                    setEmailmodal(
                                      userInfo
                                        ? getSender(userInfo, chat.users).email
                                        : ""
                                    )
                                  );
                                  dispatch(
                                    setPic(
                                      userInfo
                                        ? getSender(userInfo, chat.users).pic
                                        : ""
                                    )
                                  );
                                  dispatch(
                                    setname(
                                      userInfo
                                        ? getSender(userInfo, chat.users).name
                                        : ""
                                    )
                                  );
                                }}
                              />
                            </div>
                            <div
                              className="ml-4 flex-1 border-b border-grey-lighter py-4 cursor-pointer"
                              onClick={() => handleit(chat)}
                            >
                              <div className="flex items-bottom justify-between">
                                <p className="text-grey-darkest">
                                  {userInfo &&
                                    getSender(userInfo, chat.users).name}
                                </p>
                                <p className="text-xs text-grey-darkest">
                                  12:45 pm
                                </p>
                              </div>
                              <p className="text-grey-dark mt-1 text-sm">
                                {userInfo &&
                                  getSender(userInfo, chat.users).email}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  ))}
                </>
              ) : (
                <>
                  <div className="px-3 flex items-center bg-grey-light text-[24px]">
                    <div className="ml-4 flex-1 py-4">
                      <div className="flex items-bottom justify-between">
                        <p className="text-grey-darkest">No chats found</p>
                      </div>
                      <p className="text-grey-darkest">
                        Search users & create chat
                      </p>
                      <p className="text-grey-dark mt-1 text-sm"></p>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Mychats;
