const rippleButtons = document.querySelectorAll(".actionBtn");
const firmwareInput = document.querySelector("#firmwareInput");
const dropBox       = document.querySelector(".middle");
const updatePercent = document.querySelector(".updatePercent");
const respText      = document.querySelector(".respText");
const respTextTime  = 2000;
var respTextTimer   = null;

function mousePositionToCustomProp(posX, posY, element) {
  element.style.setProperty("--x", posX + "px");
  element.style.setProperty("--y", posY + "px");
}

function handleFirmwareInputClick(){
    firmwareInput.click();
}

function updateStatus(percent,status){
    if( status !== "done" ){
        updatePercent.innerHTML = `Feltöltés: ${percent}%`;
    }else{
        updatePercent.innerHTML = status;
    }
}

for (let rippleButton of rippleButtons) {
  rippleButton.addEventListener("click", (e) => {
    rippleButton.classList.remove("actionBtn-pulse");
    mousePositionToCustomProp(e.offsetX, e.offsetY, rippleButton);
    rippleButton.classList.add("actionBtn-pulse");
    handleFirmwareInputClick();
  });
}

function showRespText(text,kind){
    clearTimeout(respTextTimer);
    respText.innerHTML = text;
    respText.classList.add(kind);
    respTextTimer = setTimeout(() => {
        respText.classList.remove(kind);
    }, respTextTime);
}

function handleFirmwareFile(firmware){
    if( firmware.name !== "firmware.bin" || firmware === undefined || firmware === null || firmware === ""){
        showRespText("Hibás firmware fájl","error");
        firmwareInput.value = "";
        return;
    }

    const formData = new FormData();
    formData.append("firmware", firmware);
    fetch("/firmwareUpload", {
        method: "POST",
        body: formData
    }).then(response => {
        if(response.status === 200){
            showRespText("Firmware feltöltve!","success");
            setTimeout(() => { window.location.reload(); }, 15000);
        }else{
            showRespText("Hiba történt a firmware feltöltése közben!","error");
        }
        firmwareInput.value = "";
    }).catch(error => {
        showRespText("Hiba történt a firmware feltöltése közben!","error");
        firmwareInput.value = "";
    });
}

firmwareInput.addEventListener("change", (e) => {
    handleFirmwareFile( e.target.files[0] );
});


// listen for drop event on dropBox
dropBox.addEventListener("drop", (e) => {
    e.preventDefault();
    handleFirmwareFile( e.dataTransfer.files[0] );
});

// listen for drag over event on dropBox
dropBox.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropBox.classList.add("dropBox-highlight");
});

// listen for drag leave event on dropBox
dropBox.addEventListener("dragleave", (e) => {
    e.preventDefault();
    dropBox.classList.remove("dropBox-highlight");
});