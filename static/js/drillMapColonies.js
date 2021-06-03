am4core.ready(function () {

    //======================= map with states production values end =============================
    function am4themes_myTheme(target) {
        if (target instanceof am4core.ColorSet) {
            target.list = [
                am4core.color("#ffcc33"),
                am4core.color("#e6ac00")
            ];
        }
    }

    // Themes begin
    am4core.useTheme(am4themes_myTheme);

    //am4core.useTheme(am4themes_animated);
    // Themes end

    // Create map instance
    var chart = am4core.create("mapdiv", am4maps.MapChart);

    // Set map definition
    chart.geodata = am4geodata_usaHigh;

    // Set projection
    chart.projection = new am4maps.projections.AlbersUsa();

    // Create map polygon series
    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    //Set min/max fill color for each area
    polygonSeries.heatRules.push({
        property: "fill",
        target: polygonSeries.mapPolygons.template,
        min: chart.colors.getIndex(0).brighten(0.5),
        max: chart.colors.getIndex(1).brighten(-0.5)
    });

    // Make map load polygon data (state shapes and names) from GeoJSON
    polygonSeries.useGeodata = true;

    // Set heatmap values for each state
    polygonSeries.data = data1 // read from json production year 2019

    // ===== map title =================
    var title = "(map) Honey production by State in 2019 (values expressed in 1,000 lbs)\n (circle) Num. of Operations with 5 or more colonies in 2019"
    chart.titles.create().text = title;
    //====================================

    // Set up heat legend
    let heatLegend = chart.createChild(am4maps.HeatLegend);
    heatLegend.series = polygonSeries;
    heatLegend.align = "right";
    heatLegend.valign = "bottom";
    heatLegend.width = am4core.percent(20);
    heatLegend.marginRight = am4core.percent(4);
    heatLegend.minValue = 0;
    heatLegend.maxValue = 40000;

    // Set up custom heat map legend labels using axis ranges
    var minRange = heatLegend.valueAxis.axisRanges.create();
    minRange.value = heatLegend.minValue;
    minRange.label.text = "1000 lbs or lest";
    var maxRange = heatLegend.valueAxis.axisRanges.create();
    maxRange.value = heatLegend.maxValue;
    maxRange.label.text = "40,000 + lbs";

    // Blank out internal heat legend value axis labels
    heatLegend.valueAxis.renderer.labels.template.adapter.add("text", function (labelText) {
        return "";
    });

    // Configure series tooltip
    var polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}: {value} (1,000 lbs)";
    polygonTemplate.nonScalingStroke = true;
    polygonTemplate.strokeWidth = 0.5;

    // Create hover state and set alternative fill color
    var hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#b38600");
    //======================= map with states production values end =============================

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
    labelTemplate.fillOpacity = 0.1;

    //var ids = ["US-AZ", "US-TX", "US-AL", "US-CA"];
    var ids1 = data1.map(state => state.id); //data from file json production in 2019.csv

    // Set up label series to populate
    polygonTemplate.events.on("inited", function () {
        for (var i = 0; i < 40; i++) {
            // if (ids[i] != "HI") {
            var polygon = polygonSeries.getPolygonById(ids1[i]);
            if (polygon) {
                var label = labelSeries.mapImages.create();
                var state = polygon.dataItem.dataContext.id.split("-").pop();
                label.latitude = polygon.visualLatitude;
                label.longitude = polygon.visualLongitude;
                label.children.getIndex(0).text = state + " ";
                
            }
            //  }
        }
    });

    // == count colonies by county in GA ================================
    chart.events.on("ready", loadStores);

    // Loads store data
    function loadStores() {
        var loader = new am4core.DataSource();
        loader.url = "static/json/honey_owp.json"
        // loader.url = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/TargetStores.json";

        loader.events.on("parseended", function (ev) {
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
        template.tooltipText = "[bold]{name}:\n{stores} Operation Bees Colony[/]\n[bold]";
        template.fill = "#000" // circle color

        var circle = template.createChild(am4core.Circle);
        circle.radius = 22;
        circle.fillOpacity = 0.6;
        //circle.border.color = "#000"
        circle.verticalCenter = "middle";
        circle.horizontalCenter = "middle";
        circle.nonScaling = true;
        //console.log(circle)
        var label = template.createChild(am4core.Label);
        label.text = "{stores}";
        label.fill = am4core.color("#fff");
        label.verticalCenter = "middle";
        label.horizontalCenter = "middle";
        label.nonScaling = true;

        var heat = series.heatRules.push({
            target: circle,
            property: "radius",
            min: 10,
            max: 25
        });

        // Set up drill-down
        series.mapImages.template.events.on("hit", function (ev) {

            // Determine what we've clicked on
            var data = ev.target.dataItem.dataContext;

            // No id? Individual store - nothing to drill down to further
            if (!data.target) {
                return;
            }

            // Create actual series if it hasn't been yet created
            if (!regionalSeries[data.target].series) {
                regionalSeries[data.target].series = createSeries("count");
               // regionalSeries[data.target].series = createSeries("peso");
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
              //zoomOut.show();

            // Show new targert series
            currentSeries = regionalSeries[data.target].series;
            currentSeries.show();
        });

        return series;
    }

    var regionalSeries = {};
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
        am4core.array.each(data.query_results, function (store) {

            // Get store data
            var store = {
                state: store.ids, // "GA", // store.MAIL_ST_PROV_C,
                long: am4core.type.toNumber(store.Lon),
                lat: am4core.type.toNumber(store.Lat),
                location: store.cnty,
                city: store.cnty,
                count: am4core.type.toNumber(store.num_owp)
                //peso: am4core.type.toNumber(store.Honey)
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
                        stores: store.count, //2,
                        lat: statePolygon.visualLatitude,
                        long: statePolygon.visualLongitude,
                        state: store.state,
                        //peso: store.peso,
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
                //regionalSeries[store.state].peso += store.peso;
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
                    //peso: store.peso,
                    markerData: []
                };
                regionalSeries[store.state].markerData.push(regionalSeries[store.city]);
            }
            else {
                regionalSeries[store.city].stores += store.count;
               // regionalSeries[store.city].peso += store.peso;
               // regionalSeries[store.city].stores += store.count, // 1,
                    regionalSeries[store.city].count += store.count;
            }

            // Process individual store
            regionalSeries[store.city].markerData.push({
                name: store.location,
                count: store.count,
                //peso: store.peso,
                stores: store.count, // 1,
                lat: store.lat,
                long: store.long,
                state: store.state
            });

        });

        regionalSeries.US.series.data = regionalSeries.US.markerData;
    }

}); // end am4core.ready()