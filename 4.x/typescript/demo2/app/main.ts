/*
 * @Author: your name
 * @Date: 2020-12-17 14:28:02
 * @LastEditTime: 2020-12-17 14:41:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \VUE-Project\demo-GIS-ts\jsapi-resources\4.x\typescript\demo2\app\main.ts
 */

import EsriMap from "esri/Map"

import View from "esri/views/MapView"
import GroupLayer from "esri/layers/GroupLayer"
import MapImageLayer from "esri/layers/MapImageLayer"
import LayerList from "esri/widgets/LayerList"

import esri = __esri;

var USALayer = new MapImageLayer({
    url:
        "http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer",
    title: "US Sample Data"
});

// Create layer showing sample census data of the United States.
// Set visibility to false so it's not visible on startup.

var censusLayer = new MapImageLayer({
    url:
        "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer",
    title: "US Sample Census",
    visible: false
});

// Create GroupLayer with the two MapImageLayers created above
// as children layers.

var demographicGroupLayer = new GroupLayer({
    title: "US Demographics",
    visible: true,
    visibilityMode: "exclusive",
    layers: [USALayer, censusLayer],
    opacity: 0.75
});

// Create a map and add the group layer to it

var map = new EsriMap({
    basemap: "dark-gray-vector",
    layers: [demographicGroupLayer]
});

// Add the map to a MapView

var view = new View({
    center: [-98.5795, 39.8282],
    zoom: 4,
    container: "viewDiv",
    map: map
});

// Creates actions in the LayerList.

function defineActions(event: any) {
    // The event object contains an item property.
    // is is a ListItem referencing the associated layer
    // and other properties. You can control the visibility of the
    // item, its title, and actions using this object.

    var item = event.item;

    if (item.title === "US Demographics") {
        // An array of objects defining actions to place in the LayerList.
        // By making this array two-dimensional, you can separate similar
        // actions into separate groups with a breaking line.

        item.actionsSections = [
            [
                {
                    title: "Go to full extent",
                    className: "esri-icon-zoom-out-fixed",
                    id: "full-extent"
                },
                {
                    title: "Layer information",
                    className: "esri-icon-description",
                    id: "information"
                }
            ],
            [
                {
                    title: "Increase opacity",
                    className: "esri-icon-up",
                    id: "increase-opacity"
                },
                {
                    title: "Decrease opacity",
                    className: "esri-icon-down",
                    id: "decrease-opacity"
                }
            ]
        ];
    }
}

view.when(function () {
    // Create the LayerList widget with the associated actions
    // and add it to the top-right corner of the view.

    var layerList = new LayerList({
        view: view,
        // executes for each ListItem in the LayerList
        listItemCreatedFunction: defineActions
    });

    // Event listener that fires each time an action is triggered

    layerList.on("trigger-action", function (event) {
        // The layer visible in the view at the time of the trigger.
        var visibleLayer = USALayer.visible ? USALayer : censusLayer;

        // Capture the action id.
        var id = event.action.id;

        if (id === "full-extent") {
            // if the full-extent action is triggered then navigate
            // to the full extent of the visible layer
            view.goTo(visibleLayer.fullExtent).catch(function (error) {
                if (error.name != "AbortError") {
                    console.error(error);
                }
            });
        } else if (id === "information") {
            // if the information action is triggered, then
            // open the item details page of the service layer
            window.open(visibleLayer.url);
        } else if (id === "increase-opacity") {
            // if the increase-opacity action is triggered, then
            // increase the opacity of the GroupLayer by 0.25

            if (demographicGroupLayer.opacity < 1) {
                demographicGroupLayer.opacity += 0.25;
            }
        } else if (id === "decrease-opacity") {
            // if the decrease-opacity action is triggered, then
            // decrease the opacity of the GroupLayer by 0.25

            if (demographicGroupLayer.opacity > 0) {
                demographicGroupLayer.opacity -= 0.25;
            }
        }
    });

    // Add widget to the top right corner of the view
    view.ui.add(layerList, "top-right");
})