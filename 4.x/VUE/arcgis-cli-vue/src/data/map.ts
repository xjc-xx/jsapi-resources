/*
 * @Author: CC-TSR
 * @Date: 2020-12-18 08:58:26
 * @LastEditTime: 2020-12-19 14:24:09
 * @LastEditors: xiejiancheng1999@qq.com
 * @Description: 
 * @FilePath: \arcgis-cli-vue\src\data\map.ts
 * @可以输入预定的版权声明、个性签名、空行等
 */
import MapView from 'esri/views/MapView';
import SceneView from 'esri/views/SceneView';
import WebMap from 'esri/WebMap';
import WebScene from 'esri/WebScene';
import Expand from 'esri/widgets/Expand';
import Legend from 'esri/widgets/Legend';
import LayerList from 'esri/widgets/LayerList'
import Slide from "esri/webscene/Slide"

import { webMapId, webSceneId } from '../config';



export const webMap = new WebMap({
    portalItem: {
        id: webMapId
    },
});

export const webScene = new WebScene({
    portalItem: {
        id: webSceneId
    }
});


export const view = new MapView({
    map: webMap
});

export const scene = new SceneView({
    map: webScene
})
var layerList = new LayerList({
    view: scene
})
var layerList2D = new LayerList({
    view
})
scene.ui.add(layerList, 'top-right');
view.ui.add(layerList2D, 'top-right');
scene.popup.autoOpenEnabled = true;
scene.popup.dockOptions = {
    // Dock the popup when the size of the view is less than or equal to 600x1000 pixels
    breakpoint: {
        width: 300,
        height: 300
    },
    position: "bottom-right"
};
scene.popup.dockEnabled = true;

export const slidesDiv = document.createElement("div");
slidesDiv.classList.add("esri-widgets");
slidesDiv.style.display = "flex";
slidesDiv.style.flexDirection = "row";
slidesDiv.style.width = "100%";
slidesDiv.style.bottom = "20px";
slidesDiv.style.justifyContent = "center";
slidesDiv.id = "slidesDiv";

/*********************************************************************
 * Function to create the UI for a slide by creating DOM nodes and
 * adding them to the slidesDiv container.
 *********************************************************************/
function createSlideUI(slide: any, placement: any) {
    /*********************************************************************
     * Create a new <div> element which contains all the slide information.
     * Store a reference to the created DOM node so we can use it to place
     * other DOM nodes and connect events.
     *********************************************************************/
    var slideElement = document.createElement("div");
    // Assign the ID of the slide to the <span> element
    slideElement.id = slide.id;
    slideElement.classList.add("slide");

    /*********************************************************************
     * Place the newly created DOM node cat the beginning of the slidesDiv
     *********************************************************************/
    if (placement === "first") {
        slidesDiv.insertBefore(slideElement, slidesDiv.firstChild);
    } else {
        slidesDiv.appendChild(slideElement);
    }

    /*********************************************************************
     * Create a <div> element to contain the slide title text
     *********************************************************************/
    var title = document.createElement("div");
    title.innerText = slide.title.text;
    // Place the title of the slide in the <div> element
    slideElement.appendChild(title);

    /*********************************************************************
     * Create a new <img> element and place it inside the newly created slide
     * element. This will reference the thumbnail from the slide.
     *********************************************************************/
    var img = new Image();
    // Set the src URL of the image to the thumbnail URL of the slide
    img.src = slide.thumbnail.url;
    // Set the title property of the image to the title of the slide
    img.title = slide.title.text;
    // Place the image inside the new <div> element
    slideElement.appendChild(img);

    /*********************************************************************
     * Set up a click event handler on the newly created slide. When clicked,
     * the code defined below will execute.
     *********************************************************************/
    slideElement.addEventListener("click", function () {
        /*******************************************************************
         * Remove the "active" class from all elements with the .slide class
         *******************************************************************/
        var slides = document.querySelectorAll(".slide");
        Array.from(slides).forEach(function (node) {
            node.classList.remove("active");
        });

        /*******************************************************************
         * Add the "active" class on the current element being selected
         *******************************************************************/
        slideElement.classList.add("active");

        /******************************************************************
            将幻灯片的设置应用于SceneView。
         *
         *每张幻灯片都有一个viewpoint和visibleLayers属性，它们定义了
         *幻灯片或应包含的图层的视角或摄影机
         *在选择幻灯片时对用户可见。这个方法
         *允许用户动画化给定幻灯片的视点并旋转
         *在视图的可见图层和底图图层上。 
         ******************************************************************/
        slide.applyTo(scene);
    });
}

// add a legend widget instance to the view
// and set the style to 'card'. This is a
// responsive style, which is good for mobile devices
export const legend = new Expand({
    content: new Legend({
        view,
        style: 'card'
    }),
    view,
    expanded: true
});


// var _container: HTMLDivElement = null
/**
 * Assigns the container element to the View
 * @param container
 */
export const initialize = (container: HTMLDivElement, container3d: HTMLDivElement, widget: HTMLDivElement) => {
    container3d.parentElement.appendChild(slidesDiv)
    scene.ui.add([widget, slidesDiv]);
    view.container = container;
    scene.container = container3d
    view.when()
        .then(_ => {
            console.log('Map and View are ready');
        })
        .catch(error => {
            console.warn('An error in creating the map occured:', error);
        });
    scene.when()
        .then(_ => {
            console.log('Scene and View are ready');
            document.getElementById("slidesDiv").style.visibility = "visible";
            console.log(document.getElementById("createSlideButton"))

            var slides = webScene.presentation.slides;

            slides.forEach(createSlideUI);

            document
                .getElementById("createSlideButton")
                .addEventListener("click", function () {

                    Slide.createFrom(scene).then(function (slide) {
                        slide.title.text = document.getElementById(
                            "createSlideTitleInput"
                        ).value;
                        webScene.presentation.slides.add(slide);
                        createSlideUI(slide, "first");
                    });
                });
        })
        .catch(error => {
            console.warn('An error in creating the map occured:', error);
        });
};



// 已废弃的2D转3D视图代码
// export const changeTo2D = () => {
//     // view.container = view.container??scene.container;

//     console.log(view.container)

//     view.container = _container
//     scene.container = null
// }

// export const changeTo3D = () => {
//     // scene.container = scene.container??view.container;
//     if(scene.container) return
//     scene.destroy()
//     scene = new SceneView({
//         map: webScene
//     })
//     scene.container = _container
//     view.container = null

// }
