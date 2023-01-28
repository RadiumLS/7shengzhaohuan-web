import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Wellcom from "./pages/Welcom";
import About from "./pages/About";
import { MiyousheDeck } from "./pages/MiyousheDeck";

const routerMap = {
  wellcom: {
    path: '/',
    element: <Wellcom/>,
  },
  about: {
    path: '/about',
    element: <About/>,
  },
  miyoushe: {
    path: '/miyoushe',
    element: <MiyousheDeck/>,
  },
  miyoushe_deck: {
    path: '/miyoushe/:deckId',
    element: <MiyousheDeck/>,
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