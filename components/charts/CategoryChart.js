import React from 'react';
import { Pie } from 'react-chartjs-2';

export default function CategoryChart(props) {
    const convertToPieChartData = (data) => {
        const sampleConvertedPieData = {
            labels: props.data.map((x) => x._id),
            datasets: [
                {
                    labels: props.data.map((x) => x._id),
                    backgroundColor: [
                        '#B21F00',
                        '#C9DE00',
                        '#2FDE00',
                        '#00A6B4',
                        '#6800B4',
                        '#8a917c',
                        '#566e26',
                        '#202b08',
                        '#6b9908',
                    ],
                    hoverBackgroundColor: [
                        '#501800',
                        '#4B5000',
                        '#175000',
                        '#003350',
                        '#35014F',
                    ],
                },
            ],
        };

        sampleConvertedPieData.datasets[0].data = data;
        return sampleConvertedPieData;
    };
    return (
        <Pie
            data={convertToPieChartData(props.data.map((x) => x.categoryView))}
            options={{
                title: {
                    display: true,
                    text: 'HIGHEST VIEWED CATEGORIES',
                    fontSize: 20,
                },
                legend: {
                    display: true,
                    position: 'right',
                },
            }}

        />
    );
}