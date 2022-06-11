import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setgroupName,
  setloading,
  setopenornot,
} from "../redux/reducers/groupchat";
import { RootState } from "../redux/store";
import {
  setsnackbarMessage,
  setsnackbarclose,
  setsnackbarmode,
} from "../redux/reducers/signuporlogin";
import { setchats } from "../redux/reducers/chat";
import {
  setcloseornot,
  setEmailmodal,
  setname,
  setPic,
  setType,
} from "../redux/reducers/popup";
import { setpic } from "../redux/reducers/groupchat";
import { useNavigate } from "react-router-dom";
type userInfo = {
  name: string;
  email: string;
  _id: string;
  pic: string;
  createdAt: string;
  updatedAt: string;
};

function Groupchat() {
  const [search, setsearch] = useState("");
  const [searchresults, setsearchresults] = useState<Array<userInfo> | []>([]);
  const dispatch = useDispatch();
  const groupName = useSelector(
    (state: RootState) => state.groupchat.groupName
  );
  const chats = useSelector((state: RootState) => state.chat.chats);
  const userInfo = useSelector(
    (state: RootState) => state.signuporlogin.userInfo
  );
  const [chips, setchips] = useState<Array<userInfo> | []>([]);
  const navigate = useNavigate();
  const handleaddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (search) {
      fetch(
        `https://whatsappwebbackend.herokuapp.com/api/user?search=${search}`,
        {
          headers: {
            authorization: "Bearer " + userInfo?.token,
            "Content-type": "application/json",
          },
        }
      ).then((res) => {
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
        } else if (res.status === 401) {
        }
      });
    }
  };

  const append = (e: userInfo) => {
    if (!chips.find((c) => c.email == e.email)) {
      let arr = [...chips, e];
      setchips(arr);
    } else {
      dispatch(setsnackbarMessage("User already added"));
      dispatch(setsnackbarmode("Warning"));
      dispatch(setsnackbarclose(true));
    }
    setsearchresults([]);
    setsearch("");
  };
  const remove = (e: userInfo) => {
    let arr = [...chips];
    const index = arr.findIndex((x) => x === e);
    if (index !== undefined) arr.splice(index, 1);
    setchips(arr);
  };
  const pic = useSelector((state: RootState) => state.groupchat.pic);

  const createGrp = () => {
    if (groupName) {
      if (chips.length >= 2) {
        const data = { users: chips, name: groupName, pic: pic };
        fetch("https://whatsappwebbackend.herokuapp.com/api/chat/group/", {
          method: "POST",
          headers: {
            authorization: "Bearer " + userInfo?.token,
            "Content-type": "application/json",
          },
          body: JSON.stringify(data),
        }).then((res) => {
          if (res.ok) {
            res.json().then((data) => {
              let arr = [data, ...chats];
              dispatch(setchats(arr));
              dispatch(setopenornot(false));
              dispatch(setgroupName(""));
            });
          } else if (res.status === 401) {
          } else {
            dispatch(setsnackbarMessage("Something went wrong"));
            dispatch(setsnackbarmode("Danger"));
            dispatch(setsnackbarclose(true));
          }
        });
      } else {
        dispatch(setsnackbarMessage("Atleast two users to create a group!!!"));
        dispatch(setsnackbarmode("Warning"));
        dispatch(setsnackbarclose(true));
      }
    } else {
      dispatch(setsnackbarMessage("Empty group name found !!!"));
      dispatch(setsnackbarmode("Danger"));
      dispatch(setsnackbarclose(true));
    }
  };
  const loading = useSelector((state: RootState) => state.groupchat.loading);
  const Postdetails = (pics: File | null) => {
    // Converting image into Cloudinary url

    if (pics === null) {
      dispatch(setloading(true));
    } else if (pics.type === "image/jpeg" || pics.type === "image/png") {
      setloading(true);
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chatApp");
      data.append("cloud_name", "sai1975d");
      fetch("https://api.cloudinary.com/v1_1/sai1975d/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          dispatch(setpic(data.url.toString()));
          setloading(false);
        })
        .catch((err) => {
          setloading(false);
        });
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
        <div className="relative w-full max-w-[500px] md:h-auto m-auto">
          <div
            className="relative bg-white rounded-lg shadow  border-2 
      border-black mx-1"
          >
            <button
              type="button"
              className="absolute top-3 right-2.5 text-black bg-transparent
           hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              onClick={() => {
                dispatch(setopenornot(false));
                dispatch(setgroupName(""));
                setsearchresults([]);
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
              <h3 className="text-[20px] font-normal ">Create Group chat</h3>
              <br />
              <div>
                <input
                  className="block w-full text-sm text-gray-900 bg-gray-50 
                  rounded-lg border border-gray-300 cursor-pointer"
                  id="file_input"
                  type="file"
                  // value={pic ? pic : ""}
                  onChange={(e) =>
                    Postdetails(e.target.files ? e.target.files[0] : null)
                  }
                  accept=".png,.jpg,.jpeg"
                />
                <div className="text-sm text-black text-left pb-3 pl-2">
                  Upload a photo for group chat
                </div>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300
                   text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full
             p-2.5 outline-none rounded-sm"
                  placeholder="Group Name"
                  required
                  name="name"
                  onChange={(e) => dispatch(setgroupName(e.target.value))}
                  value={groupName}
                />
                <br />
                <form
                  className="bg-grey-lightest relative"
                  onSubmit={(e) => {
                    handleaddMember(e);
                    return false;
                  }}
                >
                  <input
                    type="text"
                    className="text-sm outline-none bg-gray-50 border border-gray-300
                    text-gray-900  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  rounded-sm"
                    placeholder="Add member"
                    value={search}
                    onChange={(e) => setsearch(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-0 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-sm text-sm px-3 py-1 mr-2 mt-1.5 mx-4"
                  >
                    Go
                  </button>
                </form>
                <br />
                <div className="flex flex-wrap">
                  {chips &&
                    chips.map((item, index) => (
                      <div
                        className="flex justify-center items-center m-1 font-medium py-1 px-2 rounded-full text-indigo-100 bg-indigo-700 border border-indigo-700 w-auto"
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
                                onClick={() => append(chat)}
                              >
                                <div className="flex items-bottom justify-between">
                                  <p className="text-grey-darkest">
                                    {chat.name}
                                  </p>
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
              {loading ? (
                <button
                  data-modal-toggle="popup-modal"
                  type="button"
                  className="text-white bg-green-600 hover:bg-green-800
                   outline-none font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                  disabled
                  // onClick={() => createGrp()}
                >
                  Create Group Chat
                </button>
              ) : (
                <button
                  data-modal-toggle="popup-modal"
                  type="button"
                  className="text-white bg-green-600 hover:bg-green-800
                   outline-none font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                  onClick={() => createGrp()}
                >
                  Create Group Chat
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Groupchat;
