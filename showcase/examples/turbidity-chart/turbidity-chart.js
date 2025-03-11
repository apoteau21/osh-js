import ChartJsView from 'osh-js/core/ui/view/chart/ChartJsView.js';
import CurveLayer from 'osh-js/core/ui/layer/CurveLayer.js';
import SosGetResultJson from 'osh-js/core/datasource/SosGetResultJson.js';

    let chartDataSource = new SosGetResultJson("Turbidity", {
        protocol: "ws",
        service: "SOS",
        endpointUrl: "localhost:8181/sensorhub/sos",
        offeringID: "[URN]turbidity001",
        observedProperty: "urn:osh:datastream:TDSOutput:all_properties",
        startTime: "2025-02-26T20:35:55Z",
        endTime: "2025-02-26T20:46:03Z",
    });

    console.log("DataSource ID:", chartDataSource.id);

// #region snippet_curve_layer
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
 //#endregion snippet_curve_layer

// show it in video view
let chartView = new ChartJsView({
    container: 'turb-container',
    layers: [MVLayerCurve, PPMLayerCurve],
    css: "chart-view",
    chartjsProps: {
        chartProps: {
            scales: {
                yAxes: [{
                    scaleLabel: {
                        labelString: "Millivolts (mV) & Parts Per Million (PPM)"
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
                        maxTicksLimit: 20
                    }
                }],
            }
        },
        datasetsProps: {
            backgroundColor: 'rgba(141,242,246, 0.1)' // this stays the same blue no matter what color i change it to
//            borderColor: 'rgba(255, 183, 51, 0.8)', // Line color
//            backgroundColor: 'rgba(255, 217, 148, 0.8)', // Fill color under the line
//            pointBackgroundColor: '#fff7ab', // Point color
//            pointBorderColor: 'rgba(255, 183, 51, 0.8)', // Border color around points
//            pointHoverBackgroundColor: 'rgba(255, 251, 50, 0.8)', // Point hover background color
//            pointHoverBorderColor: 'rgba(255, 88, 50, 0.8)' // Point hover border color
        }
    }
});


console.log("Attempting to connect to data source");
// start streaming
chartDataSource.connect();
console.log("connected to data source");

