/*
 * @Author: your name
 * @Date: 2020-12-17 09:11:38
 * @LastEditTime: 2020-12-17 14:52:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \VUE-Project\demo-GIS-ts\jsapi-resources\4.x\typescript\demo\app\main.ts
 */

import EsriMap from "esri/WebMap";
import MapView from "esri/views/MapView";
import LayerList from "esri/widgets/LayerList"

import esri = __esri


const map = new EsriMap({
  portalItem: {
    //id: "d5dda743788a4b0688fe48f43ae7beb9"
    id: "e4d5df50327e4a6d9eda4915139cf291"
  }
});

const view = new MapView({
  map,
  container: "viewDiv",
});
var i = 0
const lyrList = new LayerList({
  view,
  listItemCreatedFunction: function (event: any) {
    
    if (i >= 1) return
    console.log("执行")
    const item: esri.ListItem = event.item;
    console.log(item)

    if (item.title !== "Copy of Light Gray Canvas") {
      i++
      item.panel = {
        content: ["legend"],
        open: true
      } as esri.ListItemPanel
    } else {
      console.log("找到了一个group层")
    }


  },
  selectionEnabled: true
})

view.ui.add(lyrList, "top-right")
