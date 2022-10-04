var printer = null;
var ePosDev = null;

function InitMyPrinter() {
    console.log("Init Printer");

    var printerPort = 8008;
    var printerAddress = "192.168.198.168";
    if (isSSL) {
        printerPort = 8043;
    }
    ePosDev = new epson.ePOSDevice();
    ePosDev.connect(printerAddress, printerPort, cbConnect);
}

//Printing
function cbConnect(data) {
    if (data == 'OK' || data == 'SSL_CONNECT_OK') {
        ePosDev.createDevice('local_printer', ePosDev.DEVICE_TYPE_PRINTER,
            {'crypto': false, 'buffer': false}, cbCreateDevice_printer);
    } else {
        console.log(data);
    }
}

function cbCreateDevice_printer(devobj, retcode) {
    if (retcode == 'OK') {
        printer = devobj;
        printer.timeout = 60000;
        printer.onreceive = function (res) { //alert(res.success);
            console.log("Printer Object Created");

        };
        printer.oncoveropen = function () { //alert('coveropen');
            console.log("Printer Cover Open");

        };
    } else {
        console.log(retcode);
        isRegPrintConnected = false;
    }
}

function print(salePrintObj) {
    debugger;
    if (isRegPrintConnected == false
        || printer == null) {
        return;
    }
    console.log("Printing Started");


    printer.addLayout(printer.LAYOUT_RECEIPT, 800, 0, 0, 0, 35, 0);
    printer.addTextAlign(printer.ALIGN_CENTER);
    printer.addTextFont(printer.FONT_SPECIAL_A);
    printer.addTextStyle(false, false, true, printer.COLOR_1);
    printer.addTextSize(2, 2);
    printer.addText('ThuyTitVu\n');
    printer.addTextSize(1, 1);
    printer.addText('XÁCH TAY HÀNG Ý PHÁP ĐỨC MỸ\n');
    printer.addTextFont(printer.FONT_B);
    printer.addTextAlign(printer.ALIGN_LEFT);
    printer.addTextStyle(false, false, false, printer.COLOR_1);
    printer.addText('Mã GHTK: 12345\n');
    printer.addBarcode('12345', printer.BARCODE_CODE39, printer.HRI_NONE, printer.FONT_A, 2, 32);
    printer.addText('Thông tin người nhận: Lê Văn Thanh\n');
    printer.addText('Địa chỉ: 34 Trường chinh, Xuân Hòa, Phúc Yên, Vĩnh Phúc\n');
    printer.addText('SĐT: 0376180193\n');
    printer.send();
}