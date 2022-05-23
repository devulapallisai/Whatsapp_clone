import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setsignuporlogin,
  setpassword,
  setusername,
  setemail,
  setsnackbarMessage,
  setsnackbarclose,
  setsnackbarmode,
} from "../redux/signuporlogin";
import { RootState } from "../redux/store";
import Snackbar from "./Snackbar";

function Logincompo() {
  const [loading, setloading] = useState(false);
  const username = useSelector(
    (state: RootState) => state.signuporlogin.username
  );
  const email = useSelector((state: RootState) => state.signuporlogin.email);
  const password = useSelector(
    (state: RootState) => state.signuporlogin.password
  );
  const signuporlogin = useSelector(
    (state: RootState) => state.signuporlogin.signuporlogin
  );
  const dispatch = useDispatch();
  const snackbarMessage = useSelector(
    (state: RootState) => state.signuporlogin.snackbarMessage
  );
  const snackbarmode = useSelector(
    (state: RootState) => state.signuporlogin.snackbarmode
  );
  const snackbaropen = useSelector(
    (state: RootState) => state.signuporlogin.snackbaropen
  );
  const dispatchsignuporlogin = () => {
    dispatch(setsignuporlogin());
  };
  const [pic, setpic] = useState("");
  const Postdetails = (pics: File | null) => {
    if (pics === null) {
      setloading(true);
    } else if (pics.type === "image/jpeg" || pics.type === "image/png") {
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
          setpic(data.url.toString());
          console.log(data.url.toString());
          setloading(false);
        })
        .catch((err) => {
          console.log(err);
          setloading(false);
        });
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    // e.preventDefault();
    setloading(true);
    if (signuporlogin) {
      const data = {
        email: email,
        name: username,
        password: password,
        pic: pic,
      };
      if (email && password) {
        if (password.length > 7) {
          fetch("http://localhost:5000/api/user/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(data),
          }).then((res) => {
            if (res.ok) {
              res.json().then((res) => console.log(res));
              dispatch(setsnackbarMessage("Registration successful"));
              dispatch(setsnackbarmode("Green"));
              dispatch(setsnackbarclose(true));
            } else {
              dispatch(
                setsnackbarMessage("Email already in use. Try logging in")
              );
              dispatch(setsnackbarmode("Danger"));
              dispatch(setsnackbarclose(true));
            }
          });
        } else {
          // very weak password
          dispatch(
            setsnackbarMessage("No of charecters in password must be > 7")
          );
          dispatch(setsnackbarmode("Warning"));
          dispatch(setsnackbarclose(true));
        }
      } else {
        // Email or password is empty
        dispatch(setsnackbarMessage("Either password or email is empty"));
        dispatch(setsnackbarmode("Danger"));
        dispatch(setsnackbarclose(true));
      }
    } else {
      const data = {
        email: email,
        password: password,
      };
      if (email && password) {
        fetch("http://localhost:5000/api/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify(data),
        }).then((res) => {
          if (res.ok) {
            res.json().then((res) => console.log(res));
          } else {
            dispatch(setsnackbarMessage("Either password or email is wrong"));
            dispatch(setsnackbarmode("Danger"));
            dispatch(setsnackbarclose(true));
          }
        });
      } else {
        // Email or password is empty
        dispatch(setsnackbarMessage("Either password or email is empty"));
        dispatch(setsnackbarmode("Danger"));
        dispatch(setsnackbarclose(true));
      }
    }
    setloading(false);
    dispatch(setusername(""));
    dispatch(setemail(""));
    dispatch(setpassword(""));
    setpic("");
  };
  return (
    <div className="w-[80vw] m-auto md:w-[38vw] max-h-[560px] border-2 border-[#dbdbdb] bg-white">
      <Snackbar />
      <div className="font-google font-[600] md:text-5xl text-3xl text-center py-8">
        {signuporlogin ? "SIGN UP" : "LOGIN"}
      </div>
      <div className="w-[50vw] md:max-w-[25vw] m-auto">
        {signuporlogin && (
          <>
            <div>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full
             p-2.5 outline-none rounded-sm"
                placeholder="Username"
                required
                onChange={(e) => dispatch(setusername(e.target.value))}
                value={username}
              />
            </div>
            <br />
          </>
        )}
        <div>
          <div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full
             p-2.5 outline-none rounded-sm"
              placeholder="Email"
              required
              onChange={(e) => dispatch(setemail(e.target.value))}
              value={email}
            />
          </div>
          <br />
          <div>
            <input
              type="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full
             p-2.5 outline-none rounded-sm"
              placeholder="Password"
              required
              onChange={(e) => dispatch(setpassword(e.target.value))}
              value={password}
            />
          </div>
          <br />
          {signuporlogin && (
            <>
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
              </div>
              <br />
            </>
          )}
          {loading ? (
            <button
              type="button"
              onClick={(e) => handleSubmit(e)}
              className="text-white bg-blue-700 hover:bg-blue-800 
            focus:outline-none font-medium rounded-lg text-md px-5 py-2.5 inline-flex items-center"
              disabled
            >
              hello
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => handleSubmit(e)}
              className="text-white bg-blue-700 hover:bg-blue-800 
              focus:outline-none font-medium rounded-lg text-md px-5 py-2.5 inline-flex items-center"
            >
              {signuporlogin ? "Sign up" : "Log in"}

              <svg
                className="w-5 h-5 ml-2 -mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          )}
        </div>
        <br />
        <div className="text-center cursor-pointer text-[#00376b] text-sm py-4">
          Forgot password ?
        </div>
      </div>
      <hr />
      <div className="py-4 text-center">
        Don't have an account?{" "}
        <span
          className="font-[600] text-[#0095f6] cursor-pointer"
          onClick={dispatchsignuporlogin}
        >
          {signuporlogin ? "Log in" : "Sign up"}
        </span>
      </div>
    </div>
  );
}

export default Logincompo;
