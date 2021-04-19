import React from 'react';
import { Bar } from 'react-chartjs-2';


export default function SalesBarChart(props) {

    const convertToChartData = (data) => {
        const sampleConvertedData = {
            labels: [
                'Jan',
                'Feb',
                'March',
                'April',
                'May',
                'June',
                'July',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
            ],
            datasets: [
                {
                    label: 'This Year',
                    backgroundColor: 'rgba(77, 175, 124, 1)',
                },
                {
                    label: 'Last year',
                    backgroundColor: 'rgba(162, 222, 208, 1)',
                },
            ],
        };

        sampleConvertedData.datasets[0].data = data.currentYear;
        sampleConvertedData.datasets[1].data = data.previousYear;
        return sampleConvertedData;
    };



    return (

        <Bar
            data={convertToChartData(props.data)}
            options={{
                title: {
                    display: true,
                    text: 'SALES REPORT',
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
