const canvas = document.querySelector("canvas"),
ctx = canvas.getContext("2d"), // allow to draw 2d shapes
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
colorBtns = document.querySelectorAll(".colors .options .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
sizeSlider = document.querySelector("#size-slider");

let isDrawing = false, 
prevMouseX, prevMouseY,
selectedTool = "brush",
selectedColor = "#000",
brushWidth = 5,
snapshot;

const setCanvasBackground = () => {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
}

window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

toolBtns.forEach( btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".option.active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        console.log(selectedTool)
    })
});

const startDrawing = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; // get current x coordinates of mouse as previous coordinates
    prevMouseY = e.offsetY; // get current y coordinates of mouse as previous coordinates
    ctx.beginPath(); // creating new path to draw
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    // copying canvas data & passing it as snapshot value... this avoids  dragging the image
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height) 
}

const drawing = (e) => {
    if (!isDrawing) return; // if isDrawing = false then not drawing
    ctx.putImageData(snapshot, 0, 0)
    if (selectedTool === "brush" || selectedTool === "eraser") {
        ctx.strokeStyle = selectedTool === "eraser" ? "white" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); // creating currentMouse coordinates (x,y) that line will be drown to 
        ctx.stroke(); // drawing line or filling line with color
    } else {
        if (selectedTool === "rectangle") {
            drawingRect(e);
        } else {
            if (selectedTool === "circle") {
                drawingCircle(e);
            } else {
                drawingTriangle(e);
            }
        }
    }
}

const drawingRect = (e) => {
    if (!fillColor.checked) {
        return ctx.strokeRect(prevMouseX, prevMouseY, e.offsetX - prevMouseX, e.offsetY - prevMouseY);
    }
    ctx.fillRect(prevMouseX, prevMouseY, e.offsetX - prevMouseX, e.offsetY - prevMouseY);
}

const drawingCircle = (e) => {
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow(e.offsetX - prevMouseX, 2) + Math.pow(e.offsetY - prevMouseY, 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI) // creating a circle according to mouse coordinates
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const drawingTriangle = (e) => {
        ctx.beginPath();
        ctx.moveTo(prevMouseX, prevMouseY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
        if (!fillColor.checked) {
            ctx.closePath();
            ctx.stroke();
        } else {
            ctx.fill();
        }
}

colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector(".option.selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = getComputedStyle(btn).backgroundColor;
    });
});

colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.backgroundColor = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBackground();
});

saveImg.addEventListener("click", () => {
    const link = document.createElement("a"); // creating a tag element 
    link.download = `${Date.now()}.jpg`; // set the name and extension of the link
    link.href = canvas.toDataURL(); // passing canvasData as a link href value 
    link.click(); // download
});

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false)
sizeSlider.addEventListener("change", () => {
    brushWidth = sizeSlider.value;
});
