import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
  {
    path: "/xx",
    element: <div>Hello xxx!</div>,
  },
]);

function MyRouter() {
  return (
    <RouterProvider router={router} />
  )
}

export default MyRouter;