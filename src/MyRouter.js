import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Wellcom from "./pages/Welcom";
import About from "./pages/About";

const routerMap = {
  wellcom: {
    path: '/',
    element: <Wellcom/>,
  },
  about: {
    path: '/about',
    element: <About/>,
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