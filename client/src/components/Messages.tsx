import React from "react";

function Messages({
  message,
  type,
  sender,
}: {
  message: string;
  type: string;
  sender: string;
}) {
  return (
    <>
      <div className={`flex ${type} my-2`}>
        <div
          className="rounded py-2 px-3"
          style={{
            backgroundColor: type === "justify-end" ? "#E2F7CB" : "#F2F2F2",
          }}
        >
          <p className="text-sm text-teal font-bold">{sender}</p>
          <p className="text-sm mt-1">{message}</p>
          {/* <p className="text-right text-xs text-grey-dark mt-1">12:45 pm</p> */}
        </div>
      </div>
    </>
  );
}

export default Messages;
