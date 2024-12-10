import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { getOrdersNumbersGroupedByMonth } from "@/actions/orders.actions";
import { useCurrentUser } from "@/hooks/use-current-user";

const ApexChart = () => {
  const currentUser = useCurrentUser();
  const [series, setSeries] = useState([
    {
      name: "Orders",
      data: [],
      color: "#0E185F",
    },
  ]);

  useEffect(() => {
    const fetchOrdersData = async () => {
      const ordersPerMonth = await getOrdersNumbersGroupedByMonth(currentUser.id);
      setSeries([
        {
          name: "",
          data: ordersPerMonth,
          color: "#0E185F",
        },
      ]);
    };

    fetchOrdersData();
  }, []); 

  const options = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "35%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    yaxis: {
      title: {
        text: "",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
  };

  return (
    <div>
      <h2 className="font-bold">Orders Per Month</h2>
      <ReactApexChart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default ApexChart;
