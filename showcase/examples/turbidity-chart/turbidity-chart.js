// create data source for Android phone camera
import ChartJsView from 'osh-js/core/ui/view/chart/ChartJsView.js';
import CurveLayer from 'osh-js/core/ui/layer/CurveLayer.js';
import SweApi from 'osh-js/core/datasource/sweapi/SweApi.datasource.js';
import SosGetResultJson from 'osh-js/core/datasource/SosGetResultJson.js';

let chartDataSource = new SweApi("Turbidity", {
        protocol: "ws",
        endpointUrl: "localhost:8181/sensorhub/api",
        resource: "/datastreams/$rbh5gva7tgl96/observations",
        startTime: "T20:35:55Z",
        endTime: "T20:46:03Z",
        mode: Mode.REPLAY,
    });

//    let chartDataSource = new SosGetResultJson("weather", {
//        protocol: "ws",
//        service: "SOS",
//        endpointUrl: "sensiasoft.net:8181/sensorhub/sos",
//        offeringID: "urn:mysos:offering03",
//        observedProperty: "http://sensorml.com/ont/swe/property/Weather",
//        startTime: "now",
//        endTime: "2055-01-01Z"
//    });

// #region snippet_curve_layer
let MVLayerCurve = new CurveLayer({
    //console.log(rec);
    dataSourceId: chartDataSource.id,
    getValues: (rec, timeStamp) => {
        return {
            x: new Date(timeStamp).getTime(),
            y: parseFloat(rec.milliVolts.replace(/[^\d.-]/g, ''))
        }
    },
    name: 'Millivolts (mV)'
});

let PPMLayerCurve = new CurveLayer({
    //console.log(rec);
    dataSourceId: chartDataSource.id,
    getValues: (rec, timeStamp) => {
        return {
            x: new Date(timeStamp).getTime(),
            y: parseFloat(rec.partsPerMil.replace(/[^\d.-]/g, ''))
        }
    },
    name: 'Parts Per Million (ppm)'
});
// #endregion snippet_curve_layer

//chartDataSource.onDataReceived = (data) => {
//    console.log("Data received:", data);
//};

// show it in video view
let chartView = new ChartJsView({
    container: 'turb-container',
    layers: [ MVLayerCurve, PPMLayerCurve],
    css: "chart-view",
    chartjsProps: {
        chartProps: {
            scales: {
                yAxes: [{
                    scaleLabel: {
                        labelString: "Millivolts (mV)"
                    },
                    ticks: {
                        maxTicksLimit: 10
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        labelString: "Time"
                    },
                    ticks: {
                        maxTicksLimit: 20
                    }
                }],
            }
        },
        datasetsProps: {
            backgroundColor: 'rgba(141,242,246, 0.1)'
        }
    }
});

// start streaming
chartDataSource.connect();
