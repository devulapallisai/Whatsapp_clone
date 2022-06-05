import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatBox from "../components/ChatBox";
import Mychats from "../components/Mychats";
import { RootState } from "../redux/store";
import Modal from "../components/Modal";
import Snackbar from "../components/Snackbar";
import { setChatloading, setchats } from "../redux/reducers/chat";
import Loader from "../components/Loader";
function Home() {
  const userInfo = useSelector(
    (state: RootState) => state.signuporlogin.userInfo
  );
  const chatLoading = useSelector((state: RootState) => state.chat.Chatloading);
  const closeornot = useSelector((state: RootState) => state.popup.closeornot);
  const dispatch = useDispatch();
  useEffect(() => {
    if (userInfo && userInfo.token) {
      fetch("http://localhost:5000/api/chat/", {
        method: "GET",
        headers: {
          authorization: "Bearer " + userInfo?.token,
          "Content-type": "application/json",
        },
      }).then((res) =>
        res.json().then((rep) => {
          dispatch(setchats(rep));
          console.log(rep);
        })
      );
      setTimeout(() => {
        dispatch(setChatloading(false));
      }, 1000);
    }
  });
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
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Home;
