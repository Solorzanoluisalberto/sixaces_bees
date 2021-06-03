am4core.ready(function () {

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
    // Themes begin
    //am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create("mapdiv", am4maps.MapChart);

    try {
        // Set map definition
        chart.geodata = am4geodata_region_usa_gaHigh;
    }
    catch (e) {
        chart.raiseCriticalError(new Error("Map geodata could not be loaded. Please download the latest <a href=\"https://www.amcharts.com/download/download-v4/\">amcharts geodata</a> and extract its contents into the same directory as your amCharts files."));
    }

    //chart.projection = new am4maps.projections.Mercator();
    chart.projection = new am4maps.projections.Miller();


    // zoomout on background click
    chart.chartContainer.background.events.on("hit", function () { zoomOut() });
    // ===== map title =================
    var title = "Bees and Others Pollination Distribution in Georgia 2019"
    chart.titles.create().text = title;
    //====================================

    var colorSet = new am4core.ColorSet();
    var morphedPolygon;

    // map polygon series (countries)
    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;
    //var state_ = data2.map(idstate => idstate.id)
    var county_name = data2.map(County => County.County)

    //var counties_ = am4geodata_region_usa_gaHigh.map(county_ => county_.id)
    //console.log(counties_)
    //polygonSeries.include = state_ // ["US-FL", "US-GA", "US-CA", "US-AZ", "US-NY", "US-TX", "US-MI"]
    //polygonSeries.include = ["13185", "13183", "13181", "13179"] //state_ // ["US-FL", "US-GA", "US-CA", "US-AZ", "US-NY", "US-TX", "US-MI"]
    var counties_ = chart.geodata.features.map(ids => ids.id)
    polygonSeries.include = counties_
    //console.log(counties_)
    //Set min/max fill color for each area
    polygonSeries.heatRules.push({
        property: "fill",
        target: polygonSeries.mapPolygons.template,
        min: chart.colors.getIndex(0).brighten(0.3),
        max: chart.colors.getIndex(1).brighten(-0)
    });

    // country area look and behavior
    var polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.strokeOpacity = 1;
    polygonTemplate.stroke = am4core.color("#ffffff");
    polygonTemplate.fillOpacity = 1;
    polygonTemplate.tooltipText = "{name}";

    // ============== Add zoom control ======================
    chart.zoomControl = new am4maps.ZoomControl();
    chart.zoomControl.align = "right";
    chart.zoomControl.valign = "top"
    //  ===============  Add button  =============================

    var homeButton = new am4core.Button();
    homeButton.events.on("hit", function () {

        chart.goHome();
        //zoomOut.hide();
        zoomOut()
        morphBack
        countryLabel.text = "Select a County";
        countryLabel.show()
        am4core.ready
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
    // ===================== end button ===============================

    // desaturate filter for countries
    var desaturateFilter = new am4core.DesaturateFilter();
    desaturateFilter.saturation = 0.3;
    polygonTemplate.filters.push(desaturateFilter);

    // take a color from color set
    polygonTemplate.adapter.add("fill", function (fill, target) {
        return colorSet.getIndex(target.dataItem.index + 1);
    })

    // set fillOpacity to 1 when hovered
    var hoverState = polygonTemplate.states.create("hover");
    hoverState.properties.fillOpacity = 1;

    // what to do when country is clicked
    polygonTemplate.events.on("hit", function (event) {
        event.target.zIndex = 1000000;
        selectPolygon(event.target);
    })

    // Pie chart
    var pieChart = chart.seriesContainer.createChild(am4charts.PieChart);
    // Set width/heigh of a pie chart for easier positioning only
    pieChart.width = 100;
    pieChart.height = 100;
    pieChart.hidden = true; // can't use visible = false!

    // because defauls are 50, and it's not good with small countries
    pieChart.chartContainer.minHeight = 1;
    pieChart.chartContainer.minWidth = 1;

    // =======================  read data for pie chart ======================
    var pieSeries = pieChart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "value";
    pieSeries.dataFields.category = "category";
    //Datos = [{ id: "US-GA", val: [{ value: 20, category: "First" }, { value: 50, category: "Second" }, { value: 30, category: "Third" }]}];
    // pieSeries.data = [{ value: 100, category: "First" }, { value: 20, category: "Second" }, { value: 10, category: "Third" }]

    var dropShadowFilter = new am4core.DropShadowFilter();
    dropShadowFilter.blur = 4;
    pieSeries.filters.push(dropShadowFilter);

    var sliceTemplate = pieSeries.slices.template;
    sliceTemplate.fillOpacity = 1;
    sliceTemplate.strokeOpacity = 0;

    var activeState = sliceTemplate.states.getKey("active");
    activeState.properties.shiftRadius = 0; // no need to pull on click, as country circle under the pie won't make it good

    var sliceHoverState = sliceTemplate.states.getKey("hover");
    sliceHoverState.properties.shiftRadius = 0; // no need to pull on click, as country circle under the pie won't make it good

    // we don't need default pie chart animation, so change defaults
    var hiddenState = pieSeries.hiddenState;
    hiddenState.properties.startAngle = pieSeries.startAngle;
    hiddenState.properties.endAngle = pieSeries.endAngle;
    hiddenState.properties.opacity = 0;
    hiddenState.properties.visible = false;

    // series labels
    var labelTemplate = pieSeries.labels.template;
    labelTemplate.nonScaling = true;
    labelTemplate.fill = am4core.color("#FFFFFF");
    labelTemplate.fontSize = 18;
    labelTemplate.background = new am4core.RoundedRectangle();
    labelTemplate.background.fillOpacity = 0.9;
    labelTemplate.padding(4, 9, 4, 9);
    labelTemplate.background.fill = am4core.color("#3f405a");

    // we need pie series to hide faster to avoid strange pause after country is clicked
    pieSeries.hiddenState.transitionDuration = 300;

    // country label
    var countryLabel = chart.chartContainer.createChild(am4core.Label);
    countryLabel.text = "Select a County";
    countryLabel.fill = am4core.color("#3f405a");
    countryLabel.fontSize = 40;

    countryLabel.hiddenState.properties.dy = 1000;
    countryLabel.defaultState.properties.dy = 0;
    countryLabel.valign = "bottom";
    countryLabel.align = "right";
    countryLabel.paddingRight = 40;
    countryLabel.paddingTop = 40;
    countryLabel.hide(0);
    countryLabel.show();

    // select polygon
    function selectPolygon(polygon) {
        if (morphedPolygon != polygon) {
            var animation = pieSeries.hide();
            if (animation) {
                animation.events.on("animationended", function () {
                    morphToCircle(polygon);
                })
            }
            else {
                morphToCircle(polygon);
            }
        }
    }

    // fade out all countries except selected
    function fadeOut(exceptPolygon) {
        for (var i = 0; i < polygonSeries.mapPolygons.length; i++) {
            var polygon = polygonSeries.mapPolygons.getIndex(i);
            if (polygon != exceptPolygon) {
                polygon.defaultState.properties.fillOpacity = 0.5;
                polygon.animate([{ property: "fillOpacity", to: 0.5 }, { property: "strokeOpacity", to: 1 }], polygon.polygon.morpher.morphDuration);
            }
        }
    }

    function zoomOut() {
        if (morphedPolygon) {
            pieSeries.hide();
            morphBack();
            fadeOut();
            countryLabel.hide();
            morphedPolygon = undefined;
        }
    }

    function morphBack() {
        if (morphedPolygon) {
            morphedPolygon.polygon.morpher.morphBack();
            var dsf = morphedPolygon.filters.getIndex(0);
            dsf.animate({ property: "saturation", to: 0.25 }, morphedPolygon.polygon.morpher.morphDuration);
        }
    }

    function morphToCircle(polygon) {

        var animationDuration = polygon.polygon.morpher.morphDuration;
        // if there is a country already morphed to circle, morph it back
        morphBack();
        // morph polygon to circle
        polygon.toFront();
        polygon.polygon.morpher.morphToSingle = true;
        var morphAnimation = polygon.polygon.morpher.morphToCircle();

        polygon.strokeOpacity = 0; // hide stroke for lines not to cross countries

        polygon.defaultState.properties.fillOpacity = 1;
        polygon.animate({ property: "fillOpacity", to: 1 }, animationDuration);

        // animate desaturate filter
        var filter = polygon.filters.getIndex(0);
        filter.animate({ property: "saturation", to: 1 }, animationDuration);

        // save currently morphed polygon
        morphedPolygon = polygon;

        // fade out all other
        fadeOut(polygon);

        // hide country label
        countryLabel.hide();

        if (morphAnimation) {
            morphAnimation.events.on("animationended", function () {
                zoomToCountry(polygon);
            })
        }
        else {
            zoomToCountry(polygon);
        }
    }

    function zoomToCountry(polygon) {
        var zoomAnimation = chart.zoomToMapObject(polygon, 2.5, true);
        if (zoomAnimation) {
            zoomAnimation.events.on("animationended", function () {
                showPieChart(polygon);
            })
        }
        else {
            showPieChart(polygon);
        }
    }

    function showPieChart(polygon) {
        polygon.polygon.measure();
        var radius = polygon.polygon.measuredWidth / 1.2 * polygon.globalScale / chart.seriesContainer.scale;
        pieChart.width = radius * 2;
        pieChart.height = radius * 2;
        pieChart.radius = radius;

        var centerPoint = am4core.utils.spritePointToSvg(polygon.polygon.centerPoint, polygon.polygon);
        centerPoint = am4core.utils.svgPointToSprite(centerPoint, chart.seriesContainer);

        pieChart.x = centerPoint.x - radius;
        pieChart.y = centerPoint.y - radius;

        var fill = polygon.fill;
        var desaturated = fill.saturate(0.9);

        //=============================== validate state clicked to show values in pie chart ========================
        var valores = []
        var sum = 0
        //console.log(data1)
        //var state_ = data1.map(idstate => idstate.id)
        var category1 = data2.map(category1 => category1.Carpenter)
        var category2 = data2.map(category2 => category2.Bumble)
        var category3 = data2.map(category3 => category3.Honey)
        var category4 = data2.map(category4 => category4.Small)
        var category5 = data2.map(category5 => category5.Wasps)
        var category6 = data2.map(category6 => category6.Flies)
        var category7 = data2.map(category7 => category7.Butterflies)
        var category8 = data2.map(category8 => category8.Insects)


        for (var t = 0; t < county_name.length; t++) {
            if (polygon.dataItem._dataContext.name == county_name[t]) {
                //console.log(polygon.dataItem._dataContext.id)
                valores = [
                    {
                        value: category1[t],
                        category: "Carpenter"
                    },
                    {
                        value: category2[t],
                        category: "Bumble"
                    },
                    {
                        value: category3[t],
                        category: "Honey"
                    },
                    {
                        value: category4[t],
                        category: "Small"
                    },
                    {
                        value: category5[t],
                        category: "Wasps"
                    },
                    {
                        value: category6[t],
                        category: "Flies"
                    },
                    {
                        value: category7[t],
                        category: "Butterflies"
                    },
                    {
                        value: category8[t],
                        category: "Insects"
                    }

                ]
                //console.log(valores)
                sum = category1[t] + category2[t] + category3[t] + category4[t] + category5[t] + category6[t] + category7[t] + category8[t]
            }
        }
        //console.log(sum)
        pieSeries.data = valores
        for (var i = 0; i < pieSeries.dataItems.length; i++) {
            var dataItem = pieSeries.dataItems.getIndex(i);
            dataItem.value = Math.round(Math.random() * 100);
            dataItem.slice.fill = am4core.color(am4core.colors.interpolate(
                fill.rgb,
                am4core.color("#ffffff").rgb,
                0.2 * i
            ));

            dataItem.label.background.fill = desaturated;
            dataItem.tick.stroke = fill;
        }

        pieSeries.show();
        pieChart.show();

        countryLabel.text = "{name}\n Total: " + sum;
        countryLabel.dataItem = polygon.dataItem;
        countryLabel.fill = desaturated;
        countryLabel.show();
    }

}); // end am4core.ready()