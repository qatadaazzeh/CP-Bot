import { ChartJSNodeCanvas } from "chartjs-node-canvas";

const width = 2000;
const height = 800;
const backgroundColour = 'white';
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour });

async function plotBarChart(data, label, color = 'red') {
    const labels = Object.keys(data);
    const values = Object.values(data);
    const trimmedLabels = labels.map(l => l.length > 10 ? l.substring(0, 10) + '...' : l);

    const configuration = {
        type: 'bar',
        data: {
            labels: trimmedLabels,
            datasets: [{
                label: label,
                data: values,
                backgroundColor: color,
                borderWidth: 1,
            }],
        },
        options: {
            responsive: false,
            plugins: {
                legend: { display: true }
            },
            scales: {
                x: { ticks: { font: { size: 16 }, maxRotation: 45, minRotation: 45 } },
                y: { ticks: { font: { size: 16 } } },
            },
        },
    };

    return await chartJSNodeCanvas.renderToBuffer(configuration);
}


async function plotLineChart(data, label, color = 'red') {
    const labels = Object.keys(data);
    const values = Object.values(data);
    const trimmedLabels = labels.map(l => l.length > 10 ? l.substring(0, 10) + '...' : l);

    const configuration = {
        type: 'line',
        data: {
            labels: trimmedLabels,
            datasets: [{
                label: label,
                data: values,
                borderColor: color,
                fill: false,
                borderWidth: 2,
                tension: 0.1,
            }],
        },
        options: {
            responsive: false,
            plugins: {
                legend: { display: true }
            },
            scales: {
                x: { ticks: { font: { size: 16 }, maxRotation: 45, minRotation: 45 } },
                y: { ticks: { font: { size: 16 } } },
            },
        },
    };

    return await chartJSNodeCanvas.renderToBuffer(configuration);
}
async function plotRatingBarChart(ratingDict) {
    return await plotBarChart(ratingDict, 'Problem Rating Distribution', 'red');
}

async function plotIndexBarChart(indexDict) {
    return await plotBarChart(indexDict, 'Index Distribution', 'green');
}

async function plotTagsBarChart(tagDict) {
    return await plotBarChart(tagDict, 'Tag Distribution', 'red');
}

async function plotRatingChange(changes) {
    return plotLineChart(changes, 'Rating Changes', 'red');
}

export { plotRatingBarChart, plotIndexBarChart, plotTagsBarChart, plotRatingChange };