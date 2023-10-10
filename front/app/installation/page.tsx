"use client";

import React from "react";
import AreaChart from "./_components/AreaChart";
import BarChart from "./_components/BarChart";

const Installation = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 h-full min-h-[90vh] bg-primary p-2 md:p-10 ">
      <AreaChart />
      <BarChart />
    </div>
  );
};

export default Installation;
