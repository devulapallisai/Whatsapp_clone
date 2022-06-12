import React, { DOMElement, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  setcloseornot,
  setPic,
  setEmailmodal,
  setType,
  setname,
} from "../redux/reducers/popup";
import typed from "../assets/typing.gif";
import img from "../assets/arrow.svg";
import { io, Socket } from "socket.io-client";
import {
  setsnackbarMessage,
  setsnackbarclose,
  setsnackbarmode,
} from "../redux/reducers/signuporlogin";
import notifications, {
  setNotifications,
} from "../redux/reducers/notifications";
import { setfetchAgain } from "../redux/reducers/signuporlogin";
import send from "../assets/send.svg";
import { setDisplayChatbox } from "../redux/reducers/mobile";
import { getSender } from "../config/config";
import settings from "../assets/settings.svg";
import { setgroupusers } from "../redux/reducers/popup";
import Updateorremove from "./Updateorremove";
import { setcloseornotremove } from "../redux/reducers/groupchat";
import { setmessage, setmessagechats } from "../redux/reducers/message";
import { setChatloading, setloading } from "../redux/reducers/chat";
import Loader from "./Loader";
import Messages from "./Messages";
import { setsocketconnected } from "../redux/reducers/scoket";

type userInfo = {
  name: string;
  email: string;
  _id: string;
  pic: string;
};
interface one extends userInfo {
  createdAt: string;
  updatedAt: string;
}
interface Chatarray extends userInfo {
  __v: number;
  createdAt: string;
  // token: string;
  updatedAt: string;
}

type another = {
  name: string;
  email: string;
  _id: string;
  pic: string;
  createdAt: string;
  // token: string;
  updatedAt: string;
};
type Chatit = {
  createdAt: string;
  updatedAt: string;
  chatName: string;
  _id: string;
  isGroupchat: boolean;
  grpImage: string;
  __v: number;
  users: Array<Chatarray>;
  groupAdmin: another;
};

type chat = {
  searchChat: string;
  loading: boolean;
  usersInfo: Array<one> | [];
  usersnull: boolean;
  displayusers: boolean;
  chats: Array<Chatit> | [];
  Chatloading: boolean;
  singleChat: Chatit | null;
  _id: string;
};

type user = {
  name: string;
  email: string;
  _id: string;
  pic: string;
};

type messagechats = {
  chat: chat;
  sender: user;
  content: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  _id: string;
};

type messageChat1 = {
  chat: Chatit;
  sender: user;
  content: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  _id: string;
};

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  connected: () => void;
  "message recieved": (newMessageRecieved: messageChat1) => void;
  typing: () => void;
  "stop typing": () => void;
}

interface ClientToServerEvents {
  "stop typing": (id: string) => void;
  setup: (e: userInfo) => void;
  "join chat": (e: string) => void;
  hello: () => void;
  "new message": (e: messageChat1) => {};
  typing: (e: string) => {};
}

var ENDPOINT = "https://whatsappwebbackend.herokuapp.com";
var selectedCompare,
  socket: Socket<ServerToClientEvents, ClientToServerEvents>,
  selectedChatCompare: Chatit | null;

