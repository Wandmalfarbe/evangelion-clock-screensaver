"use strict";

function element(id) {
	return document.getElementById(id);
}

function setDigit(number, text) {
	element("clock-digit-" + number).children[0].textContent = text;
}

function setFixedTimeForDebug() {
	setDigit(1, 2);
	setDigit(2, 3);
	setDigit(3, 4);
	setDigit(4, 8);
	setDigit(5, 2);
	setDigit(6, 3);
}

function updateClock() {
	var date = new Date();

	var hoursInt = date.getHours();
	var minutesInt = date.getMinutes();
	var secondsInt = date.getSeconds();

	var hoursString = hoursInt + "";
	var minutesString = minutesInt + "";
	var secondsString = secondsInt + "";

	if (hoursInt < 10) {
		hoursString = "0" + hoursInt;
	}
	if (minutesString < 10) {
		minutesString = "0" + minutesString;
	}
	if (secondsString < 10) {
		secondsString = "0" + secondsString;
	}

	setDigit(1, hoursString.charAt(0));
	setDigit(2, hoursString.charAt(1));
	setDigit(3, minutesString.charAt(0));
	setDigit(4, minutesString.charAt(1));
	setDigit(5, secondsString.charAt(0));
	setDigit(6, secondsString.charAt(1));
}

setInterval(updateClock, 1000);
updateClock();

// setFixedTimeForDebug();
