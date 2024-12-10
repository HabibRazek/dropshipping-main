import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useCurrentUser } from "@/hooks/use-current-user";
import { getRevenuPerMonthForSupplier } from "@/actions/orders.actions";
import { getUserById } from '@/actions/user.actions';

const BarChart = () => {
  const currentUser = useCurrentUser();

  const [chartData, setChartData] = useState({
    series: [{
      name: 'Total',
      data: []
    }],
    options: {
      chart: {
        type: 'bar',
        height: 430
      },
      colors: ['#1679AB'],
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            position: 'top',
          },
        }
      },
      dataLabels: {
        enabled: true,
        offsetX: -6,
        style: {
          fontSize: '12px',
          colors: ['#fff']
        }
      },
      stroke: {
        show: true,
        width: 1,
        colors: ['#fff']
      },
      tooltip: {
        shared: true,
        intersect: false
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      },
    }
  });

  useEffect(() => {
    const fetchRevenuePerMonthData = async () => {
      const dbUser = await getUserById(currentUser?.id);
      const supplierId = dbUser?.supplier?.id;
      if (supplierId) {
        const revenuePerMonth = await getRevenuPerMonthForSupplier(supplierId);
        setChartData(prevData => ({
          ...prevData,
          series: [{
            name: 'Revenue Per Month',
            data: revenuePerMonth
          }]
        }));
      }
    };

    fetchRevenuePerMonthData();
  }, []);

  return (
    <div>
      <h2 className="font-bold">Revenue Per Month</h2>
      <div id="chart">
        <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={430} />
      </div>
    </div>
  );
};

export default BarChart;
