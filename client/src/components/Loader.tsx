import React from "react";

function Loader({ middle }: { middle: boolean }) {
  return (
    <div
      className={`bg-white flex space-x-2 p-5 rounded-full justify-center items-center ${
        middle ? "h-[100vh]" : ""
      }`}
    >
      <div className="bg-blue-600 p-2  w-4 h-4 rounded-full animate-bounce blue-circle"></div>
      <div className="bg-green-600 p-2 w-4 h-4 rounded-full animate-bounce green-circle"></div>
      <div className="bg-red-600 p-2  w-4 h-4 rounded-full animate-bounce red-circle"></div>
    </div>
  );
}

export default Loader;
