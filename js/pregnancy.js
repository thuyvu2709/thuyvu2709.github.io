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
  [28,37.6,1000],
  [29,38.6,1100],
  [30,39.9,1300],
  [31,41.1,1500],
  [32,42.4,1700],
  [33,43.7,1900],
  [34,45,2100],
  [35,46.2,2400],
  [36,47.4,2600],
  [37,48.6,2900],
  [38,49.8,3000],
  [39,50.7,3300],
  [40,51.2,3500],
  [41,51.5,3600],
  [42,51.7,3700]
]

var babyDescription = [
  "Tuần 12<br/>Tuần này phản xạ của bé bắt đầu tốt lên: ngón tay của bé sẽ sớm bắt đầu biết mở và đóng, ngón chân sẽ biết bẻ cong. Bé sẽ cảm nhận được nếu mẹ nhẹ nhàng chọc vào bụng - mặc dù mẹ vẫn sẽ không cảm thấy động tác của con.<br/>Em bé của bạn có kích thước bằng một quả chanh",
  "Tuần 13<br/>Đây là tuần cuối cùng của tam cá nguyệt đầu tiên. Ngón tay bé nhỏ của em bé bây giờ đã có dấu vân tay, tĩnh mạch và nội tạng của em bé có thể thấy rõ qua làn da. Nếu mẹ mang thai bé gái, buồng trứng của em bé cũng đã chứa nhiều hơn 2 triệu trứng.<br/>Em bé của bạn có kích thước bằng một trái đào nhỏ",
  "Tuần 14<br/>Xung não của bé đã bắt đầu hoạt động, bé biết cử động các cơ trên khuôn mặt, thận cũng bắt đầu làm việc. Nếu siêu âm, mẹ thậm chí có thể thấy con đang mút ngón tay cái.<br/>Em bé bây giờ có kích thước bằng một quả chanh.",
  "Tuần 15<br/>Mí mắt của bé vẫn đóng nhưng có thể cảm nhận được ánh sáng. Nếu mẹ bật đèn pin soi vào bụng, bé sẽ di chuyển tránh khỏi chùm sáng ấy. Siêu âm vào thời điểm này có thể cho thấy rõ ràng giới tính của bé.<br/>Em bé bây giờ có kích thước bằng một quả táo.",
  "Tuần 16<br/>Các mảng tóc trên da đầu của bé bắt đầu mọc, đôi chân phát triển hơn và nếu cảm nhận kỹ, mẹ còn có thể thấy bé đang có những cú đạp. Đầu của bé thẳng hơn và đôi tai đang dần dịch chuyển về gần với vị trí cuối cùng.<br/>Em bé bây giờ có kích thước bằng một quả bơ.",
  "Tuần 17<br/>Em bé có thể di chuyển các khớp và bộ xương - sụn trước đây mềm thì bây giờ đã cứng cáp hơn. Dây rốn phát triển mạnh mẽ hơn và dày hơn.<br/>Em bé  có kích thước bằng một củ cải.",
  "Tuần 18<br/>Em bé đang chứng tỏ sức mạnh cánh tay và chân của mình. Mẹ có thể cảm thấy những cử động của con rất rõ rêt.<br/>Em bé có kích thước bằng một quả ớt chuông.",
  "Tuần 19<br/>Các giác quan của bé như ngửi, nhìn, sờ, nếm và nghe đang được phát triển. Bé có thể nghe thấy giọng nói của mẹ. Hãy nói chuyện, hát cho bé nghe nhé.<br/>Em bé có kích thước bằng một quả cà chua cỡ đại.",
  "Tuần 20<br/>Em bé đã có thể nuốt và hệ tiêu hóa bắt đầu sản xuất phân su.<br/>Em bé có kích thước bằng một quả chuối.",
  "Tuần 21<br/>Cử động của em bé đã chuyển từ rung động nhỏ thành những cú đá mạnh chọc vào thành tử cung. Mẹ bắt đầu quen thuộc hơn với các vận động của con trong bụng.<br/>Em bé có kích thước bằng một củ cà rốt.",
  "Tuần 22<br/>Em bé bây giờ trông giống như một trẻ sơ sinh thu nhỏ. Các đặc điểm như môi và lông mày rõ ràng hơn.<br/>Em bé có kích thước bằng một quả bí con.",
  "Tuần 23<br/>Tai của bé chọn lọc âm thanh ngày càng tốt hơn. Sau khi sinh, bé có thể nhận ra một số tiếng động mà bé từng nghe thấy bên trong bụng mẹ. Hãy tích cực nói chuyện và cho bé nghe nhạc trong tuần này.<br/>Em bé có kích thước bằng một quả xoài lớn.",
  "Tuần 24<br/>Da em bé vẫn còn mỏng và mờ, nhưng điều đó sẽ bắt đầu thay đổi từ tuần này.<br/>Em bé có kích thước bằng một bắp ngô.",  
  "Tuần 25<br/>Làn da nhăn nheo của bé bắt đầu căng dần lên nhờ chất béo. Tóc cũng bắt đầu mọc dài và có màu sắc, kết cấu.<br/>Em bé bây giờ có kích thước bằng một cù cải Thuỵ Điển.",
  "Tuần 26<br/>Bé đang hít vào và thở ra nước ối, giúp phát triển phổi. Những động tác thở là thực hành tốt cho hơi thở đầu tiên ngoài không khí sau khi sinh.<br/>Em bé có kích thước bằng một cây hành lá.",
  "Tuần 27<br/>Đây là tuần cuối cùng của tam cá nguyệt thứ hai. Lúc này bé ngủ và thức dậy theo một lịch trình khá ổn định, não cũng phát triển rất tích cực, phổi tuy chưa được hình thành đầy đủ, nhưng họ có thể hoạt động bên ngoài dạ con với sự giúp đỡ của các phương pháp y tế.<br/>Em bé có kích thước bằng một cái súp lơ.",
  "Tuần 28<br/>Thị lực của bé đang phát triển, cho phép thai nhi cảm nhận luồng ánh sáng từ bên ngoài. Bé có thể chớp mắt, và lông mi bắt đầu mọc.<br/>Em bé có kích thước bằng một trái cà tím<br/>",
  "Tuần 29<br/>Cơ bắp và phổi của bé đang bận rộn với việc chuẩn bị sẵn sàng để hoạt động ở thế giới bên ngoài. Đầu của bé cũng ngày một to để chuẩn bị diện tích cho trí não phát triển.<br/>Em bé có kích thước bằng một quả bí đỏ nhỏ<br/>",
  "Tuần 30<br/>Em bé được bao quanh bởi lượng nước ối lớn và tử cung ngày càng rộng mở để bé có thêm không gian “vùng vẫy”.<br/>Em bé có kích thước bằng một cái bắp cải<br/>",
  "Tuần 31<br/>Hiện tại em bé có thể quay đầu từ bên này sang bên kia. Một lớp chất béo bảo vệ được hình thành dưới da, tay và chân<br/>Em bé có kích thước bằng một quả dừa.<br/>",
  "Tuần 32<br/>Một số em bé đã rục rịch muốn “chui ra” bắt đầu từ tuần này. Tuy nhiên, tốt nhất, bé vẫn nên còn tận 7 tuần bên trong tử cung mẹ để có thể tăng thêm 1/3 trọng lượng của mình.<br/>Em bé có kích thước bằng một củ đậu lớn.<br/>",
  "Tuần 33<br/>Xương sọ của bé không hợp nhất. Điều này cho phép chúng thay đổi vị trí khi bé chui qua ống sinh.<br/>Em bé có kích thước bằng một quả dứa.<br/>",
  "Tuần 34<br/>Hệ thần kinh trung ương của bé đang trưởng thành, lá phổi cũng vậy. Trẻ sinh ra giữa khoảng tuần 34 và 37 không phải chịu nhiều vấn đề sức khỏe sinh non nữa.<br/>Em bé có kích thước bằng một quả dưa lê.<br/>",
  "Tuần 35<br/>Thận của bé đã phát triển đầy đủ và gan có thể xử lý một số sản phẩm chất thải.<br/>Em bé có kích thước bằng một quả dưa gang nhỏ.<br/>",
  "Tuần 36<br/>Em bé đã có mức cân nặng ổn định và an toàn.<br/>Em bé có kích thước bằng một cây rau xà lách lớn.<br/>",
  "Tuần 37<br/>Ngày dự sinh của bạn đang đến rất gần, mặc dù em bé đã trông giống như một trẻ sơ sinh, nhưng không phải là hoàn toàn sẵn sàng cho thế giới bên ngoài. Trong hai tuần tới phổi và não của bé sẽ hoàn toàn trưởng thành.<br/>Em bé có kích thước bằng một cây củ cải Thụy Sỹ.<br/>",
  "Tuần 38<br/>Bạn có tò mò về màu mắt của bé? Màu mắt lúc này tuy đã có thể nhìn rõ nhưng không phải là cố định bởi sự thay đổi sắc tố.<br/>Em bé có kích thước bằng một cây tỏi tây.<br/>",
  "Tuần 39<br/>Về cơ bản sự phát triển thể chất của bé đã hoàn chỉnh nhưng bé vẫn còn cần học cách điều chỉnh nhiệt độ cơ thể của mình khi ra thế giới bên ngoài.<br/>Em bé có kích thước bằng một quả dưa hấu nhỏ.<br/>",
  "Tuần 40<br/>Bạn đang trong những ngày cuối cùng của thai kỳ và hãy sẵn sàng nhất cho việc chuyển dạ có thể xảy ra bất cứ lúc nào."
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
$("#description").html(babyDescription[week-11]);
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
          $("#description").html(babyDescription[chooseWeek-12]);

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


