$(function () {

/* Pie With Gradient */

    // Radialize the colors
    Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function (color) {
        return {
            radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
            stops: [
                [0, color],
                [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
            ]
        };
    });

    // Build the chart
    $('#example1').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: 'Browser market shares at a specific website, 2014'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    },
                    connectorColor: 'silver'
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Browser share',
            data: [
                ['Firefox',   45.0],
                ['IE',       26.8],
                {
                    name: 'Chrome',
                    y: 12.8,
                    sliced: true,
                    selected: true
                },
                ['Safari',    8.5],
                ['Opera',     6.2],
                ['Others',   0.7]
            ]
        }]
    });


/* Pie With Gradient */


/* 3D Pie */

    $('#example2').highcharts({
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45,
                beta: 0
            }
        },
        title: {
            text: 'Browser market shares at a specific website, 2014'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                depth: 35,
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Browser share',
            data: [
                ['Firefox',   45.0],
                ['IE',       26.8],
                {
                    name: 'Chrome',
                    y: 12.8,
                    sliced: true,
                    selected: true
                },
                ['Safari',    8.5],
                ['Opera',     6.2],
                ['Others',   0.7]
            ]
        }]
    });

/* 3D Pie */


/* Basic Column */
    $('#example3').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Monthly Average Rainfall'
        },
        subtitle: {
            text: 'Source: WorldClimate.com'
        },
        xAxis: {
            categories: [
                'Jan',
                'Feb',
                'Dec'
            ]
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Rainfall (mm)'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding:0,
                borderWidth: 0
            }
        },
        series: [{
                name: 'Tokyo',
                data: [49.9,49.9,49.9,49.9,49.9,49.9,49.9]

            }, {
                name: 'New York',
                data: [83.6,83.6,83.6,83.6,83.6,83.6,83.6,83.6]

            }, {
                name: 'London',
                data: [48.9,48.9,48.9,48.9,48.9,48.9,48.9,48.9]

            },
            {
                name: 'London#2',
                data: [48.9,48.9,48.9,48.9,48.9,48.9,48.9,48.9]

            },
            {
                name: 'London#3',
                data: [38.9,48.9,48.9,48.9,48.9,48.9,48.9,48.9]

            },
            {
                name: 'London#4',
                data: [8.9,8.9,8.9,8.9,8.9,8.9,8.9,8.9]

            }, {
                name: 'Berlin',
                data: [42.4,42.4,42.4,42.4,42.4,42.4,42.4]

            }]
    });

/* Basic Column */


/* Stacked And Grouped Column */

    $('#example4').highcharts({

        chart: {
            type: 'column'
        },

        title: {
            text: 'Total fruit consumtion, grouped by gender'
        },

        xAxis: {
            categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
        },

        yAxis: {
            allowDecimals: false,
            min: 0,
            title: {
                text: 'Number of fruits'
            }
        },

        tooltip: {
            formatter: function () {
                return '<b>' + this.x + '</b><br/>' +
                    this.series.name + ': ' + this.y + '<br/>' +
                    'Total: ' + this.point.stackTotal;
            }
        },

        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },

        series: [{
            name: 'John',
            data: [5, 3, 4, 7, 2],
            stack: 'male'
        }, {
            name: 'Joe',
            data: [3, 4, 4, 2, 5],
            stack: 'male'
        }, {
            name: 'Jane',
            data: [2, 5, 6, 2, 1],
            stack: 'female'
        }, {
            name: 'Janet',
            data: [3, 0, 4, 4, 3],
            stack: 'female'
        }]
    });

/* Stacked And Grouped Column */


