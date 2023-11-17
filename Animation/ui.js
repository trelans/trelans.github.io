// will be used globally
let pointTimePositions = []; // Array to store the positions of slider points

const operations = [];
let previousOperations = [];

let keyframeContainers = [];
let currentKeyframeContainer = null;

// [[keyframes[0]], [keyframes[1]]]
let keyframeLayers = [];

// Function to deep copy an array of objects
// Function to deep copy an array or array of objects
function deepCopy(arr) {
    return arr.map(element => {
        if (Array.isArray(element)) {
            // If the element is an array, recursively deep copy it
            return deepCopy(element);
        } else if (typeof element === 'object' && element !== null) {
            // If the element is an object, deep copy it
            return { ...element };
        } else {
            // If the element is a primitive type, return it as is
            return element;
        }
    });
}

// Function to save keyframeLayers and keyframeContainers into a file
function saveToFile() {
    let animationNames = [];
    // TRAVERSE KEYFRAME LIST AND GET TEXT CONTENT OF EACH ITEM
    const keyframeList = document.getElementById("keyframe-list");
    for (let i = 0; i < keyframeList.children.length; i++) {
        animationNames.push(keyframeList.children[i].textContent);
    }
    const dataToSave = {
        animationNames: animationNames, 
        keyframeLayers: deepCopy(keyframeLayers),
        keyframeContainers: deepCopy(keyframeContainers),
    };

    const jsonString = JSON.stringify(dataToSave);
    const blob = new Blob([jsonString], { type: "application/json" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "keyframes_data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

document.addEventListener("DOMContentLoaded", function () {
    const timelineContainer = document.getElementById("timeline-container");
    const rulerContainer = document.getElementById("ruler");
    let markerCount = 0;
    let currentLastMarker = 0;

    function addMarker() {
        const marker = document.createElement("div");
        marker.className = "timeline-marker";

        const flexContainer = document.createElement("div");
        flexContainer.style.display = "flex";
        flexContainer.style.justifyContent = "space-between";

        // Texts to be centered using flex
        const texts = [markerCount, "'", "|", "'"]; // Include any additional texts here

        texts.forEach(text => {
            const textElement = document.createElement("div");
            textElement.textContent = text;
            textElement.style.width = "50%";
            textElement.style.textAlign = "start";
            flexContainer.appendChild(textElement);
        });

        marker.appendChild(flexContainer);

        rulerContainer.appendChild(marker);
        markerCount++;
    }



    for (let i = 0; i < 10; i++) {
        addMarker();
        currentLastMarker++;
    }

    timelineContainer.addEventListener("wheel", (event) => {
        if (event.deltaY < 0) {
            if (currentLastMarker >= markerCount) {
                addMarker();
            } else {
                currentLastMarker++;
                timelineContainer.scrollLeft = (currentLastMarker - 10) * (timelineContainer.offsetWidth / 10);
            }
        } else if (event.deltaY > 0) {
            if (currentLastMarker > 10) {
                currentLastMarker--;
            }
            timelineContainer.scrollLeft = (currentLastMarker - 10) * (timelineContainer.offsetWidth / 10);
        }

        event.preventDefault();
    });


    const timeline = document.getElementById("timeline-container");

    let currentDraggedPoint = null;
    let isDragging = false;
    let nextSliderId = 0; // ID of the next slider point to be created
    let currentSelectedPoint = null; // ID of the currently selected slider point


    function calculateNormalizedPosition(position) {
        const timelineWidth = timeline.getBoundingClientRect().width;
        const normalizedPosition = position / timelineWidth * 100;
        return Math.round(normalizedPosition);
    }


    // Function to create or select the existing slider point
    function createOrSelectSliderPoint(position, id = null, search=true) {

        console.log("In createOrSelectSliderPointttttttttttttttttttttttttttttttttttttttttttttttttt: ", position, id);

        position = parseFloat(position);

        const normalizedPosition = calculateNormalizedPosition(position);
        const existingPoints = document.querySelectorAll('.slider-point');

        // Check if there is an existing slider point at the clicked position
        let existingPoint = null;
        if (search){
            existingPoints.forEach(point => {
                const pointPosition = point.getBoundingClientRect().left - timeline.getBoundingClientRect().left;
                if (Math.abs(pointPosition - position) < 15) {
                    existingPoint = point;
                }
            });
        }
        
        let currentSmallestTime = currentLastMarker - 10;
        console.log("current smallest time", currentSmallestTime);
        position += currentSmallestTime * (timeline.getBoundingClientRect().width / 10);
        console.log("position after adding current smallest timeeeeeeeeeeeeeeeeeeeeee", position);
        console.log("normalized position", normalizedPosition);
        let pointTime = currentSmallestTime + normalizedPosition / 10;



        console.log("point sikik time:", pointTime);

        const selectedPoint = document.querySelector('.slider-point[style*="background-color: red"]');
        if (selectedPoint) {
            selectedPoint.style.backgroundColor = "#007BFF";
        }

        if (existingPoint) {
            console.log("existing point varrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
            // If a point exists, select it
            existingPoint.style.backgroundColor = "red";
            let selectedPoint = existingPoint.id.split("_")[1];
            if (currentSelectedPoint !== selectedPoint) {
                currentSelectedPoint = selectedPoint;
                operations.push({ type: "select", id: currentSelectedPoint });
            }
        } else {
            // If no point exists, create a new one
            const sliderPoint = document.createElement("div");
            sliderPoint.className = "slider-point";
            sliderPoint.style.left = position + "px";
            sliderPoint.style.backgroundColor = "red";
            console.log("id in createOrSelectSliderPoint", id);
            console.log("position:", position);
            if (id) {
                sliderPoint.id = `point_${id}`;
                nextSliderId = id;
            } else {
                sliderPoint.id = `point_${nextSliderId}`; // Assign the ID
            }
            console.log("point timeeeeeeeeeeeeeeeeeeeeeeee:", pointTime);
            pointTimePositions.push({ id: nextSliderId, pointTime }); // Add new point to the positions array
            currentSelectedPoint = nextSliderId;
            if (id) {
                nextSliderId = id + 1;
            } else {
                nextSliderId++;
            }
            operations.push({ type: "create", id: currentSelectedPoint, position: pointTime });
            sliderPoint.addEventListener("mousedown", function (event) {
                currentDraggedPoint = sliderPoint;
                isDragging = true;
                const offset = event.clientX - sliderPoint.getBoundingClientRect().left;
                let index = 0;

                window.addEventListener("mousemove", dragSliderPoint);
                window.addEventListener("mouseup", stopDragging);

                function dragSliderPoint(event) {
                    let newPosition = event.clientX - timeline.getBoundingClientRect().left - offset;
                    if (newPosition >= 0 && newPosition <= timeline.offsetWidth - sliderPoint.offsetWidth) {
                        newPosition += currentSmallestTime * (timeline.getBoundingClientRect().width / 10);
                        sliderPoint.style.left = newPosition + "px";
                        const normalizedPosition = calculateNormalizedPosition(newPosition);
                        const uniqueID = parseInt(sliderPoint.id.split("_")[1]);
                        index = pointTimePositions.findIndex(point => point.id === uniqueID);
                        if (index !== -1) {
                            pointTimePositions[index].pointTime = currentSmallestTime + normalizedPosition / 10;
                        }
                    }
                }

                function stopDragging() {
                    currentDraggedPoint = null;
                    isDragging = false;
                    window.removeEventListener("mousemove", dragSliderPoint);
                    window.removeEventListener("mouseup", stopDragging);
                    operations.push({ type: "move", id: index, position: pointTimePositions[index].pointTime });
                }
            });

            sliderPoint.addEventListener("dblclick", function () {
                if (!isDragging) {
                    // Remove the point from the array by ID
                    const uniqueID = parseInt(sliderPoint.id.split("_")[1]);
                    const index = pointTimePositions.findIndex(point => point.id === uniqueID);
                    if (index !== -1) {
                        pointTimePositions.splice(index, 1);
                    }
                    timelineContainer.removeChild(sliderPoint);
                    operations.push({ type: "delete", id: uniqueID });
                }
            });

            timelineContainer.appendChild(sliderPoint);
        }
    }


    // Add an event listener to create or select slider points on timeline click
    timeline.addEventListener("click", function (event) {
        if (timeline.classList.contains('disabled')) {
            return;
        }
        const position = event.clientX - timeline.getBoundingClientRect().left;
        console.log("position on click", position);
        createOrSelectSliderPoint(position);
        document.getElementById("click-listener").click();
    });

    /* Apply the "disabled" class to sliders and click listeners when play button is pressed */
    let playButton = document.getElementById('play-btn');
    let stopButton = document.getElementById('stop-btn');
    let addButton = document.getElementById('add-btn');

    let sliders = document.querySelectorAll('.slide');

    playButton.addEventListener('click', function () {
        // Add "disabled" class to sliders
        sliders.forEach(function (slider) {
            slider.classList.add('disabled');
        });

        // Add "disabled" class to timeline
        timeline.classList.add('disabled');
    });

    if (currentKeyframeContainer == null) {
        sliders.forEach(function (slider) {
            slider.classList.add('disabled');
        });
        timeline.classList.add('disabled');
    }

    stopButton.addEventListener('click', function () {
        // Remove "disabled" class from sliders
        sliders.forEach(function (slider) {
            slider.classList.remove('disabled');
        });

        // Remove "disabled" class from timeline
        timeline.classList.remove('disabled');
    });

    // Get all keyframe items
    const loadButton = document.getElementById("load-btn");
    const saveButton = document.getElementById("save-btn");

    // Get the keyframe list and load button
    const keyframeList = document.getElementById("keyframe-list");

    // Function to add a new keyframe item to the list
    function addKeyframeItem(animationName) {
        const newItem = document.createElement("li");
        newItem.textContent = animationName;
        newItem.classList.add("keyframe-item");

        newItem.addEventListener("click", function () {
            if (newItem.classList.contains("selected")) {
                // change the name of the animation
                newItem.textContent = prompt("Enter the name of the animation", newItem.textContent);
                return;
            }
            document.querySelectorAll(".keyframe-item").forEach(function (otherItem, index) {
                if (otherItem.classList.contains("selected")) {
                    otherItem.classList.remove("selected");
                    // add existing slider points to the keyframeContainers (do here)
                    const ids = [];
                    const positions = [];

                    console.log("otherItem", otherItem);

                    document.querySelectorAll(".slider-point").forEach(function (point) {
                        const id = parseInt(point.id.split("_")[1]);
                        const position = point.style.left.split("px")[0];
                        console.log(position);
                        ids.push(id);
                        positions.push(position);
                        timelineContainer.removeChild(point);
                    });
                    if (keyframeContainers[index] === undefined) {
                        keyframeContainers[index] = { "ids": [], "positions": [], "pointTimePositions": [] };
                    }
                    keyframeContainers[index]["pointTimePositions"] = deepCopy(pointTimePositions);
                    keyframeContainers[index]["ids"] = deepCopy(ids);
                    keyframeContainers[index]["positions"] = deepCopy(positions);

                    // clear the pointTimePositions array
                    pointTimePositions.length = 0;
                    nextSliderId = 0;

                    operations.push({ type: "layer-change-before" });
                    document.getElementById("click-listener").click();
                    console.log("ids", ids);
                }
            });

            // get the index of the current keyframe item
            let index = Array.from(newItem.parentNode.children).indexOf(newItem);
            currentKeyframeContainer = index;
            console.log("index: ", index);
            console.log("keyframeContainers: ", keyframeContainers);
            if (keyframeContainers[index]) {
                console.log("keyframeContainers", keyframeContainers);
                console.log("pointTimePositions", pointTimePositions);
                for (let i = 0; i < keyframeContainers[index]["ids"].length; i++) {
                    console.log("Inside point creation");
                    console.log(i);
                    console.log(keyframeContainers[index]["positions"][i]);
                    createOrSelectSliderPoint(keyframeContainers[index]["positions"][i], keyframeContainers[index]["ids"][i], false);
                    document.getElementById("click-listener").click();
                }
                // select 0th point
                createOrSelectSliderPoint(0, 0, true);
            } else {
                createOrSelectSliderPoint(0, 0, false);
                keyframeContainers[index] = { "ids": [], "positions": [], "pointTimePositions": [] };
                keyframeContainers[index]["pointTimePositions"] = deepCopy(pointTimePositions);
                keyframeContainers[index]["ids"] = [0];
                keyframeContainers[index]["positions"] = [0];
                console.log("should be clicked");
                console.log("operations", operations);
                document.getElementById("click-listener").click();
            }


            newItem.classList.toggle("selected");
            operations.push({ type: "layer-change-after" });
            document.getElementById("click-listener").click();

            if (sliders[0].classList.contains('disabled')) {
                sliders.forEach(function (slider) {
                    slider.classList.remove('disabled');
                });
                timeline.classList.remove('disabled');
            }

        });

        // Append the new item to the keyframe list
        keyframeList.appendChild(newItem);

        // if the new item is the first item, select it
        if (keyframeList.children.length === 1) {
            newItem.click();
        }
    }

    addKeyframeItem("New Animation");

    // Add click event listener to the Load button
    loadButton.addEventListener("click", function () {

        // execute unexecuted operations, if any
        document.getElementById("click-listener").click();

        // Trigger file input click programmatically
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "application/json";
        fileInput.addEventListener("change", handleFileSelect);
        fileInput.click();
    });

    // Function to handle file selection
    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const jsonString = e.target.result;

                try {
                    const loadedData = JSON.parse(jsonString);

                    // Update keyframeLayers and keyframeContainers with loaded data
                    // Add keyframe items to the list
                    loadedData.keyframeLayers.forEach(function (layer) {
                        console.log("adding layers");
                        console.log(layer);
                        keyframeLayers.push(layer);
                    });                    

                    loadedData.keyframeContainers.forEach(function (container, index) {
                        console.log("adding containers");
                        console.log(container);
                        keyframeContainers.push(container);
                        addKeyframeItem(loadedData.animationNames[index]);
                    });

                    console.log("Data loaded successfully:", loadedData);
                    console.log("new keyframeLayers");
                    console.log(keyframeLayers);
                    console.log("new keyframeContainers");
                    console.log(keyframeContainers);
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                    // Handle parsing error
                }
            };

            reader.readAsText(file);
        }
    }

    // Add click event listener to the Save button
    saveButton.addEventListener("click", function () {
        operations.push({ type: "save" });
        document.getElementById("click-listener").click();
        saveToFile();
    });

    // get addKeyframeButton
    const addKeyframeButton = document.getElementById("add-btn");

    // add click event listener to addKeyframeButton
    addKeyframeButton.addEventListener("click", function () {
        // add new keyframe item to the list
        addKeyframeItem("Added Animation " + (keyframeList.children.length + 1));
    });

});