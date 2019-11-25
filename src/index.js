/**
 *@module mapView  { class } [地图视图]
 *@module AStar   { class } [A*算法]
 *@module dijkstra { class } [迪杰斯特拉算法]
 *@module BFS      { class } [广度优先遍历]
 *@module BFS      { class } [深度优先遍历]
 **/

import mapView  from './mapView/mapView';
import AStar   from './pathFinding/A*';
import dijkstra from './pathFinding/dijkstra';
import BFS      from './pathFinding/BFS';
import DFS      from './pathFinding/DFS';

/* 初始化地图视图 */
mapView.getInstance().init();
window.mapView = mapView.getInstance();
    

/* A*算法 */
let AStarBtn = document.createElement('button');
    AStarBtn.innerHTML = 'AStar';
    AStarBtn.addEventListener( 'click' , () => {
        new AStar().init();
    });

/* Dijkstra算法 */
let DijkstraBtn = document.createElement('button');
    DijkstraBtn.style.marginLeft = '10px';
    DijkstraBtn.innerHTML = 'Dijkstra';
    DijkstraBtn.addEventListener( 'click' , () => {
        new dijkstra().init();
    });

/* BFS算法 */
let BfsBtn = document.createElement('button');
    BfsBtn.style.marginLeft = '10px';
    BfsBtn.innerHTML = 'BFS';
    BfsBtn.addEventListener( 'click' , () => {
        new BFS().init();
    });

/* DFS算法 */
let DfsBtn = document.createElement('button');
    DfsBtn.style.marginLeft = '10px';
    DfsBtn.innerHTML = 'DFS';
    DfsBtn.addEventListener( 'click' , () => {
        new DFS().init();
    });

let div = document.createElement('div');

    div.style.width = '80%';
    div.style.margin = '0 auto';
    div.style.display = 'flex';
    div.style.justifyContent = 'flex-start';
    div.style.alignItems = 'center';

    div.appendChild( AStarBtn );
    div.appendChild( DijkstraBtn );
    div.appendChild( BfsBtn );
    div.appendChild( DfsBtn );

document.body.appendChild( div );

