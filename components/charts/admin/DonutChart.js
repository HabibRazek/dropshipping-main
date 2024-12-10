import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { getOrderStatusesForAdmin } from '@/actions/orders.actions';

const DonutChart = () => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        width: 380,
        type: 'donut',
      },
      colors: ['#074173', '#1679AB', '#5DEBD7', '#C5FF95', '#FF0000'],
      labels: ['Pending', 'Processing', 'Delivered', 'Cancelled', 'Returned'],
      dataLabels: {
        enabled: false
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            show: false
          }
        }
      }],
      legend: {
        position: 'right',
        offsetY: 0,
        height: 230,
      }
    },
  });

  useEffect(() => {
    const fetchStatusesData = async () => {
      const statusesCount = await getOrderStatusesForAdmin();
      setChartData(prevData => ({
        ...prevData,
        series: statusesCount,
      }));
    };

    fetchStatusesData();
  }, []);

  return (
    <>
      <h3 className='font-bold'>Orders Statuses</h3>
      <div>
        <div className="">
          <ReactApexChart options={chartData.options} series={chartData.series} type="donut" width={460} />
        </div>
      </div>
    </>
  );
};

export default DonutChart;
