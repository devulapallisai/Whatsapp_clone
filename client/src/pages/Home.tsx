import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatBox from "../components/ChatBox";
import Mychats from "../components/Mychats";
import { RootState } from "../redux/store";
import Modal from "../components/Modal";
import Snackbar from "../components/Snackbar";
import {
  setChatloading,
  setchats,
  setSinglechat,
} from "../redux/reducers/chat";
import Loader from "../components/Loader";
import Groupchat from "../components/Groupchat";
import { useNavigate } from "react-router-dom";
import { setfetchAgain, setUserInfo } from "../redux/reducers/signuporlogin";
import { setcloseornot, setgroupusers, setname } from "../redux/reducers/popup";
import { setloading, setuserInfo } from "../redux/reducers/chat";
import { setsearchChat } from "../redux/reducers/chat";
import { setdisplayusers } from "../redux/reducers/chat";
import { setcloseornotremove, setgroupName } from "../redux/reducers/groupchat";
function Home() {
  const userInfo = useSelector(
    (state: RootState) => state.signuporlogin.userInfo
  );
  const fetchAgain = useSelector(
    (state: RootState) => state.signuporlogin.fetchAgain
  );
  const chatLoading = useSelector((state: RootState) => state.chat.Chatloading);
  const closeornot = useSelector((state: RootState) => state.popup.closeornot);
  const openornot = useSelector(
    (state: RootState) => state.groupchat.openornot
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      setChatloading(true);
      fetch("https://whatsappwebbackend.herokuapp.com/api/chat/", {
        method: "GET",
        headers: {
          authorization:
            "Bearer " +
            JSON.parse(localStorage.getItem("userInfo") ?? "").token,
          "Content-type": "application/json",
        },
      }).then((res) => {
        if (res.ok) {
          res.json().then((rep) => {
            dispatch(setchats(rep));
            dispatch(setSinglechat(rep[0]));
          });
        } else if (res.status === 401) {
          res.json().then((rep) => {
            console.log(rep);
            // navigate("/");
            // If token expires then it will redirect to homepage
            window.location.href = "/";
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
          });
        }
      });
      setTimeout(() => {
        dispatch(setChatloading(false));
      }, 4000);
    }
  }, [navigate, fetchAgain]);
  useEffect(() => {
    dispatch(setChatloading(true));
    setTimeout(() => {
      setChatloading(false);
    }, 2000);
  }, []);
  return (
    <>
      {chatLoading ? (
        <>
          <Loader middle={true} />
        </>
      ) : (
        <>
          {userInfo && (
            <div className="font-google">
              {closeornot && <Modal />}
              <div>
                <div
                  className="w-full h-32"
                  style={{ backgroundColor: "#449388" }}
                ></div>

                <div
                  className="nw:container nw:mx-auto mx-2"
                  style={{ marginTop: "-128px" }}
                >
                  <div className="py-6 h-screen">
                    <div className="flex border border-grey rounded shadow-lg h-full">
                      <Mychats />
                      <ChatBox />
                    </div>
                  </div>
                </div>
              </div>
              <Snackbar />
              {openornot && <Groupchat />}
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Home;
