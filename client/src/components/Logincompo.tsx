import { useDispatch, useSelector } from "react-redux";
import {
  setsignuporlogin,
  setpassword,
  setusername,
} from "../redux/signuporlogin";
import { RootState } from "../redux/store";

function Logincompo() {
  const username = useSelector(
    (state: RootState) => state.signuporlogin.username
  );
  const password = useSelector(
    (state: RootState) => state.signuporlogin.password
  );
  const signuporlogin = useSelector(
    (state: RootState) => state.signuporlogin.signuporlogin
  );
  const dispatch = useDispatch();
  const dispatchsignuporlogin = () => {
    dispatch(setsignuporlogin());
  };
  return (
    <div className="w-[80vw] m-auto md:w-[38vw] max-h-[500px] border-2 border-[#dbdbdb] bg-white">
      <div className="font-google font-[600] md:text-6xl text-3xl text-center py-8">
        {signuporlogin ? "SIGN UP" : "LOGIN"}
      </div>
      <div className="w-[50vw] md:max-w-[25vw] m-auto">
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
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-md px-5 py-2.5 inline-flex items-center"
        >
          {signuporlogin ? "Sign up" : "Log in"}
          <svg
            className="w-5 h-5 ml-2 -mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
        <br />
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
