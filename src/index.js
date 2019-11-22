/**
 *@module mapView { class } [地图视图]
 *@module A       { class } [A*算法]
 **/

import mapView from './mapView/mapView';
import A from './pathFinding/A*';

/* 初始化地图视图 */
mapView.getInstance().init();
window.mapView = mapView.getInstance();
    






let btn = document.createElement('button');
    btn.innerHTML = 'Click Meeeeee';
    btn.addEventListener( 'click' , () => {
        new A().init();
    });
document.body.appendChild( btn );

