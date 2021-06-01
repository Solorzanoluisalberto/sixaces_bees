var Values = 0
var color = "#ddd"
d3.csv("static/data/2019_GGaPC.csv").then(function (Counties) {
        Counties.forEach(function (County) {
           //County.County = +County.County;
            County.Counts = +County.Counts
        });
        var County = Counties.map(County => County.County);
        Values = Counties.map(County_val => County_val.Counts);

        d3.csv("static/data/hp_prod_19.csv").then(function (states) {
            states.forEach(function (State) {
                State[`prod(1000_lbs)`] = +State[`prod(1000_lbs)`];
                State[`value_prod(1000_dollars)`] = +State[`value_prod(1000_dollars)`]
            });
            
        // Print the tvData
        //console.log(EarthData[0]);
            var State = states.map(state => state.state);
            var id_State = states.map(state => state.id_state);
            console.log(id_State)
            var Pro_lb = states.map(lbs => lbs[`prod(1000_lbs)`]);
            var Pro_value = states.map(value_dollar => value_dollar[`value_prod(1000_dollars)`]);
            var topvalue = Math.max(...Pro_lb)
            var bottomvalue = Math.min(...Pro_lb)
            console.log(bottomvalue, topvalue)

            function get_color(stado) {
                //console.log(stado)

                for (var i = 0; i < states.length; i++) {

                    if (states[i].state == stado) {
                        let Values = states[i][`prod(1000_lbs)`]
                        if (Values <= 100) {
                            color = "#1a1300";
                        } else if (Values > 100 && Values <= 250) {
                            color = "#806000";
                        } else if (Values > 250 && Values <= 500) {
                            color = "#997300";
                        } else if (Values > 500 && Values <= 1000) {
                            color = "#b38600";
                        } else if (Values > 1000 && Values <= 2000) {
                            color = "#cc9900";
                        } else if (Values > 2000 && Values <= 3000) {
                            color = "#e6ac00";
                        } else if (Values > 3000 && Values <= 4000) {
                            color = "#ffbf00";
                        } else if (Values > 4000 && Values <= 5000) {
                            color = "#ffc61a";
                        } else if (Values > 5000 && Values <= 6000) {
                            color = "#ffcc33";
                        } else if (Values > 6000 && Values <= 7000) {
                            color = "#ffd24d";
                        } else if (Values > 7000 && Values <= 8000) {
                            color = "#ffd966";
                        } else if (Values > 8000 && Values <= 10000) {
                            color = "#ffdf80";
                        } else if (Values > 10000) {
                            color = "#ffe699";
                        } else {
                            color = "#332600"
                        }
                        return color
                    }
                }
            }
        //}

am4core.ready(function () {
    function am4themes_myTheme(target) {
        if (target instanceof am4core.ColorSet) {
            target.list = [

                am4core.color("#ffcc33"),
                am4core.color("#e6ac00")

            ];
        }
    }

    am4core.useTheme(am4themes_myTheme);

    var defaultMap = "usaAlbersLow";

    // calculate which map to be used
    var currentMap = defaultMap;
    var title = "";

    // Create map instance
    var chart = am4core.create("mapdiv", am4maps.MapChart);
    title = "Honey production in 2019"
    chart.titles.create().text = title;
    

    //currentMap = am4geodata_usaHigh
    // Set map definition
    // chart.geodataSource.url = "https://www.amcharts.com/lib/4/geodata/json/" + currentMap + ".json";
    chart.geodataSource.url = "static/json/usaAlbersHigh.json";
    
    chart.geodataSource.events.on("parseended", function (ev) {
        var data = [];
       for (var i = 0; i < ev.target.data.features.length; i++) {
            data.push({
              //  id: ev.target.data.features[i].id,
             //  value: Math.round(Math.random() * 1000)
            })
        }
       // polygonSeries.data = data1;
    })
    console.log(data1)
    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;
    polygonSeries.data = data1;
    // Set projection
    //chart.projection = new am4maps.projections.Mercator();
    chart.projection = new am4maps.projections.AlbersUsa();

    // Create map polygon series
    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    //var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    //Set min/max fill color for each area
    polygonSeries.heatRules.push({
        property: "fill",
        target: polygonSeries.mapPolygons.template,
        min: chart.colors.getIndex(1).brighten(0.3),
        max: chart.colors.getIndex(0).brighten(-0.5)
    });
    polygonSeries.useGeodata = true;

    // Set up heat legend
    let heatLegend = chart.createChild(am4maps.HeatLegend);
    heatLegend.series = polygonSeries;
    heatLegend.align = "right";
    heatLegend.width = am4core.percent(25);
    heatLegend.marginRight = am4core.percent(10);
    heatLegend.minValue = 0;
    heatLegend.maxValue = 40000;
    heatLegend.valign = "bottom";

    // Set up custom heat map legend labels using axis ranges
    var minRange = heatLegend.valueAxis.axisRanges.create();
    minRange.value = heatLegend.minValue;
    minRange.label.text = "Little";
    var maxRange = heatLegend.valueAxis.axisRanges.create();
    maxRange.value = heatLegend.maxValue;
    maxRange.label.text = "A lot!";

    // Blank out internal heat legend value axis labels
    heatLegend.valueAxis.renderer.labels.template.adapter.add("text", function (labelText) {
        return "";
    });
    // =============================== end legend ===============================
    // ================== Configure series tooltip ============================
    var polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{id}: {value}";
    polygonTemplate.nonScalingStroke = true;
    polygonTemplate.strokeWidth = 0.5;
    
    // Create hover state and set alternative fill color
    var hs = polygonTemplate.states.create("hover");
    hs.properties.fill = chart.colors.getIndex(0).brighten(0);

    // ============== Add zoom control ======================
    chart.zoomControl = new am4maps.ZoomControl();
    chart.zoomControl.align = "right";
    chart.zoomControl.valign = "top"
    //  ===============  Add button  =============================

    var homeButton = new am4core.Button();
    homeButton.events.on("hit", function () {
        if (currentSeries) {
            currentSeries.hide();
        }
        chart.goHome();
        zoomOut.hide();
        currentSeries = regionalSeries.US.series;
        currentSeries.show();
    });

    homeButton.icon = new am4core.Sprite();
    homeButton.padding(5, 7, 5, 7);
    homeButton.width = 30;
    //homeButton.high = 30;
    //homeButton.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
    homeButton.icon.path = "M16.5,22a1,1,0,0,1-.5-.13l-1.38-.8a1,1,0,0,1,1-1.73l.88.51,3.5-2v-4l-3.5-2-3.5,2V18a1,1,0,0,1-2,0v-4.8a1,1,0,0,1,.5-.87L16,9.74a1,1,0,0,1,1,0l4.5,2.6a1,1,0,0,1,.5.87V18.4a1,1,0,0,1-.5.87L17,21.87A1,1,0,0,1,16.5,22Z M7.5,22a1,1,0,0,1-.5-.13l-4.5-2.6A1,1,0,0,1,2,18.4V13.21a1,1,0,0,1,.5-.87L7,9.74a1,1,0,0,1,1,0l4.5,2.6a1,1,0,1,1-1,1.73l-4-2.31-3.5,2v4l3.5,2,4-2.31a1,1,0,0,1,1.37.36,1,1,0,0,1-.37,1.37L8,21.87A1,1,0,0,1,7.5,22Z M16.5,11.6a1,1,0,0,1-1-1V6L12,4,8.5,6V10.6a1,1,0,1,1-2,0V5.41A1,1,0,0,1,7,4.54l4.5-2.6a1,1,0,0,1,1,0L17,4.54a1,1,0,0,1,.5.87V10.6A1,1,0,0,1,16.5,11.6Z";
    homeButton.marginBottom = 3;
    homeButton.parent = chart.zoomControl;
    homeButton.insertBefore(chart.zoomControl.plusButton);

    //======================== ===============================
    var zoomOut = chart.tooltipContainer.createChild(am4core.ZoomOutButton);
    zoomOut.hide();
    // =========================================================

    // Make map load polygon (like Counties) data from GeoJSON plates.json
    // ================ counties polygons ==================
    var stateSeries = chart.series.push(new am4maps.MapPolygonSeries());
    for (let index = 0; index < am4geodata_plates.features.length; index++) {
        stateSeries = chart.series.push(new am4maps.MapPolygonSeries());
        stateSeries.geodata = am4geodata_plates.features[index];
        stateSeries.mapPolygons.template.id = index
        stateSeries.mapPolygons.template.fillOpacity = 0;
        stateSeries.mapPolygons.template.strokeWidth = 1
        stateSeries.mapPolygons.template.stroke = am4core.color("#fff");
        stateSeries.mapPolygons.template.interactionsEnabled = true;
        var usPolygonTemplate = stateSeries.mapPolygons.template;
        usPolygonTemplate.tooltipText = "{name}";
       // console.log(stateSeries.mapPolygons.template.visualLatitude)
        usPolygonTemplate.fill = chart.colors.getIndex(1);
        usPolygonTemplate.nonScalingStroke = true;
    }
// ================ counties polygons End ==================
// =============== circle in map ===================
    // Configure label series
    var labelSeries = chart.series.push(new am4maps.MapImageSeries());
    var labelTemplate = labelSeries.mapImages.template.createChild(am4core.Label);
    labelTemplate.horizontalCenter = "middle";
    labelTemplate.verticalCenter = "middle";
    labelTemplate.fontSize = 14;
    labelTemplate.interactionsEnabled = false;
    labelTemplate.nonScaling = true;

    //var ids = ["US-AZ", "US-TX", "US-AL", "US-CA"];
    var ids = states.map(state => state.id_state); //data from file json production in 2019.csv

    // Set up label series to populate
    polygonTemplate.events.on("inited", function () {
        for (var i = 0; i < 40; i++) {
            if (ids[i] != "HI") {
                var polygon = polygonSeries.getPolygonById("US-" + ids[i]);
                if (polygon) {
                    var label = labelSeries.mapImages.create();
                    var state = polygon.dataItem.dataContext.id.split("-").pop();
                    label.latitude = polygon.visualLatitude;
                    label.longitude = polygon.visualLongitude;
                    label.children.getIndex(0).text = state + " ";
                }
            }
        }
    });


// == count colonies by county in GA ================================
   chart.events.on("ready", loadStores);
   
// Loads store data
function loadStores() {
    var loader = new am4core.DataSource();
    loader.url = "static/json/2019_GGaPC.json"
    // loader.url = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/TargetStores.json";

  loader.events.on("parseended", function(ev) {
            setupStores(ev.target.data);
  });
  loader.load();
}

// Creates a series
function createSeries(heatfield) {
  var series = chart.series.push(new am4maps.MapImageSeries());
    series.dataFields.value = heatfield;
  var template = series.mapImages.template;
    template.verticalCenter = "middle";
    template.horizontalCenter = "middle";
    template.propertyFields.latitude = "lat";
    template.propertyFields.longitude = "long";
    template.tooltipText = "{name}:\n[bold]{stores} Bees colonies[/]\n[bold] XY pound of honey[/]";
    template.fill = "#ddd" // circle color

  var circle = template.createChild(am4core.Circle);
  circle.radius = 25;
    circle.fillOpacity = 0.8;
    //circle.border.color = "#000"
  circle.verticalCenter = "middle";
  circle.horizontalCenter = "middle";
    circle.nonScaling = true;
    //console.log(circle)
  var label = template.createChild(am4core.Label);
  label.text = "{stores}";
  label.fill = am4core.color("#000");
  label.verticalCenter = "middle";
  label.horizontalCenter = "middle";
  label.nonScaling = true;

  var heat = series.heatRules.push({
            target: circle,
    property: "radius",
    min: 10,
    max: 30
  });

  // Set up drill-down
  series.mapImages.template.events.on("hit", function(ev) {

    // Determine what we've clicked on
    var data = ev.target.dataItem.dataContext;

     // No id? Individual store - nothing to drill down to further
    if (!data.target) {
      return;
    }

    // Create actual series if it hasn't been yet created
    if (!regionalSeries[data.target].series) {
            regionalSeries[data.target].series = createSeries("count");
      regionalSeries[data.target].series.data = data.markerData;
    }

    // Hide current series
    if (currentSeries) {
            currentSeries.hide();
    }

    // Control zoom
    if (data.type == "state") {
      var statePolygon = polygonSeries.getPolygonById("US-" + data.state);
      chart.zoomToMapObject(statePolygon);
    }
    else if (data.type == "city") {
            chart.zoomToGeoPoint({
                latitude: data.lat,
                longitude: data.long
            }, 64, true);
    }
    //  zoomOut.show();

    // Show new targert series
    currentSeries = regionalSeries[data.target].series;
    currentSeries.show();
  });

  return series;
}

var regionalSeries = { };
var currentSeries;

function setupStores(data) {

            // Init country-level series
            regionalSeries.US = {
                markerData: [],
                series: createSeries("colonies")
            };

  // Set current series
  currentSeries = regionalSeries.US.series;

  // Process data
  am4core.array.each(data.query_results, function(store) {

    // Get store data
    var store = {
            state: "GA", // store.MAIL_ST_PROV_C,
        long: am4core.type.toNumber(store.Lon),
        lat: am4core.type.toNumber(store.Lat),
        location: store.County,
        city: store.County,
        count: am4core.type.toNumber(store.Counts)
      };
      //console.log(count)

    // Process state-level data
    if (regionalSeries[store.state] == undefined) {
      var statePolygon = polygonSeries.getPolygonById("US-" + store.state);
        if (statePolygon) {
            //console.log(statePolygon)

            // Add state data
            regionalSeries[store.state] = {
                target: store.state,
                type: "state",
                name: statePolygon.dataItem.dataContext.name,
                count: store.count,
                stores: store.count , //2,
                lat: statePolygon.visualLatitude,
                long: statePolygon.visualLongitude,
                state: store.state,
                markerData: []
            };
        regionalSeries.US.markerData.push(regionalSeries[store.state]);

      }
      else {
        // State not found
        return;
      }
    }
    else {
        regionalSeries[store.state].stores += store.count;
      regionalSeries[store.state].count += store.count;
    }

    // Process city-level data
    if (regionalSeries[store.city] == undefined) {
            regionalSeries[store.city] = {
                target: store.city,
                type: "city",
                name: store.city,
                count: store.count,
                stores: store.count, // 1,
                lat: store.lat,
                long: store.long,
                state: store.state,
                markerData: []
            };
      regionalSeries[store.state].markerData.push(regionalSeries[store.city]);
    }
    else {
        regionalSeries[store.city].stores += store.count;
        //regionalSeries[store.city].stores += store.count, // 1,
      regionalSeries[store.city].count += store.count;
    }

    // Process individual store
    regionalSeries[store.city].markerData.push({
      name: store.location,
      count: store.count,
        stores: store.count, // 1,
      lat: store.lat,
      long: store.long,
      state: store.state
    });

  });

  regionalSeries.US.series.data = regionalSeries.US.markerData;
}
    var data12 = [
        {
            id: "US-AL",
            value: 1
        },
        {
            id: "US-AK",
            value: 626932
        },
        {
            id: "US-AK",
            value: 5130632
        },
        {
            id: "US-AZ",
            value: 2673400
        },
        {
            id: "US-CA",
            value: 33871648
        },
        {
            id: "US-CO",
            value: 4301261
        },
        {
            id: "US-CT",
            value: 3405565
        },
        {
            id: "US-DE",
            value: 783600
        },
        {
            id: "US-FL",
            value: 15982378
        },
        {
            id: "US-GA",
            value: 7
        },
        {
            id: "US-HI",
            value: 1211537
        },
        {
            id: "US-ID",
            value: 1293953
        },
        {
            id: "US-IL",
            value: 12419293
        },
        {
            id: "US-IN",
            value: 6080485
        },
        {
            id: "US-IA",
            value: 2926324
        },
        {
            id: "US-KS",
            value: 2688418
        },
        {
            id: "US-KY",
            value: 4041769
        },
        {
            id: "US-LA",
            value: 4468976
        },
        {
            id: "US-ME",
            value: 1274923
        },
        {
            id: "US-MD",
            value: 5296486
        },
        {
            id: "US-MA",
            value: 6349097
        },
        {
            id: "US-MI",
            value: 9938444
        },
        {
            id: "US-MN",
            value: 4919479
        },
        {
            id: "US-MS",
            value: 2844658
        },
        {
            id: "US-MO",
            value: 5595211
        },
        {
            id: "US-MT",
            value: 902195
        },
        {
            id: "US-NE",
            value: 1711263
        },
        {
            id: "US-NV",
            value: 1998257
        },
        {
            id: "US-NH",
            value: 1235786
        },
        {
            id: "US-NJ",
            value: 8414350
        },
        {
            id: "US-NM",
            value: 1819046
        },
        {
            id: "US-NY",
            value: 18976457
        },
        {
            id: "US-NC",
            value: 8049313
        },
        {
            id: "US-ND",
            value: 642200
        },
        {
            id: "US-OH",
            value: 11353140
        },
        {
            id: "US-OK",
            value: 3450654
        },
        {
            id: "US-OR",
            value: 3421399
        },
        {
            id: "US-PA",
            value: 12281054
        },
        {
            id: "US-RI",
            value: 1048319
        },
        {
            id: "US-SC",
            value: 4012012
        },
        {
            id: "US-SD",
            value: 754844
        },
        {
            id: "US-TN",
            value: 5689283
        },
        {
            id: "US-TX",
            value: 20851820
        },
        {
            id: "US-UT",
            value: 2233169
        },
        {
            id: "US-VT",
            value: 608827
        },
        {
            id: "US-VA",
            value: 7078515
        },
        {
            id: "US-WA",
            value: 5894121
        },
        {
            id: "US-WV",
            value: 1808344
        },
        {
            id: "US-WI",
            value: 5363675
        },
        {
            id: "US-WY",
            value: 493782
        }
    ];


}); // end am4core.ready()

        }); //end read csv file states
    }); //end read csv file county
