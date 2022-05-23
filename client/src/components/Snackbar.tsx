import React, { useEffect } from "react";
import { setsnackbarclose } from "../redux/signuporlogin";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";

function Snackbar() {
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
  useEffect(() => {
    setTimeout(() => {
      dispatch(setsnackbarclose(false));
    }, 4000);
  }, [snackbaropen]);
  return (
    <>
      {snackbaropen && (
        <div className="absolute z-[40000] bottom-0 left-0 m-16">
          <div
            className={`border ${
              snackbarmode === "Danger"
                ? "bg-red-100 border-red-400 text-red-700"
                : snackbarmode === "Warning"
                ? "bg-orange-100 border-orange-500 text-orange-700"
                : "bg-teal-100 border-teal-500 text-teal-900"
            } px-4 py-3 rounded relative`}
            role="alert"
          >
            <span className="block sm:inline pr-8 font-bold">
              {snackbarMessage}
            </span>
            <span className="absolute top-0 bottom-0 right-0 pr-4 py-3">
              <svg
                onClick={() => dispatch(setsnackbarclose(false))}
                className={`fill-current h-6 w-6 ${
                  snackbarmode === "Danger"
                    ? "text-red-500"
                    : snackbarmode === "Warning"
                    ? "text-orange-500"
                    : "text-teal-500"
                }`}
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default Snackbar;
