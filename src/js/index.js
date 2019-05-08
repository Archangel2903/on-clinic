import '../scss/main.scss';
import $ from 'jquery';
import 'bootstrap';
import 'popper.js';
//Leaflet
import L from 'leaflet';
import 'leaflet/dist/images/marker-icon-2x.png';
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-shadow.png';

$(window).on('load', function () {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
        $('body').addClass('ios');
    } else {
        $('body').addClass('web');
    }

    $('body').removeClass('loaded');
});

$(window).on('load resize', function () {
    if (window.innerWidth <= 992) {
        $('.main-section').css('padding-top', $('header').innerHeight() + 110);
    } else {
        $('.main-section').css('padding-top', 210);
    }
});

$(function () {
    /****************************************************************************************/
    /* This code is needed to properly load the images in the Leaflet CSS */
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'img/marker-icon-2x.png',
        iconUrl: 'img/marker-icon.png',
        shadowUrl: 'img/marker-shadow.png',
    });
    const map = L.map('map');
    const defaultCenter = function () {
        if (window.innerWidth < 768) {
            return [43.262990, 76.931635];
        } else {
            return [43.244010, 76.967512];
        }
    };
    const defaultZoom = 13;
    const basemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}');
    let clinic1 = L.marker([43.23931, 76.94392]).addTo(map).bindPopup('г. Алматы, Проспект Абая, 20/14'),
        clinic2 = L.marker([43.22795, 76.9069]).addTo(map).bindPopup('г. Алматы, улица Габдуллина 94А угол Ауэзова'),
        clinic3 = L.marker([43.25944, 76.95952]).addTo(map).bindPopup('г. Алматы, улица Абдуллиных 30');

    map.setView(defaultCenter(), defaultZoom);
    basemap.addTo(map);
    /****************************************************************************************/
});