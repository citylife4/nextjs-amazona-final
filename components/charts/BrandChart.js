import React from 'react';
import { Line } from 'react-chartjs-2';

export default function BrandChart(props) {
    const convertToLineChartDataBrand = (data) => {
        const sampleConvertedLineDataBrand = {
            labels: props.data.map((x) => x._id),
            datasets: [
                {
                    label: 'Brands Wise Users Views',
                    fill: false,
                    lineTension: 0.5,
                    backgroundColor: 'rgba(80, 175, 29, 1)',
                    borderColor: 'rgba(60, 132, 21, 1)',
                    borderWidth: 2,
                },
            ],
        };

        sampleConvertedLineDataBrand.datasets[0].data = data;
        return sampleConvertedLineDataBrand;
    };
    return (
        <Line
            data={convertToLineChartDataBrand(props.data.map((x) => x.brandView))}
            options={{
                title: {
                    display: true,
                    text: 'BRAND WISE USER VIEWS',
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
