
var currentDatasetName = localStorage.getItem("defaultDatasetName");
var currentDatabaseIndex = 0;

var triggerAfterLoad = function(){
  $("#loadingSpin").show();
  getDatasetList(function(){
      datasetList = JSON.parse(localStorage.getItem("DatasetList"));
      // console.log(datasetList);
      var content = '';
      for (e in datasetList) {
        if (e == 0) {
          continue;
        }
        content = content + '<div class="card">'+
          '<div class="card-header">'+
            '<h5 class="mb-0">'+
              '<button class="btn btn-link datasetItem set_'+e+'">'+
                datasetList[e][0]+
              '</button>';

        if (currentDatasetName != datasetList[e][0]) {
          content = content + '<button class="btn btn-link datasetItemChooseDefault set_'+e+'">'+
            "Chọn mặc định"+
          '</button>';
        } else {
          content = content + '<button class="btn btn-link textRed set_'+e+'">'+
            "Đang là mặc định"+
            '</button>';
          currentDatabaseIndex = e;
        }
        content = content+ '</h5>'+
          '</div>'+
        '</div>';
      }

      $("#listOrder").html(content);

      $("#loadingSpin").hide();
      $(".datasetItem").click(function(){
        var setIndex = parseInt($(this).attr("class").split(" ").pop().split("_").pop());
        localStorage.setItem("mainSheetForProduct",datasetList[setIndex][1]);
        localStorage.setItem("shippingSheet",datasetList[setIndex][2]);
        localStorage.setItem("datasetName",datasetList[setIndex][0]);
        window.location = "/";
      })
      $(".datasetItemChooseDefault").click(function(){
        var setIndex = parseInt($(this).attr("class").split(" ").pop().split("_").pop());

        editDatasetDefault(currentDatabaseIndex, "", function(){
          editDatasetDefault(setIndex, "1", function(){
            localStorage.setItem("mainSheetForProduct",datasetList[setIndex][1]);
            localStorage.setItem("shippingSheet",datasetList[setIndex][2]);
            localStorage.setItem("datasetName",datasetList[setIndex][0]);
            localStorage.setItem("defaultDatasetName",datasetList[setIndex][0]);
            // location.reload();
          })          
        })
      })
  })
}

function editDatasetDefault(index, value, callback) {
  // console.log()
  editCommonData(roleSheet, [[value]], "Roles!D"+(index+1)+":D"+(index+1), function(){
    callback();
  })
}


// $("#data2019").click(function(){
//   var datasetName = 2019;

//   var mainSheetForProduct = '1QEO7O0jtOVrWSVTc5EnYs03PNHqDS7nspWC2CzaZP_c';
//   var roleSheet = '15y7rVe9z9O1y1ISNxQMQbx-rVTY9hU7ePlEO86kpMd0';
//   var shippingSheet = '1sN3aFKDTAjPJNNSHX2TssCY5S0mwcbmtJe4AyBAMtMY';

//   localStorage.setItem("mainSheetForProduct",mainSheetForProduct);
//   localStorage.setItem("roleSheet",roleSheet);
//   localStorage.setItem("shippingSheet",shippingSheet);
//   localStorage.setItem("datasetName",datasetName);


//   window.location = "/";


// })
// $("#data2020").click(function(){
//   var datasetName = 2020;

//   var mainSheetForProduct = '1DD-wAE56uwKK_7Q7rZ5zigPAiMXwoqHKpiyBa6XJLk8';
//   var roleSheet = '1PttgX_vfEPEWPzI2MFtSuWnPQi7ctzcs8QmnQOwxx74';
//   var shippingSheet = '1iSGH0EXjdFOeZYDxWcy98Gv3d9CkvlcrraUZuaTR5ZY';

//   localStorage.setItem("mainSheetForProduct",mainSheetForProduct);
//   localStorage.setItem("roleSheet",roleSheet);
//   localStorage.setItem("shippingSheet",shippingSheet);
//   localStorage.setItem("datasetName",datasetName);

//   window.location = "/";

// })

// $("#mila").click(function(){
//   var datasetName = "Mila";

//   var mainSheetForProduct = '1xI2dl-_PkgH5coBHJ7rEBEE9G51fq7y4S-kMtv7BoPk';
//   var roleSheet = '1PttgX_vfEPEWPzI2MFtSuWnPQi7ctzcs8QmnQOwxx74';
//   var shippingSheet = '1AZcm1UZ-HgH2g1-qT35Tfzj_5FVHNLBmC0dCMfZ4gt8';

//   localStorage.setItem("mainSheetForProduct",mainSheetForProduct);
//   localStorage.setItem("roleSheet",roleSheet);
//   localStorage.setItem("shippingSheet",shippingSheet);
//   localStorage.setItem("datasetName",datasetName);

//   window.location = "/";

// })
