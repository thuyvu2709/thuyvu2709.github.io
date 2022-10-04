function makePrintWindowTemplate(orderDetail) {
        
    var myvar = '<html>'+
    '    <style>'+
    '        .title1 {'+
    '            font-size : 20px;'+
    '            font-weight: 900;'+
    '        }'+
    '        .title2 {'+
    '            font-size : 15px;'+
    '            font-weight: 900;'+
    '        }'+
    '        .normal {'+
    '            font-size : 12px;'+
    '            font-weight: 900;'+
    '        }'+
    '        .centralize {'+
    '            text-align: center;'+
    '        }'+
    '       .hidden {'+
    '           display: none;'+
    '       }'+
    '       @page {'+
    '           margin:0cm;'+
    '       }'+
    '    </style>'+
    // '    <script src="../vendor/JsBarcode/JsBarcode.all.min.js"></script>'+
    '    <body>'+
    '        <div class="title1 centralize">THUYTITVU SHOP</div>'+
    '        <div class="title2 centralize">XÁCH TAY HÀNG Ý PHÁP ĐỨC MỸ</div>'+
      '        <div class="centralize">~❀~</div>'+
    '        <div class="normal centralize">Mã GHTK:'+orderDetail.otherInfor.order.order.label+'</div>'+
    '        <svg id="barcode" class="centralize"></svg>'+
    '        <div class="normal">Người nhận hàng:'+orderDetail.customerName+'</div>'+
    '        <div class="normal">ĐT:'+orderDetail.customerPhone+'</div>'+
    '        <div class="normal">ĐC:'+orderDetail.customerAddress+'</div>'+
    '        <div class="normal">Ghi chú: Hàng dễ vỡ, vui lòng nhẹ tay, không cho khách mở hàng</div>'+
    '        <div class="hidden" id="fullLabel">'+orderDetail.otherInfor.order.order.tracking_id+'</div>'+
    '    </body>'+
    // '    <script>'+
    // '        JsBarcode("#barcode")'+
    // '            .options({font: "OCR-B"}) // Will affect all barcodes'+
    // '            .code128a("'+orderDetail.otherInfor.order.order.tracking_id+'", {height: 55})'+
    // '            .render();'+
    // '    </script>'+
    '</html>';
    return myvar;
}