function ChatBox() {
  const dispatch = useDispatch();
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const userInfo = useSelector(
    (state: RootState) => state.signuporlogin.userInfo
  );
  const messages = useSelector((state: RootState) => state.message.messageChat);
  useEffect(() => {
    if (userInfo != null) {
      socket = io(ENDPOINT, {
        withCredentials: true,
      });
      socket.emit("setup", userInfo);
      socket.on("connected", () => {
        dispatch(setsocketconnected(true));
      });
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));
    }
  }, []);
  const socketConnected = useSelector(
    (state: RootState) => state.socket.socketconnected
  );
  const modalit = () => {
    if (userInfo) {
      dispatch(setType("user"));
      dispatch(setcloseornot(true));
      dispatch(setEmailmodal(userInfo?.email));
      dispatch(setPic(userInfo?.pic));
      dispatch(setname(userInfo?.name));
    }
  };
  const chatbox = useSelector(
    (state: RootState) => state.mobile.displaychatbox
  );
  const closeornot = useSelector(
    (state: RootState) => state.groupchat.closeornot
  );
  const selectedChat = useSelector((state: RootState) => state.chat.singleChat);
  const fetchAgain = useSelector(
    (state: RootState) => state.signuporlogin.fetchAgain
  );
  const message = useSelector((state: RootState) => state.message.message);
  const [messagesState, setMessages] = useState<Array<messagechats> | []>([]);

  const typingHandler = () => {
    if (!socketConnected) return;

    if (selectedChat) {
      if (!typing) {
        setTyping(true);
        socket.emit("typing", selectedChat._id);
      }
      let lastTypingTime = new Date().getTime();
      var timerLength = 3000;
      setTimeout(() => {
        var timeNow = new Date().getTime();
        var timeDiff = timeNow - lastTypingTime;
        if (timeDiff >= timerLength && typing) {
          socket.emit("stop typing", selectedChat._id);
          setTyping(false);
        }
      }, timerLength);
    }
  };

  const handlecreatemessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedChat) {
      socket.emit("stop typing", selectedChat._id);
    }
    // dispatch(setChatloading(true));
    var rep = fetch("https://whatsappwebbackend.herokuapp.com/api/message/", {
      headers: {
        authorization:
          "Bearer " + JSON.parse(localStorage.getItem("userInfo") ?? "").token,
        "Content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        chatId: selectedChat?._id,
        content: message,
        // chatName: groupName,
      }),
    }).then((res) => {
      if (res.ok) {
        res.json().then((rep) => {
          if (messages) {
            let arr = [...messages, rep];
            setMessages(arr);
            socket.emit("new message", rep);
            dispatch(setmessagechats(arr));
          } else {
            let arr = [rep];
            setMessages(arr);

            socket.emit("new message", rep);
            dispatch(setmessagechats(arr));
          }
        });
        // dispatch(setfetchAgain(!fetchAgain));
        // dispatch(setChatloading(false));
      } else if (res.status === 401) {
      } else {
        dispatch(setsnackbarMessage("Unable to create new message"));
        dispatch(setsnackbarmode("Danger"));
        dispatch(setsnackbarclose(true));
        dispatch(setloading(false));
      }
    });
    // if (messages) {
    // }
    dispatch(setmessage(""));
  };
  const [loader, setloader] = useState(true);
  const messageEl = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let h = messageEl.current?.scrollHeight;
    if (h) {
      messageEl.current?.scrollTo(0, h);
    }
  });

  useEffect(() => {
    if (selectedChat) {
      // dispatch(setmessage(""));
      socket.emit("stop typing", selectedChat._id);
    }
    if (selectedChat) {
      setloader(true);
      fetch(
        `https://whatsappwebbackend.herokuapp.com/api/message/${selectedChat?._id}`,
        {
          headers: {
            authorization:
              "Bearer " +
              JSON.parse(localStorage.getItem("userInfo") ?? "").token,
            "Content-type": "application/json",
          },
          method: "GET",
        }
      ).then((res) => {
        if (res.ok) {
          res.json().then((rep) => {
            dispatch(setmessagechats(rep));
          });
          // dispatch(setfetchAgain(!fetchAgain));
          setloader(false);
        } else if (res.status === 401) {
        } else {
          dispatch(setsnackbarMessage("Unable to fetch messages"));
          dispatch(setsnackbarmode("Danger"));
          setloader(false);
          dispatch(setsnackbarclose(true));
        }
        socket.emit("join chat", selectedChat._id);
      });
    }
    selectedChatCompare = selectedChat;
    dispatch(setmessage(""));
  }, [selectedChat]);

  const notification = useSelector(
    (state: RootState) => state.notification.notifications
  );

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (
          notification &&
          !notification.find(
            (c) =>
              c.chat._id === newMessageRecieved.chat._id &&
              c.content === newMessageRecieved.content
          )
        ) {
          localStorage.setItem("notifications", JSON.stringify(notification));
          dispatch(setNotifications([newMessageRecieved, ...notification]));
          // dispatch(setfetchAgain(!fetchAgain));
        } else if (!notification) {
          console.log("notifications second", notification);
          localStorage.setItem("notifications", JSON.stringify(notification));
          dispatch(setNotifications([newMessageRecieved]));
          // dispatch(setfetchAgain(!fetchAgain));
        }
      } else {
        if (messages) {
          dispatch(setmessagechats([...messages, newMessageRecieved]));
        }
      }
    });
  });

  return (
    <div
      className={`${
        chatbox ? "flex flex-col w-full" : "hidden"
      } ms:w-2/3 border ms:flex flex-col ${loader ? "bg-white" : ""}`}
    >
      <>
        {loader ? (
          <Loader middle />
        ) : (
          <>
            {selectedChat && !selectedChat.isGroupchat ? (
              <>
                <div className="py-2 px-3 bg-[#F2F6F9] flex flex-row justify-between items-center">
                  <div className="flex ms:hidden">
                    <div className="ml-[-12px]">
                      <img
                        src={img}
                        alt="Im"
                        className="cursor-pointer"
                        style={{ transform: "scale(0.5)" }}
                        onClick={() => {
                          dispatch(setDisplayChatbox(false));
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div>
                      <img
                        className="w-10 h-10 rounded-full cursor-pointer"
                        src={
                          userInfo
                            ? getSender(userInfo, selectedChat.users).pic
                            : ""
                        }
                        onClick={() => {
                          dispatch(setType("chat"));
                          dispatch(setcloseornot(true));
                          dispatch(
                            setEmailmodal(
                              userInfo
                                ? getSender(userInfo, selectedChat.users).email
                                : ""
                            )
                          );
                          dispatch(
                            setPic(
                              userInfo
                                ? getSender(userInfo, selectedChat.users).pic
                                : ""
                            )
                          );
                          dispatch(
                            setname(
                              userInfo
                                ? getSender(userInfo, selectedChat.users).name
                                : ""
                            )
                          );
                        }}
                      />
                    </div>
                    <div className="ml-1">
                      <p className="text-grey-darkest">
                        &nbsp;&nbsp;
                        {userInfo
                          ? getSender(userInfo, selectedChat.users).name
                          : ""}
                      </p>
                      {/* <p className="text-grey-darker text-xs mt-1">
                  Andrés, Tom, Harrison, Arnold, Sylvester
                </p> */}
                    </div>
                  </div>

                  <div className="flex">
                    <div className="ml-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        onClick={() => modalit()}
                        style={{ cursor: "pointer" }}
                      >
                        <path
                          fill="#263238"
                          fillOpacity=".6"
                          d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div
                  className="flex-1 overflow-auto"
                  style={{ backgroundColor: "#DAD3CC" }}
                  id="hello"
                  ref={messageEl}
                >
                  <div className="py-2 px-3">
                    <div className="flex justify-center mb-4">
                      <div
                        className="rounded py-2 px-4"
                        style={{ backgroundColor: "#FCF4CB" }}
                      >
                        <p className="text-xs">
                          Messages to this chat and calls are now secured with
                          end-to-end encryption. Tap for more info.
                        </p>
                      </div>
                    </div>
                    <div>
                      {messages?.map((item, index) => (
                        <>
                          {item.sender._id === userInfo?._id ? (
                            <Messages
                              type="justify-end"
                              sender={item.sender.name}
                              message={item.content}
                              key={index}
                            />
                          ) : (
                            <Messages
                              type=""
                              sender={item.sender.name}
                              message={item.content}
                              key={index}
                            />
                          )}
                        </>
                      ))}
                      {istyping ? (
                        <img src={typed} className="max-w-[60px]" />
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-grey-lighter px-4 py-4 flex items-center">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                    >
                      <path
                        opacity=".45"
                        fill="#263238"
                        d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.078 1.416-12.129 0-12.129 0zm11.363 1.108s-.669 1.959-5.051 1.959c-3.505 0-5.388-1.164-5.607-1.959 0 0 5.912 1.055 10.658 0zM11.804 1.011C5.609 1.011.978 6.033.978 12.228s4.826 10.761 11.021 10.761S23.02 18.423 23.02 12.228c.001-6.195-5.021-11.217-11.216-11.217zM12 21.354c-5.273 0-9.381-3.886-9.381-9.159s3.942-9.548 9.215-9.548 9.548 4.275 9.548 9.548c-.001 5.272-4.109 9.159-9.382 9.159zm3.108-9.751c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962z"
                      ></path>
                    </svg>
                  </div>
                  <form
                    className="flex w-full mx-4"
                    onSubmit={(e) => {
                      handlecreatemessage(e);
                      return false;
                    }}
                  >
                    <input
                      className="w-full border rounded px-2 py-2 outline-none"
                      type="text"
                      value={message}
                      required
                      onChange={(e) => {
                        dispatch(setmessage(e.target.value));
                        typingHandler();
                      }}
                    />
                    <div className="mx-1 my-auto">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                      >
                        <path
                          fill="#263238"
                          fillOpacity=".45"
                          d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.469 2.35 8.469 4.35v7.061c0 2.001 1.53 3.531 3.53 3.531zm6.238-3.53c0 3.531-2.942 6.002-6.237 6.002s-6.237-2.471-6.237-6.002H3.761c0 4.001 3.178 7.297 7.061 7.885v3.884h2.354v-3.884c3.884-.588 7.061-3.884 7.061-7.885h-2z"
                        ></path>
                      </svg>
                    </div>
                    <div className="mx-1 my-auto">
                      <button type="submit" className="flex">
                        <img
                          src={send}
                          alt="Img"
                          className=""
                          style={{
                            transform: "scale(1.1)",
                            filter: "opacity(50%)",
                          }}
                        />
                        <span className="invisible">he</span>
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              // For group chat we have different UI
              <>
                {closeornot && <Updateorremove />}
                <div className="py-2 px-3 bg-[#F2F6F9] flex flex-row justify-between items-center">
                  <div className="flex ms:hidden">
                    <div className="ml-[-12px]">
                      <img
                        src={img}
                        alt="Im"
                        className="cursor-pointer"
                        onClick={() => {
                          dispatch(setDisplayChatbox(false));
                        }}
                        style={{ transform: "scale(0.5)" }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div>
                      <img
                        className="w-10 h-10 rounded-full cursor-pointer"
                        src={selectedChat?.grpImage}
                        onClick={() => {
                          if (selectedChat) {
                            dispatch(setType("group"));
                            dispatch(setcloseornot(true));
                            dispatch(setPic(selectedChat.grpImage));
                            dispatch(setgroupusers(selectedChat.users));
                          }
                        }}
                      />
                    </div>
                    <div className="ml-2">
                      <div className="flex justify-between w-full">
                        <p className="text-grey-darkest font-bold pr-2">
                          {selectedChat?.chatName}
                        </p>
                      </div>
                      <p className="text-grey-darker text-[14px]">
                        {selectedChat?.users.map((item, index) => (
                          <span key={index}>{item.name} </span>
                        ))}
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <p className="text-grey-darkest font-bold my-auto">
                      Admin : {selectedChat?.groupAdmin.name}
                    </p>
                    <div className="flex my-auto">
                      <div className="ml-1">
                        <img
                          src={settings}
                          alt=""
                          onClick={() => dispatch(setcloseornotremove(true))}
                          className="cursor-pointer"
                          style={{ transform: "scale(0.5)" }}
                        />
                      </div>
                    </div>
                    <div className="flex my-auto">
                      <div className="ml-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          onClick={() => modalit()}
                          style={{ cursor: "pointer" }}
                        >
                          <path
                            fill="#263238"
                            fillOpacity=".6"
                            d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="flex-1 overflow-auto"
                  ref={messageEl}
                  style={{ backgroundColor: "#DAD3CC" }}
                >
                  <div className="py-2 px-3">
                    <div className="flex justify-center mb-4">
                      <div
                        className="rounded py-2 px-4"
                        style={{ backgroundColor: "#FCF4CB" }}
                      >
                        <p className="text-xs">
                          Messages to this chat and calls are now secured with
                          end-to-end encryption. Tap for more info.
                        </p>
                      </div>
                    </div>
                    <div>
                      {messages?.map((item, index) => (
                        <>
                          {item.sender._id === userInfo?._id ? (
                            <Messages
                              type="justify-end"
                              sender={item.sender.name}
                              message={item.content}
                              key={index}
                            />
                          ) : (
                            <Messages
                              type=""
                              key={index}
                              sender={item.sender.name}
                              message={item.content}
                            />
                          )}
                        </>
                      ))}
                      {istyping ? (
                        <img src={typed} className="max-w-[60px]" />
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-grey-lighter px-4 py-4 flex items-center">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                    >
                      <path
                        opacity=".45"
                        fill="#263238"
                        d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.078 1.416-12.129 0-12.129 0zm11.363 1.108s-.669 1.959-5.051 1.959c-3.505 0-5.388-1.164-5.607-1.959 0 0 5.912 1.055 10.658 0zM11.804 1.011C5.609 1.011.978 6.033.978 12.228s4.826 10.761 11.021 10.761S23.02 18.423 23.02 12.228c.001-6.195-5.021-11.217-11.216-11.217zM12 21.354c-5.273 0-9.381-3.886-9.381-9.159s3.942-9.548 9.215-9.548 9.548 4.275 9.548 9.548c-.001 5.272-4.109 9.159-9.382 9.159zm3.108-9.751c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962z"
                      ></path>
                    </svg>
                  </div>
                  <form
                    className="flex w-full mx-4"
                    onSubmit={(e) => {
                      handlecreatemessage(e);
                      return false;
                    }}
                  >
                    <input
                      className="w-full border rounded px-2 py-2 outline-none"
                      type="text"
                      value={message}
                      required
                      onChange={(e) => {
                        dispatch(setmessage(e.target.value));
                        typingHandler();
                      }}
                    />
                    <div className="mx-1 my-auto">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                      >
                        <path
                          fill="#263238"
                          fillOpacity=".45"
                          d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.469 2.35 8.469 4.35v7.061c0 2.001 1.53 3.531 3.53 3.531zm6.238-3.53c0 3.531-2.942 6.002-6.237 6.002s-6.237-2.471-6.237-6.002H3.761c0 4.001 3.178 7.297 7.061 7.885v3.884h2.354v-3.884c3.884-.588 7.061-3.884 7.061-7.885h-2z"
                        ></path>
                      </svg>
                    </div>
                    <div className="mx-1 my-auto">
                      <button type="submit" className="flex">
                        <img
                          src={send}
                          alt="Img"
                          className=""
                          style={{
                            transform: "scale(1.1)",
                            filter: "opacity(50%)",
                          }}
                        />
                        <span className="invisible">he</span>
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </>
        )}
      </>
    </div>
  );
}

export default ChatBox;
