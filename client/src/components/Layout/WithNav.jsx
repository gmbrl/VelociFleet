import React from 'react';

import Header from "../Header";
import { Outlet } from "react-router-dom";

const With_nav = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default With_nav;