/* Solid Gauge */


    var gaugeOptions = {

        chart: {
            type: 'solidgauge'
        },

        title: null,

        pane: {
            center: ['50%', '85%'],
            size: '140%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },

        tooltip: {
            enabled: false
        },

        // the value axis
        yAxis: {
            stops: [
                [0.1, '#55BF3B'], // green
                [0.5, '#DDDF0D'], // yellow
                [0.9, '#DF5353'] // red
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickPixelInterval: 400,
            tickWidth: 0,
            title: {
                y: -70
            },
            labels: {
                y: 16
            }
        },

        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        }
    };

    // The speed gauge
    $('#container-speed').highcharts(Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 200,
            title: {
                text: 'Speed'
            }
        },

        credits: {
            enabled: false
        },

        series: [{
            name: 'Speed',
            data: [80],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                       '<span style="font-size:12px;color:silver">km/h</span></div>'
            },
            tooltip: {
                valueSuffix: ' km/h'
            }
        }]

    }));

    // The RPM gauge
    $('#container-rpm').highcharts(Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 5,
            title: {
                text: 'RPM'
            }
        },

        series: [{
            name: 'RPM',
            data: [1],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' +
                       '<span style="font-size:12px;color:silver">* 1000 / min</span></div>'
            },
            tooltip: {
                valueSuffix: ' revolutions/min'
            }
        }]

    }));

    // Bring life to the dials
    setInterval(function () {
        // Speed
        var chart = $('#container-speed').highcharts(),
            point,
            newVal,
            inc;

        if (chart) {
            point = chart.series[0].points[0];
            inc = Math.round((Math.random() - 0.5) * 100);
            newVal = point.y + inc;

            if (newVal < 0 || newVal > 200) {
                newVal = point.y - inc;
            }

            point.update(newVal);
        }

        // RPM
        chart = $('#container-rpm').highcharts();
        if (chart) {
            point = chart.series[0].points[0];
            inc = Math.random() - 0.5;
            newVal = point.y + inc;

            if (newVal < 0 || newVal > 5) {
                newVal = point.y - inc;
            }

            point.update(newVal);
        }
    }, 2000);


/* Solid Gauge */




/* Time Data With Irregular Time */

    $('#example6').highcharts({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Snow depth at Vikjafjellet, Norway'
        },
        subtitle: {
            text: 'Irregular time data in Highcharts JS'
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e. %b',
                year: '%b'
            },
            title: {
                text: 'Date'
            }
        },
        yAxis: {
            title: {
                text: 'Snow depth (m)'
            },
            min: 0
        },
        tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
        },

        series: [{
            name: 'Winter 2007-2008',
            // Define the data points. All series have a dummy year
            // of 1970/71 in order to be compared on the same x axis. Note
            // that in JavaScript, months start at 0 for January, 1 for February etc.
            data: [
                [Date.UTC(1970,  9, 27), 0   ],
                [Date.UTC(1970, 10, 10), 0.6 ],
                [Date.UTC(1970, 10, 18), 0.7 ],
                [Date.UTC(1970, 11,  2), 0.8 ],
                [Date.UTC(1970, 11,  9), 0.6 ],
                [Date.UTC(1970, 11, 16), 0.6 ],
                [Date.UTC(1970, 11, 28), 0.67],
                [Date.UTC(1971,  0,  1), 0.81],
                [Date.UTC(1971,  0,  8), 0.78],
                [Date.UTC(1971,  0, 12), 0.98],
                [Date.UTC(1971,  0, 27), 1.84],
                [Date.UTC(1971,  1, 10), 1.80],
                [Date.UTC(1971,  1, 18), 1.80],
                [Date.UTC(1971,  1, 24), 1.92],
                [Date.UTC(1971,  2,  4), 2.49],
                [Date.UTC(1971,  2, 11), 2.79],
                [Date.UTC(1971,  2, 15), 2.73],
                [Date.UTC(1971,  2, 25), 2.61],
                [Date.UTC(1971,  3,  2), 2.76],
                [Date.UTC(1971,  3,  6), 2.82],
                [Date.UTC(1971,  3, 13), 2.8 ],
                [Date.UTC(1971,  4,  3), 2.1 ],
                [Date.UTC(1971,  4, 26), 1.1 ],
                [Date.UTC(1971,  5,  9), 0.25],
                [Date.UTC(1971,  5, 12), 0   ]
            ]
        }, {
            name: 'Winter 2008-2009',
            data: [
                [Date.UTC(1970,  9, 18), 0   ],
                [Date.UTC(1970,  9, 26), 0.2 ],
                [Date.UTC(1970, 11,  1), 0.47],
                [Date.UTC(1970, 11, 11), 0.55],
                [Date.UTC(1970, 11, 25), 1.38],
                [Date.UTC(1971,  0,  8), 1.38],
                [Date.UTC(1971,  0, 15), 1.38],
                [Date.UTC(1971,  1,  1), 1.38],
                [Date.UTC(1971,  1,  8), 1.48],
                [Date.UTC(1971,  1, 21), 1.5 ],
                [Date.UTC(1971,  2, 12), 1.89],
                [Date.UTC(1971,  2, 25), 2.0 ],
                [Date.UTC(1971,  3,  4), 1.94],
                [Date.UTC(1971,  3,  9), 1.91],
                [Date.UTC(1971,  3, 13), 1.75],
                [Date.UTC(1971,  3, 19), 1.6 ],
                [Date.UTC(1971,  4, 25), 0.6 ],
                [Date.UTC(1971,  4, 31), 0.35],
                [Date.UTC(1971,  5,  7), 0   ]
            ]
        }, {
            name: 'Winter 2009-2010',
            data: [
                [Date.UTC(1970,  9,  9), 0   ],
                [Date.UTC(1970,  9, 14), 0.15],
                [Date.UTC(1970, 10, 28), 0.35],
                [Date.UTC(1970, 11, 12), 0.46],
                [Date.UTC(1971,  0,  1), 0.59],
                [Date.UTC(1971,  0, 24), 0.58],
                [Date.UTC(1971,  1,  1), 0.62],
                [Date.UTC(1971,  1,  7), 0.65],
                [Date.UTC(1971,  1, 23), 0.77],
                [Date.UTC(1971,  2,  8), 0.77],
                [Date.UTC(1971,  2, 14), 0.79],
                [Date.UTC(1971,  2, 24), 0.86],
                [Date.UTC(1971,  3,  4), 0.8 ],
                [Date.UTC(1971,  3, 18), 0.94],
                [Date.UTC(1971,  3, 24), 0.9 ],
                [Date.UTC(1971,  4, 16), 0.39],
                [Date.UTC(1971,  4, 21), 0   ]
            ]
        }]
    });

