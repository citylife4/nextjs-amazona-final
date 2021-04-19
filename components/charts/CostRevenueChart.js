import React from 'react';
import { Doughnut } from 'react-chartjs-2';

export default function CostRevenueChart(props) {
    const convertToDoughnutData = (data) => {
        const sampleConvertedData = {
            labels: ['COST', 'REVENUE'],
            datasets: [
                {
                    label: ['Today Cost', 'Today Revenue'],
                    backgroundColor: ['#37E91B', '#E9971B'],
                    hoverBackgroundColor: ['#ABA091', '#4B5000'],
                    data: [data.cost, data.profit],
                },
            ],
        };
        return sampleConvertedData;
    };
    return (
        <Doughnut
            data={convertToDoughnutData(props.data)}
            options={{
                title: {
                    display: true,
                    text: 'COST REVENUE REPORT',
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
