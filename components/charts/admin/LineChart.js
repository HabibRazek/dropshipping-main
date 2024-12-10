import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { getMostOrderedProductByMonth } from '@/actions/orders.actions'; // Make sure to import your function correctly

const LineChart = () => {
    const [chartData, setChartData] = useState({
        series: [{
            name: "Most Ordered Products",
            data: [],
            color: '#1679AB'
        }],
        options: {
            chart: {
                height: 350,
                type: 'line',
                zoom: {
                    enabled: false
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'straight'
            },
            title: {
                text: '',
                align: 'left'
            },
            grid: {
                row: {
                    colors: ['#f3f3f3', 'transparent'],
                    opacity: 0.5
                },
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            }
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            const mostOrderedProducts = await getMostOrderedProductByMonth();
            const productQuantities = mostOrderedProducts.map(item => item ? item.quantity : 0);
            const productNames = mostOrderedProducts.map(item => item ? item.product.name : '');

            setChartData(prevState => ({
                ...prevState,
                series: [{
                    name: "Most Ordered Products",
                    data: productQuantities,
                    color: '#1679AB'
                }],
                options: {
                    ...prevState.options,
                    xaxis: {
                        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    },
                    tooltip: {
                        custom: ({ series, seriesIndex, dataPointIndex, w }) => {
                            return `<div class="arrow_box">
                                <span>${productNames[dataPointIndex]}: ${series[seriesIndex][dataPointIndex]}</span>
                            </div>`;
                        }
                    }
                }
            }));
        };

        fetchData();
    }, []);

    return (
        <div>
            <h2 className="font-bold">Most Ordered Products by Month</h2>
            <ReactApexChart options={chartData.options} series={chartData.series} type="line" height={350} />
        </div>
    );
};

export default LineChart;
