/**
 * @module mapView {Class} [地图视图]
 * @module AStar   {Class} [A*算法]
 */

import mapView from '../mapView/mapView';
import AStar  from './A*';

class BFS extends mapView{
    constructor(){
        super();
        /* 广度优先遍历队列结构 */
        this.priorityQueue = [];
        /* 访问过的节点 */
        this.seen = [];
        /* 地图视图 */
        this.mapView = this.getInstance;
        /* 地图数据模型 */
        this.mapData = this.getInstance._mapData;  
        /* 最终路径集合 */
        this.resultPath = [];
    }

    init(){
        
        /* 初始化 开始/结束点 */
        [ this.startGrid , this.endGrid ] = [ this.mapView.startGrid , this.mapView.endGrid ];

        /* 初始化队列 */
        this.priorityQueue.push({ grid: this.startGrid , parent: false , step : 0 });
        this.seen.push( this.startGrid );
        
        /* 开始寻找路径 */
        this.forPath( this.mapData , this.endGrid );
    }

    /* 寻找路径 */
    forPath( mapData , endGrid ){

        /* 如果搜索队列中存在元素的话就不断循环 */
        let timer = setInterval( () => {
            /* 从头部获取一个新的节点 */
            let currentGrid = this.priorityQueue.shift(); 

            /* 通过新节点获取周围8个方向的节点 */
            let surroundGrid;
            try {
                surroundGrid = new AStar().getSurroundGrid.call( this , currentGrid.grid );
            } catch (error) { };

            /* 遍历获取到的新节点进行判断 */
            for( let i in surroundGrid ){

                let item = surroundGrid[ i ];
                let grid;
                try {
                    grid = mapData[ item.indexY ][ item.indexX ];
                } catch (error) { };
                
                /* 如果是有效格子的话 */
                if( grid !== undefined && grid.flag === false ){
                    /* 如果当前节点是没有搜索过的话就把当前节点放入 seen priorityQueue 队列 */
                    let isSeen = this.seen.includes( grid );
                    if( isSeen === false ){
                        /* 依次计算从开始点到周围点的代价 上下左右为10 斜角为14 */
                        let step = (currentGrid.grid.indexX - grid.indexX) * (currentGrid.grid.indexY - grid.indexY) === 0 ? 10 : 14;
                        this.priorityQueue.push({ grid: grid , parent: currentGrid , step: step });
                        this.seen.push( grid );
                    }
                    /* 以权重值进行排序 */
                    this.priorityQueue.sort( (a,b) => { return a.step - b.step });
                    /* 绘制搜索范围 */
                    grid.fillSearchScope = true;
                    
                    /* 如果找到终点 */
                    if( grid.indexY === endGrid.indexY && grid.indexX === endGrid.indexX ){
                        clearInterval( timer );
                        
                        let drawPathTimer = setInterval( () => {

                            /* 当前路径节点延parent返回直到开始节 */
                            let flag = currentGrid.grid.indexX === this.startGrid.indexX && currentGrid.grid.indexY === this.startGrid.indexY;

                            /* 终止计时器 */
                            if( flag === true ){
                                clearInterval( drawPathTimer );
                            }

                            /* 将路径节点延parent压入结果数组中 */
                            this.resultPath.unshift({
                                indexX: grid.indexX,
                                indexY: grid.indexY
                            });
                            
                            currentGrid.grid.fillColor = true;  
                            currentGrid = currentGrid.parent;

                        } , 50);
                    }
                }
            }

            if( this.priorityQueue.length < 0 ){
                clearInterval( timer );
            }

        } , 500);
    }
}

export default BFS;