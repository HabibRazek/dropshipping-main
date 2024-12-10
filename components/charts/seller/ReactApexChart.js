import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useCurrentUser } from "@/hooks/use-current-user";
import { getRevenuPerMonth } from "@/actions/orders.actions";

const ApexChart = () => {
  const currentUserId = useCurrentUser().id;
  const [chartState, setChartState] = useState({
    series: [
      {
        name: 'Revenue',
        data: [],
        color: '#1679AB'
      }
    ],
    options: {
      chart: {
        type: 'area',
        height: 350,
        stacked: false,
        events: {
          selection: function (chart, e) {
            console.log(new Date(e.xaxis.min));
          }
        },
      },
      colors: ['#008FFB'],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      fill: {
        type: 'gradient',
        gradient: {
          opacityFrom: 0.6,
          opacityTo: 0.8,
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left'
      },
      xaxis: {
        categories: [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ]
      },
    },
  });

  useEffect(() => {
    const fetchRevenueData = async () => {
      const revenuePerMonth = await getRevenuPerMonth(currentUserId);
      setChartState(prevState => ({
        ...prevState,
        series: [{
          name: 'Revenue',
          data: revenuePerMonth,
          color: '#1679AB'
        }]
      }));
    };

    fetchRevenueData();
  }, [currentUserId]);

  return (
    <div>
      <h2 className="font-bold">Revenue Per Month</h2>
      <div id="chart">
        <ReactApexChart options={chartState.options} series={chartState.series} type="area" height="400" />
      </div>
    </div>
  );
};

const ApexChartWrapper = () => {
  const currentUser = useCurrentUser();
  if (!currentUser) return null;

  return <ApexChart />;
};

export default ApexChartWrapper;
