import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useCurrentUser } from "@/hooks/use-current-user";
import { getUserById } from '@/actions/user.actions';
import { getOrdersNumbersGroupedByMonthBySupplierId } from '@/actions/orders.actions';

const ApexChart = () => {
  const currentUser = useCurrentUser();

  const [chartState, setChartState] = useState({
    series: [{
      name: 'Orders',
      data: [],
      color: '#0E185F'
    }],
    options: {
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '35%',  // Reduced width
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
      },
      yaxis: {
        title: {
          text: 'Orders'
        },
        min: 0,
        max: 10
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " orders"
          }
        }
      }
    },
  });

  useEffect(() => {
    const fetchOrdersData = async () => {
      const dbUser = await getUserById(currentUser?.id);
      const supplierId = dbUser?.supplier.id;
      if (supplierId) {
        const ordersPerMonth = await getOrdersNumbersGroupedByMonthBySupplierId(supplierId);
        setChartState(prevState => ({
          ...prevState,
          series: [{
            name: 'Orders',
            data: ordersPerMonth,
            color: '#0E185F'
          }]
        }));
      }
    };

    fetchOrdersData();
  }, []);

  return (
    <div>
      <h2 className='font-bold'>Orders Per Month</h2>
      <ReactApexChart options={chartState.options} series={chartState.series} type="bar" height={350} />
    </div>
  );
}

const ApexChartWrapper = () => {
  const currentUser = useCurrentUser();
  if (!currentUser) return null;

  return <ApexChart />;
};

export default ApexChartWrapper;
