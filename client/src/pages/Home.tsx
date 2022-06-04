import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatBox from "../components/ChatBox";
import Mychats from "../components/Mychats";
import SideNavbar from "../components/sideNavbar";
import { RootState } from "../redux/store";
import { setsearchChat } from "../redux/chat";
import Modal from "../components/Modal";
import Snackbar from "../components/Snackbar";
function Home() {
  const userInfo = useSelector(
    (state: RootState) => state.signuporlogin.userInfo
  );
  const searchChat = useSelector((state: RootState) => state.chat.searchChat);
  const closeornot = useSelector((state: RootState) => state.popup.closeornot);
  const dispatch = useDispatch();
  return (
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
        </div>
      )}
    </>
  );
}

export default Home;
