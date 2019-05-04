import '../scss/main.scss';
import $ from 'jquery';
import 'bootstrap';
import 'popper.js';

$(window).on('load', function () {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
        $('body').addClass('ios');
    } else {
        $('body').addClass('web');
    }

    $('body').removeClass('loaded');
});

$(function () {
    // $('.content').css('padding-top', $('header').css('height'));
});