var babyDimension = [
  [8,1.6,1],
  [9,2.3,2],
  [10,3.1,4],
  [11,4.1,7],
  [12,5.4,14],
  [13,7.4,23],
  [14,8.7,43],
  [15,10.1,70],
  [16,11.6,100],
  [17,13,140],
  [18,14.2,190],
  [19,15.3,240],
  [20,25.6,300],
  [21,26.7,360],
  [22,27.8,430],
  [23,28.9,500],
  [24,30,600],
  [25,34.6,660],
  [26,35.6,760],
  [27,36.6,875],
  [28,37.6,1.000],
  [29,38.6,1.100],
  [30,39.9,1.300],
  [31,41.1,1.500],
  [32,42.4,1.700],
  [33,43.7,1.900],
  [34,45,2.100],
  [35,46.2,2.400],
  [36,47.4,2.600],
  [37,48.6,2.900],
  [38,49.8,3.000],
  [39,50.7,3.300],
  [40,51.2,3.500],
  [41,51.5,3.600],
  [42,51.7,3.700]
]

var lastPeriodText = "02/14/2020";
var lastPeriod = new Date(lastPeriodText);
var today = new Date(); 
var diff = (today.getTime() - lastPeriod.getTime())/(1000 * 3600 * 24);
// console.log(lastPeriod);
// console.log(today);
var week = parseInt(diff/7);
var day = parseInt(diff%7);
// console.log(week+" "+day);
var beginWeight = 65.7;
var height = 160;

$("#lastPeriod").html("Chu kỳ cuối: "+lastPeriodText+ " mẹ nặng: "+beginWeight+" kg, cao:"+height+" cm");
$("#babyStatus").html("Em bé được:"+week+" tuần "+day+" ngày");
$("#babyDimension").html("Kích thước em bé:"+babyDimension[week-7][1]+" cm "+babyDimension[week-7][2]+" gram");

var link = "hellobacsi.com/kiem-tra-suc-khoe/cong-cu-tinh-can-nang-khi-mang-thai/?tool_name=Công+cụ+t%C3%ADnh+cân+nặng+khi+mang+thai&pwg_weight_before="+beginWeight+"&pwg_height="+height+"&pwg_week="+week;
$.ajax({
  // url: "http://cors-anywhere.herokuapp.com/"+link, //For local
  url: "https://cors-anywhere.herokuapp.com/"+link, //For code push
  type: 'GET',
  crossDomain: true,
  success: function(res) {
    // console.log(res)
    var data = $.parseHTML(res);  //<----try with $.parseHTML().
    $(data).find('div.pregnancy-weight-result').each(function(){
         // $('#here').append($(this).html());
         // console.log($(this).html())
      $(this).find('div.pregnancy-weight-result__data').each(function(){
        // $('#here').append($(this).html());
        // console.log($(this).html())
        $("#pregnantData").html($(this));
        $(".dropdown-week").change(function(){
          $("#pwg_dinamis_min").html($(this).children("option:selected").attr("data-min")+" kg")
          $("#pwg_dinamis_max").html($(this).children("option:selected").attr("data-max")+" kg")
          var chooseWeek = parseInt($(this).children("option:selected").attr("value"))
          $("#babyDimension").html("Kích thước em bé:"+babyDimension[chooseWeek-8][1]+" cm "+babyDimension[chooseWeek-8][2]+" gram");

        })
        // break;
      }); 

      $(this).find('div.pregnancy-weight-result__weight').each(function(){
         // $('#here').append($(this).html());
         // console.log($(this).html())
         $("#pregnantWeight").html($(this));
         $(".divider").html(" - ")
         // break;
      });   
    });
    // console.log(data);
  }
});

// %file:///Users/vanthanhle/Downloads/Công%20cụ%20t%C3%ADnh%20cân%20nặng%20khi%20mang%20thai%20•%20Hello%20Bacsi.htm/?tool_name=Công+cụ+t%C3%ADnh+cân+nặng+khi+mang+thai&pwg_weight_before=60.1&pwg_height=160&pwg_week=12
// https://hellobacsi.com/kiem-tra-suc-khoe/cong-cu-tinh-can-nang-khi-mang-thai/?tool_name=Công+cụ+t%C3%ADnh+cân+nặng+khi+mang+thai&pwg_weight_before=60.1&pwg_height=160&pwg_week=12
// http://hellobacsi.com/kiem-tra-suc-khoe/cong-cu-tinh-can-nang-khi-mang-thai/?tool_name=Công+cụ+t%C3%ADnh+cân+nặng+khi+mang+thai&pwg_weight_before=60.1&pwg_height=160&pwg_week=12


// var link = "hellobacsi.com/kiem-tra-suc-khoe/cong-cu-tinh-can-nang-khi-mang-thai/?tool_name=Công+cụ+t%C3%ADnh+cân+nặng+khi+mang+thai&pwg_weight_before=60.1&pwg_height=160&pwg_week=12";
// $.ajax({
//   url: "https://cors-anywhere.herokuapp.com/"+link,
//   type: 'GET',
//   success: function(res) {
//     // console.log(res)
//     var data = $.parseHTML(res);  //<----try with $.parseHTML().
    
//     // });
//     console.log(data);
//   }
// });
