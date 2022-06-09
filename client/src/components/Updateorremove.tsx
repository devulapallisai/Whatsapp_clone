import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setcloseornotremove } from "../redux/reducers/groupchat";
import { RootState } from "../redux/store";
import { setgroupName } from "../redux/reducers/groupchat";
import {
  setsnackbarMessage,
  setsnackbarclose,
  setsnackbarmode,
  setfetchAgain,
} from "../redux/reducers/signuporlogin";
import {
  setcloseornot,
  setEmailmodal,
  setname,
  setPic,
  setType,
} from "../redux/reducers/popup";
type userInfo = {
  name: string;
  email: string;
  _id: string;
  pic: string;
  createdAt: string;
  updatedAt: string;
};
function Updateorremove() {
  const dispatch = useDispatch();
  const groupName = useSelector(
    (state: RootState) => state.groupchat.groupName
  );
  const userinfo = useSelector(
    (state: RootState) => state.signuporlogin.userInfo
  );
  const updateGrp = () => {
    if (userinfo?._id === selectedChat?.groupAdmin._id) {
      if (groupName) {
        fetch("http://localhost:5000/api/chat/group/rename", {
          headers: {
            authorization:
              "Bearer " +
              JSON.parse(localStorage.getItem("userInfo") ?? "").token,
            "Content-type": "application/json",
          },
          method: "PUT",
          body: JSON.stringify({
            chatId: selectedChat?._id,
            chatName: groupName,
          }),
        }).then((res) => {
          if (res.ok) {
            dispatch(setsnackbarMessage("Group name updated"));
            dispatch(setsnackbarmode("success"));
            dispatch(setsnackbarclose(true));
            dispatch(setfetchAgain(!fetchAgain));
          } else {
            dispatch(setsnackbarMessage("Group name didn't update"));
            dispatch(setsnackbarmode("Danger"));
            dispatch(setsnackbarclose(true));
          }
        });
        dispatch(setgroupName(""));
      } else {
        dispatch(setsnackbarMessage("Empty group name"));
        dispatch(setsnackbarmode("Warning"));
        dispatch(setsnackbarclose(true));
      }
    } else {
      dispatch(setsnackbarMessage("Cannot update group. You are not admin"));
      dispatch(setsnackbarmode("Danger"));
      dispatch(setsnackbarclose(true));
    }
    dispatch(setcloseornotremove(false));
  };
  const selectedChat = useSelector((state: RootState) => state.chat.singleChat);
  const fetchAgain = useSelector(
    (state: RootState) => state.signuporlogin.fetchAgain
  );
  const remove = (item: userInfo) => {
    if (userinfo?._id === selectedChat?.groupAdmin._id) {
      if (item._id && selectedChat) {
        if (item.name === selectedChat.groupAdmin.name) {
          dispatch(setsnackbarMessage("Cannot delete admin"));
          dispatch(setsnackbarmode("Danger"));
          dispatch(setsnackbarclose(true));
        } else {
          fetch("http://localhost:5000/api/chat/group/remove", {
            headers: {
              authorization:
                "Bearer " +
                JSON.parse(localStorage.getItem("userInfo") ?? "").token,
              "Content-type": "application/json",
            },
            method: "PUT",
            body: JSON.stringify({
              chatId: selectedChat?._id,
              userId: item._id,
            }),
          }).then((res) => {
            if (res.ok) {
              dispatch(setsnackbarMessage("User successfully deleted"));
              dispatch(setsnackbarmode("success"));
              dispatch(setsnackbarclose(true));
              dispatch(setfetchAgain(!fetchAgain));
            } else {
              dispatch(setsnackbarMessage("Group didn't update"));
              dispatch(setsnackbarmode("Danger"));
              // dispatch(setsnackbarclose(!fetchAgain));
            }
          });
          dispatch(setgroupName(""));
        }
      }
    } else {
      dispatch(setsnackbarMessage("Cannot update group. You are not admin"));
      dispatch(setsnackbarmode("Danger"));
      dispatch(setsnackbarclose(true));
    }
    dispatch(setcloseornotremove(false));
  };
  const [search, setsearch] = useState("");
  const [searchresults, setsearchresults] = useState<Array<userInfo> | []>([]);

  const handlesubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    setsearch(e.target.value);
    if (search) {
      fetch(`http://localhost:5000/api/user?search=${e.target.value}`, {
        headers: {
          authorization: "Bearer " + userinfo?.token,
          "Content-type": "application/json",
        },
      }).then((res) => {
        if (res.ok) {
          res.json().then((res) => {
            if (res.length) {
              setsearchresults(res);
            } else {
              dispatch(setsnackbarMessage("No users found"));
              dispatch(setsnackbarmode("Warning"));
              dispatch(setsnackbarclose(true));
              setsearchresults([]);
            }
          });
        }
      });
    }
  };
  const [clickedchat, setclickedchat] = useState<userInfo | null>(null);
  const sendToserver = () => {
    if (userinfo?._id === selectedChat?.groupAdmin._id) {
      if (clickedchat) {
        if (!selectedChat?.users.find((c) => c._id == clickedchat._id)) {
          fetch(`http://localhost:5000/api/chat/group/addTogroup`, {
            method: "PUT",
            headers: {
              authorization: "Bearer " + userinfo?.token,
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              chatId: selectedChat?._id,
              userId: clickedchat._id,
            }),
          }).then((res) => {
            if (res.ok) {
              res.json().then((res) => {
                dispatch(setfetchAgain(!fetchAgain));
                setsearch("");
                setcloseornotremove(true);
                dispatch(setsnackbarMessage("Added new user successfully"));
                dispatch(setsnackbarmode("Success"));
                dispatch(setsnackbarclose(true));
                setsearchresults([]);
                setsearch("");
              });
            } else {
              dispatch(setsnackbarMessage("Something went wrong"));
              dispatch(setsnackbarmode("Danger"));
              dispatch(setsnackbarclose(true));
              setsearchresults([]);
            }
          });
        } else {
          dispatch(setsnackbarMessage("User already exists"));
          dispatch(setsnackbarmode("Warning"));
          dispatch(setsnackbarclose(true));
          setsearchresults([]);
        }
      }
    } else {
      dispatch(setsnackbarMessage("You are not an admin"));
      dispatch(setsnackbarmode("Warning"));
      dispatch(setsnackbarclose(true));
      setsearchresults([]);
    }
  };
  return (
    <>
      <div
        id="popup-modal"
        tabIndex={-1}
        className={`overflow-y-auto overflow-x-hidden fixed top-0 
      right-0 left-0 md:inset-0 h-full bg-[#232223c9] flex justify-center items-center z-0`}
      >
        <div className="relative w-full max-w-[500px]  md:h-auto m-auto">
          <div
            className="relative bg-white rounded-lg shadow  border-2 
        border-black mx-auto"
          >
            <button
              type="button"
              className="absolute top-3 right-2.5 text-black bg-transparent
             hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              onClick={() => {
                dispatch(setcloseornotremove(false));
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
            <div className="p-10">
              <h1 className="text-center text-2xl font-600 my-1">
                Update group settings
              </h1>
              <h1 className="text-center text-lg font-600 my-1">
                Admin : {selectedChat?.groupAdmin.name}
              </h1>
              <h1 className="text-center text-lg font-600 my-1">
                Groupname : {selectedChat?.chatName}
              </h1>
              <div className="w-[100%] h-[1px] border-b-2  border-dashed border-[#535853]"></div>
              <h1 className="text-center text-lg font-600 my-2">
                Delete users in group
              </h1>
              <div className="flex flex-wrap">
                {selectedChat?.users &&
                  selectedChat.users.map((item, index) => (
                    <div
                      className="flex justify-center items-center m-1 font-medium py-1 px-2 rounded-full text-indigo-100 bg-orange-500 border border-orange-500 w-auto"
                      key={index}
                    >
                      <div className="text-xs font-normal leading-none max-w-full flex-initial">
                        {item.name}
                      </div>
                      <div className="flex flex-auto flex-row-reverse">
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="100%"
                            height="100%"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-x cursor-pointer hover:text-indigo-400 rounded-full w-4 h-4 ml-2"
                            onClick={() => remove(item)}
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <br />
              <div className="flex">
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300
                   text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full
             p-2.5 outline-none rounded-sm"
                  placeholder="Update Group Name"
                  required
                  name="name"
                  onChange={(e) => dispatch(setgroupName(e.target.value))}
                  value={groupName}
                />
                <button
                  data-modal-toggle="popup-modal"
                  type="button"
                  className="text-white bg-green-600 hover:bg-green-800
                   outline-none font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center ml-2"
                  onClick={() => updateGrp()}
                >
                  Update
                </button>
              </div>
              <br />
              <div className="flex">
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300
                  text-gray-900 text-sm focus:ring-blue-500 
                 
                  focus:border-blue-500 block w-full
            p-2.5 outline-none rounded-sm"
                  placeholder="Add member"
                  value={search}
                  onChange={(e) => handlesubmit(e)}
                />
                <button
                  data-modal-toggle="popup-modal"
                  type="button"
                  className="text-white bg-blue-600 hover:bg-blue-800
                   outline-none font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center ml-2"
                  // onClick={() => updateGrp()}
                  onClick={() => sendToserver()}
                >
                  &nbsp;&nbsp;Add&nbsp;&nbsp;
                </button>
              </div>
              <br />
              {search ? (
                <>
                  {searchresults.length ? (
                    <>
                      <h1 className="ml-2 text-xl font-bold">
                        Resultant users:
                      </h1>
                      <div className="max-h-[250px] overflow-y-scroll scrollview">
                        {searchresults.map((chat, index) => (
                          <div
                            className="px-3 flex items-center bg-grey-light hover:bg-slate-400 hover:rounded-lg"
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
                              className="ml-3 flex-1 border-b border-grey-lighter py-4 cursor-pointer"
                              onClick={() => {
                                setclickedchat(chat);
                                setsearchresults([]);
                                setsearch(chat.name);
                              }}
                            >
                              <div className="flex items-bottom justify-between">
                                <p className="text-grey-darkest">{chat.name}</p>
                              </div>
                              <div className="flex items-bottom justify-between">
                                <p className="text-grey-darkest">
                                  {chat.email}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <br />
                    </>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Updateorremove;
