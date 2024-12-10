import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { getOrdersNumbersGroupedByMonthForAdmin } from '@/actions/orders.actions';

const ApexChart = () => {
  const [chartData, setChartData] = useState({
    series: [{
      name: '',
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
          columnWidth: '35%',
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
          text: ''
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "Orders " + val;
          }
        }
      }
    }
  });

  useEffect(() => {
    const fetchOrdersData = async () => {
      const ordersPerMonth = await getOrdersNumbersGroupedByMonthForAdmin();
      setChartData(prevData => ({
        ...prevData,
        series: [{
          name: '',
          data: ordersPerMonth,
          color: '#0E185F'
        }]
      }));
    };

    fetchOrdersData();
  }, []);

  return (
    <div>
      <h2 className='font-bold'>Orders Per Month</h2>
      <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={350} />
    </div>
  );
}

export default ApexChart;
