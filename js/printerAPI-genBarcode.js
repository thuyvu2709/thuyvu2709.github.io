var fullLabel = document.getElementById("fullLabel").innerHTML;

JsBarcode("#barcode").options({font: "OCR-B"}).code128a(fullLabel, {height: 55}).render();