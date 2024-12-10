import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useCurrentUser } from "@/hooks/use-current-user";
import { getOrderStatusesBySupplier, getOrderStatusesBySupplierId, getOrderStatusesForSupplier } from "@/actions/orders.actions";
import { getUserById } from '@/actions/user.actions';

const DonutChart = () => {
  const currentUser = useCurrentUser();

  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        width: 380,
        type: 'donut',
      },
      colors: ['#074173', '#1679AB', '#C5FF95','#FF0000', '#FFD700'],
      dataLabels: {
        enabled: false,
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            show: false,
          },
        },
      }],
      legend: {
        position: 'right',
        offsetY: 0,
        height: 230,
      },
      labels: [
        'Pending', 'Processing', 'Delivered', 'Cancelled', 'Returned'
      ]
    },
  });

  useEffect(() => {
    const fetchStatusesData = async () => {
      const dbUser = await getUserById(currentUser?.id);
      const supplierId = dbUser?.supplier?.id;
      if (supplierId) {
        const statuses = await getOrderStatusesBySupplierId(supplierId);
        setChartData((prevData) => ({
          ...prevData,
          series: statuses,
        }));
      }
    };

    fetchStatusesData();
  }, []);

  return (
    <>
      <h3 className="font-bold">Orders Statuses</h3>
      <div>
        <div>
          <ReactApexChart options={chartData.options} series={chartData.series} type="donut" width={460} />
        </div>
      </div>
    </>
  );
};

export default DonutChart;
