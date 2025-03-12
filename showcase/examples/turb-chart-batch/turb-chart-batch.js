import ChartJsView from 'osh-js/core/ui/view/chart/ChartJsView.js';
import CurveLayer from 'osh-js/core/ui/layer/CurveLayer.js';
import SosGetResultJson from 'osh-js/core/datasource/SosGetResultJson.js';


//not sure why the charts are so small but they do appear......
let chartDataSource = new SosGetResultJson("Turbidity Batch", {
        protocol: "ws",
        service: "SOS",
        endpointUrl: "localhost:8181/sensorhub/sos",
        offeringID: "[URN]turbidity001",
        observedProperty: "urn:osh:datastream:TDSOutput:all_properties",
        startTime: "2025-02-26T20:35:55Z",
        endTime: "2025-02-26T20:46:03Z",
    });

console.log("DataSource ID:", chartDataSource.id);

let MVLayerCurve = new CurveLayer({
    dataSourceId: chartDataSource.id,
    getValues: (rec, Timestamp) => {
    console.log("Processing record:", rec);
            if (rec && rec.Millivolts && rec.Timestamp) {
                console.log("Timestamp:", rec.Timestamp);
                console.log("MilliVolts:", parseFloat(rec.Millivolts.replace(/[^\d.-]/g, '')));
                return {
                      x: rec.Timestamp,
                      y: parseFloat(rec.Millivolts.replace(/[^\d.-]/g, ''))
                };
            } else {
                console.log("Record does not contain millivolts.");
            }
            return null;
    },
    name: 'Millivolts (mV)'
});

let PPMLayerCurve = new CurveLayer({
    dataSourceId: chartDataSource.id,
    getValues: (rec, Timestamp) => {
    console.log("Processing next record:", rec);
        if (rec && rec["Parts Per Million"] && rec.Timestamp) {
            console.log("Timestamp:", rec.Timestamp);
            console.log("Parts Per Million:", parseFloat(rec["Parts Per Million"].replace(/[^\d.-]/g, '')));
            return {
                  x: rec.Timestamp,
                  y: parseFloat(rec["Parts Per Million"].replace(/[^\d.-]/g, ''))
            };
        } else {
            console.log("Record does not contain Parts Per Million.");
        }
        return null;
    },
    name: 'Parts Per Million (PPM)'
});

// show it in video view
let chartView0 = new ChartJsView({ // millivolts chart
    container: 'mv-container',
    layers: [MVLayerCurve],
    css: "chart-view0",
    chartjsProps: {
        datasetsProps: {
            backgroundColor: 'rgba(141,242,246, 0.1)'
        },
        chartProps: {
            scales: {
                yAxes: [{
                    scaleLabel: {
                        labelString: "Millivolts (mV)"
                    },
                    ticks: {
                        maxTicksLimit: 20
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        labelString: "Time"
                    },
                    ticks: {
                        maxTicksLimit: 10
                    }
                }],
            }
        },
    }
});

let chartView1 = new ChartJsView({ // parts per million chart
        container: 'ppm-container',
        layers: [PPMLayerCurve],
        css: "chart-view1",
        chartjsProps: {
            datasetsProps: {
                backgroundColor: 'rgba(141,242,246, 0.1)'
            },
            chartProps: {
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            labelString: "Parts Per Million (PPM)"
                        },
                        ticks: {
                            maxTicksLimit: 20
                        }
                    }],
                    xAxes: [{
                        scaleLabel: {
                            labelString: "Time"
                        },
                        ticks: {
                            maxTicksLimit: 10
                        }
                    }],
                }
            },
        }
    });

// start streaming
chartDataSource.connect();
