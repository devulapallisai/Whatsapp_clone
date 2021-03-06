import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { setUserInfo } from "./redux/reducers/signuporlogin";
function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    let strings: string = localStorage.getItem("userInfo") ?? "";
    if (strings != "") {
      const user = JSON.parse(strings);
      if (user) {
        navigate("/home");
        dispatch(setUserInfo(user));
      }
    } else {
      dispatch(setUserInfo(null));
      navigate("/");
    }
  }, [navigate]);
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;
