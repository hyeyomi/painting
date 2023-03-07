const photoSpace = document.getElementById("photo_space");
const photo = document.createElement("img");

const fontType = document.getElementById("font_type");
const fontLineType = document.getElementById("line_type");
const fontWidth = document.getElementById("font_width");

const saveBtn = document.getElementById("save");
const textInput = document.getElementById("text");
const fileInput = document.getElementById("file");
const eraseBtn = document.getElementById("eraser-btn");
const destroyBtn = document.getElementById("destroy-btn");
const modeBtn = document.getElementById("mode-btn")
const colorOptions = Array.from(document.getElementsByClassName("color-option")); // 배열로 만들기
const lineWidth = document.querySelector("#line-width");
const color = document.getElementById("color");
const canvas = document.querySelector("canvas");

const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 550;

const ctx = canvas.getContext("2d"); //그리는 브러쉬
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

ctx.lineWidth=lineWidth.value;
ctx.lineCap = "round"; // 선의 끝부분이 둥글게 나타남


const colors = [
    "#ff3838",
    "#ffb8b8",
    "#c56cf0",
    "#ff9f1a",
    "#fff200",
    "#32ff7e",
    "#7efff5",
    ]

let isPainting = false;
let isFilling = false;
let isStroking = false;

function onMove(event){
if(isPainting){
        ctx.lineTo(event.offsetX,event.offsetY);
        ctx.stroke();
        return;
     }
ctx.moveTo(event.offsetX,event.offsetY);
}

function onMouseDown(){
 isPainting = true;
}

function cancelPainting(){
isPainting = false;
ctx.beginPath();
}

function onLineWidthChange(event){
ctx.lineWidth = event.target.value;
}

function onColorChange(event){
 ctx.strokeStyle = event.target.value;
 ctx.fillStyle = event.target.value;
}

function onColorClick(event){
const colorValue= event.srcElement.dataset.color;
ctx.strokeStyle = colorValue;
ctx.fillStyle = colorValue;
color.value = colorValue;
}
function onModeClick(){
 if(isFilling){
    isFilling = false;
    modeBtn.innerText = "Fill";
 }
 else {isFilling = true;
    modeBtn.innerText = "Draw";
 }
}

function onCanvasClick(){
    if(isFilling){
        ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    }
}

function onDestroyClick(){
    ctx.fillStyle ="white";
    ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
}

function onEraserClick(){
    ctx.strokeStyle = "white";
    isFilling = false;
    modeBtn.innerText = "Fill";
}

function onFileChange(event){
   const file = event.target.files[0];
   const url = URL.createObjectURL(file); // 메모리에 있는 파일의 url을 가져옴, 실제 인터넷에 존재하는 url이 아니라 브라우저가 자신의 파일을 드러내는 url이다.
   const image = new Image();
   image.src = url;
   image.onload = function(){
    ctx.drawImage(image,0,0,CANVAS_WIDTH,CANVAS_HEIGHT );
   }
   
   photo.id ="photoImg";
   photo.src = url;
   photoSpace.appendChild(photo);
}

function onDoubleClick(event){
    const text = textInput.value;
    if(text !== ""){
    ctx.save(); // 현재상태를 저장함
    ctx.lineWidth = 1; // 변경이 일어남
    let selectedFont = fontType.value;
    ctx.font = `${fontWidth.value}px ${selectedFont}`; // 폰트 사이즈 조절하기
    if(isStroking){
    ctx.strokeText(text,event.offsetX,event.offsetY);}
    else{ctx.fillText(text,event.offsetX,event.offsetY);}
    ctx.restore(); // 변경 이전의 저장된 상태로 돌아감
    }
}


function onSaveClick(){
    const url = canvas.toDataURL(); // 캔버스 이미지를 url 로 표현
    const a = document.createElement("a"); // a태그 생성
    a.href = url;
    a.download = "MyDrawing.png";
    a.click();
}

function onFontTypeClick(){
   if(fontType.value === "Serif"){
     fontType.value = "Slap Serif";
     fontType.innerText ="Slap Serif"
     console.log(fontType.value);
   }
   else if(fontType.value === "Slap Serif"){
    fontType.value = "cursive";
    fontType.innerText = "cursive";
    console.log(fontType.value);
   }
   else if(fontType.value === "cursive"){
    fontType.value = "monospace";
    fontType.innerText = "monospace";
   }
   else {
    fontType.value = "Serif";
    fontType.innerText = "Serif";
   }
}

function onFontLineClick(){
    if(isStroking){
        isStroking = false;
        fontLineType.innerText = "Stroke";
    }
    else {
        isStroking = true;
        fontLineType.innerText = "Fill";
    }
}

canvas.addEventListener("dblclick", onDoubleClick);
canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", onMouseDown);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave",cancelPainting)
canvas.addEventListener("click",onCanvasClick);

lineWidth.addEventListener("change",onLineWidthChange);

color.addEventListener("change", onColorChange);


colorOptions.forEach((item)=>{
    item.addEventListener("click",onColorClick);
})

modeBtn.addEventListener("click", onModeClick);
destroyBtn.addEventListener("click",onDestroyClick);
eraseBtn.addEventListener("click",onEraserClick);
fileInput.addEventListener("change", onFileChange);
saveBtn.addEventListener("click", onSaveClick);
fontType.addEventListener("click",onFontTypeClick);
fontLineType.addEventListener("click",onFontLineClick);