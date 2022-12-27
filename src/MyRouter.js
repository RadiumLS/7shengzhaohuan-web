import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";

const routerMap = {
  wellcom: {
    path: '/',
    element: <div>Hello world!</div>,
  },
  tweak: {
    path: '/xx',
    element: <div>Hello xxx!</div>,
  }
}
const router = createBrowserRouter(Object.entries(routerMap).map(([key, value]) => value));

function MyRouter() {
  return (
    <RouterProvider router={router} />
  )
}

export {
  MyRouter,
  routerMap,
};