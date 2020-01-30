
$("#data2019").click(function(){
  var datasetName = 2019;

  var mainSheetForProduct = '1QEO7O0jtOVrWSVTc5EnYs03PNHqDS7nspWC2CzaZP_c';
  var roleSheet = '15y7rVe9z9O1y1ISNxQMQbx-rVTY9hU7ePlEO86kpMd0';
  var shippingSheet = '1sN3aFKDTAjPJNNSHX2TssCY5S0mwcbmtJe4AyBAMtMY';

  localStorage.setItem("mainSheetForProduct",mainSheetForProduct);
  localStorage.setItem("roleSheet",roleSheet);
  localStorage.setItem("shippingSheet",shippingSheet);
  localStorage.setItem("datasetName",datasetName);


  window.location = "/";


})
$("#data2020").click(function(){
  var datasetName = 2020;

  var mainSheetForProduct = '1DD-wAE56uwKK_7Q7rZ5zigPAiMXwoqHKpiyBa6XJLk8';
  var roleSheet = '1PttgX_vfEPEWPzI2MFtSuWnPQi7ctzcs8QmnQOwxx74';
  var shippingSheet = '1iSGH0EXjdFOeZYDxWcy98Gv3d9CkvlcrraUZuaTR5ZY';

  localStorage.setItem("mainSheetForProduct",mainSheetForProduct);
  localStorage.setItem("roleSheet",roleSheet);
  localStorage.setItem("shippingSheet",shippingSheet);
  localStorage.setItem("datasetName",datasetName);

  window.location = "/";

})
