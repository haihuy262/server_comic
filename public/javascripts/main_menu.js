(function () {
	"use strict";

	var treeviewMenu = $('.app-menu');

	// Toggle Sidebar
	$('[data-toggle="sidebar"]').click(function(event) {
		event.preventDefault();
		$('.app').toggleClass('sidenav-toggled');
	});

	// Activate sidebar treeview toggle
	$("[data-toggle='treeview']").click(function(event) {
		event.preventDefault();
		if(!$(this).parent().hasClass('is-expanded')) {
			treeviewMenu.find("[data-toggle='treeview']").parent().removeClass('is-expanded');
		}
		$(this).parent().toggleClass('is-expanded');
	});

	// Set initial active toggle
	$("[data-toggle='treeview.'].is-expanded").parent().toggleClass('is-expanded');

	//Activate bootstrip tooltips
	$("[data-toggle='tooltip']").tooltip();

})();

//Thời Gian
function time() {
	var today = new Date();
	var weekday = new Array(7);
	weekday[0] = "Chủ Nhật";
	weekday[1] = "Thứ Hai";
	weekday[2] = "Thứ Ba";
	weekday[3] = "Thứ Tư";
	weekday[4] = "Thứ Năm";
	weekday[5] = "Thứ Sáu";
	weekday[6] = "Thứ Bảy";
	var day = weekday[today.getDay()];
	var dd = today.getDate();
	var mm = today.getMonth() + 1;
	var yyyy = today.getFullYear();
	// code check giờ mà tôi éo thích làm hơ hơ
	// var h = today.getHours();
	// var m = today.getMinutes();
	// var s = today.getSeconds();
	// m = checkTime(m);
	// s = checkTime(s);
	// nowTime = h + " giờ " + m + " phút " + s + " giây";
	if (dd < 10) {
	  dd = '0' + dd
	}
	if (mm < 10) {
	  mm = '0' + mm
	}
	today = day + ', ' + dd + '/' + mm + '/' + yyyy;
	tmp = '<span class="date"> ' + today + '</span>';
	// nếu muốn check cả giờ thì bỏ cmt là xong 
	// tmp = '<span class="date"> ' + today + ' - ' + nowTime + '</span>';
	document.getElementById("clock").innerHTML = tmp;
	clocktime = setTimeout("time()", "1000", "Javascript");

	function checkTime(i) {
	  if (i < 10) {
		i = "0" + i;
	  }
	  return i;
	}
  }