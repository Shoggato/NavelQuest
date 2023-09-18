// set the URL to a variable
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'


// Init function for the dashboard
function init(){
    // load in the JSON from the URL.
    d3.json(url).then(data => {
        const dropdown = d3.select('#selDataset');
        data.names.forEach(name => {
            dropdown.append('option').text(name).property('value', name);
    });

    // initialize the dashboard with the first data points
    optionChanged(data.names[0], data);
    });
}

// function to update the dashboard for new data that is selected
function optionChanged(selectedIndividual, data) {

    d3.json(url).then(data => {
    // Fetch data for selected individual
    const individualData = data.samples.find(sample => sample.id === selectedIndividual);
    const metadata = data.metadata.find(metadata => metadata.id.toString() === selectedIndividual);

    // update demographic
    updateDemographicInfo(metadata);

    // create horizontal bar chart
    createBarChart(individualData);

    // create bubble chart
    createBubbleChart(individualData);

    // create guage chart
    createGaugeChart();

    // create gauge needle
    createGaugeNeedle(metadata);
    });
}

// function to update the demographic info panel
function updateDemographicInfo(metadata) {
    const metadataPanel = d3.select('#sample-metadata');
    metadataPanel.html(''); //this clears out previous data table
    
    // iterate through metadata and display key-value pairs
    Object.entries(metadata).forEach(([key, value]) => {
        metadataPanel.append('p').text(`${key}:${value}`);
    });
}

// Display the default Barchart
function createBarChart(data) {
    let sample_values = data.sample_values;
    let otu_ids = data.otu_ids;
    let otu_labels = data.otu_labels;

    let trace = {
        x: sample_values.slice(0, 10).reverse(),
        y: otu_ids.slice(0, 10).map(id => `OTU: ${id}`).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: 'bar',
        orientation: 'h',   
    };

    let layout = {
        title: 'Top 10 OTUs',
    };

    Plotly.newPlot('bar', [trace], layout);
}

// display the default BubbleChart
function createBubbleChart(data) {

    let otu_ids = data.otu_ids;
    let sample_values = data.sample_values;
    let otu_labels = data.otu_labels;

    let trace = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
            // https://plotly.com/javascript/colorscales/ for fun colors ;3
            colorscale: 'Picnic',
            color: otu_ids,
            size: sample_values
        },
    
    };

    let layout = {
        title: 'OTU Bubble Chart',
        showlegend: false,
        xaxis: {title: 'OTU ID'},
    };

    Plotly.newPlot('bubble', [trace], layout);
}

// function createGaugeNeedle(metadata) {
//     let wfreq = metadata.wfreq;

//     // Calculate the angle for the needle
//     let angle = (wfreq / 10) * 180;
    
//     let needle = [
//         {
//             title: {text: 'Scrubs per Week'},
//             type: 'indicator',
//             mode: 'gauge',   
//             layout: {
//                 x: 0.5,
//                 y: 0.5,
//                 shapes: [
//                     {
//                         type: 'path',
//                         path: getPathForNeedle(angle),
//                         fillcolor: "#1ecefa",
//                         line: {
//                             color: "#000000"
//                         }
//                     }
//                 ]
//             }
//         }
//     ]

//     Plotly.newPlot('gauge', needle, layout);
// }

// display the default gauge chart
function createGaugeChart(metadata) {

    let wfreq = metadata.wfreq;
// Calculate the angle for the needle
    let angle = (wfreq / 10) * 180;

    let backgroundData = [
        {
            title: {text: 'Belly Button Washing Frequency'},
            type: 'indicator',
            mode: 'gauge',
            gauge: {
                shape: 'angular',
                axis: {
                    align: 'center',
                    range: [0, 10],
                    tickvals: [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5],
                    ticktext: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8','8-9', '9-10'],
                },
                steps: [
                    {range: [0, 1], color: '#ffe6f0'},
                    {range: [1, 2], color: '#ffcce0'},
                    {range: [2, 3], color: '#ffb3d1'},
                    {range: [3, 4], color: '#ff99c2'},
                    {range: [4, 5], color: '#ff80b3'},
                    {range: [5, 6], color: '#ff66a3'},
                    {range: [6, 7], color: '#ff4d94'},
                    {range: [7, 8], color: '#ff3385'},
                    {range: [8, 9], color: '#ff1a75'},
                    {range: [9, 10], color: '#ff0066'},
                ],
            },
            layout: {
                x: 0.5,
                y: 0.5,
                shapes: [
                    {
                    type: 'path',
                    path: getPathForNeedle(angle),
                    fillcolor: "#1ecefa",
                    line: {
                    color: "#000000"
                    }
                }
            ]
        }
    }];
    Plotly.newPlot('gauge', backgroundData, layout);
}

// Helper function to calculate the path for the needle
function getPathForNeedle(angle) {
    const radians = ((angle - 90) * Math.PI) / 180;
    const x = 0.04 * Math.cos(radians);
    const y = 0.04 * Math.sin(radians);
    return `M 0 0 L ${x} ${y} Z 0`;
}

//initialize the dashboard
init();


