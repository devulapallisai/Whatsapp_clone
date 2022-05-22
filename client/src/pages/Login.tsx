import React from "react";
import { useSelector } from "react-redux";
import Chatimg from "../assets/chatscreen.svg";
import Logincompo from "../components/Logincompo";
import { RootState } from "../redux/store";
function Login() {
  const signuporlogin = useSelector(
    (state: RootState) => state.signuporlogin.signuporlogin
  );
  return (
    <div className="font-google bg-[#fafafa] w-[100vw] h-[100vh] m-0">
      <div className="pt-[5vh]">
        <div
          className={`md:w-[70vw] md:h-[90vh] flex ${
            signuporlogin ? "md:flex-row-reverse" : "md:flex-row"
          } flex-col m-auto`}
        >
          <img
            src={Chatimg}
            alt="chat"
            className="md:max-w-[35vw] md:my-auto mx-auto w-[80vw]"
          />
          <Logincompo />
        </div>
      </div>
      <br />
    </div>
  );
}

export default Login;
