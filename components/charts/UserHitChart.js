import React from 'react';
import { Line } from 'react-chartjs-2';

export default function UserHitChart(props) {
    const convertToLineChartData = (data) => {
        const sampleConvertedLineData = {
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
                    label: 'Unique visitors',
                    fill: false,
                    lineTension: 0.5,
                    backgroundColor: 'rgba(241, 90, 34, 1)',
                    borderColor: 'rgba(65, 131, 215, 1)',
                    borderWidth: 2,
                },
            ],
        };
        sampleConvertedLineData.datasets[0].data = data.currentYear;
        return sampleConvertedLineData;
    };
    return (
        <Line
            data={convertToLineChartData(props.data)}
            options={{
                title: {
                    display: true,
                    text: 'USER HIT RATE',
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