/* Time Data With Irregular Time */



    $('#example7').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'World\'s largest cities per 2014'
        },
        subtitle: {
            text: 'Source: <a href="http://en.wikipedia.org/wiki/List_of_cities_proper_by_population">Wikipedia</a>'
        },
        xAxis: {
            type: 'category',
            labels: {
                rotation: -45,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Population (millions)'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: 'Population in 2008: <b>{point.y:.1f} millions</b>'
        },
        series: [{
            name: 'Population',
            data: [
                ['Shanghai', 23.7],
                ['Lagos', 16.1],
                ['Istanbul', 14.2],
                ['Karachi', 14.0],
                ['Mumbai', 12.5],
                ['Moscow', 12.1],
                ['São Paulo', 11.8],
                ['Beijing', 11.7],
                ['Guangzhou', 11.1],
                ['Delhi', 11.1],
                ['Shenzhen', 10.5],
                ['Seoul', 10.4],
                ['Jakarta', 10.0],
                ['Kinshasa', 9.3],
                ['Tianjin', 9.3],
                ['Tokyo', 9.0],
                ['Cairo', 8.9],
                ['Dhaka', 8.9],
                ['Mexico City', 8.9],
                ['Lima', 8.9]
            ],
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                x: 4,
                y: 10,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif',
                    textShadow: '0 0 3px black'
                }
            }
        }]
    });

    $('#example8').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false
        },
        title: {
            text: 'Browser<br>shares',
            align: 'center',
            verticalAlign: 'middle',
            y: 50
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: true,
                    distance: -50,
                    style: {
                        fontWeight: 'bold',
                        color: 'white',
                        textShadow: '0px 1px 2px black'
                    }
                },
                startAngle: -90,
                endAngle: 90,
                center: ['50%', '75%']
            }
        },
        series: [{
            type: 'pie',
            name: 'Browser share',
            innerSize: '50%',
            data: [
                ['Firefox',   45.0],
                ['IE',       26.8],
                ['Chrome', 12.8],
                ['Safari',    8.5],
                ['Opera',     6.2],
                {
                    name: 'Others',
                    y: 0.7,
                    dataLabels: {
                        enabled: false
                    }
                }
            ]
        }]
    });


    $(document).ready(function () {

        // Build the chart
        $('#example9').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: 'Browser market shares at a specific website, 2014'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                name: 'Browser share',
                data: [
                    ['Firefox',   45.0],
                    ['IE',       26.8],
                    {
                        name: 'Chrome',
                        y: 12.8,
                        sliced: true,
                        selected: true
                    },
                    ['Safari',    8.5],
                    ['Opera',     6.2],
                    ['Others',   0.7]
                ]
            }]
        });
    });

});