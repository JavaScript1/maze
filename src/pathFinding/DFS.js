/**
 * @module mapView {Class} [地图视图]
 * @module AStar   {Class} [A*算法]
 */

import mapView from '../mapView/mapView';
import AStar  from './A*';

class DFS extends mapView{
    constructor(){
        super();
        /* 深度优先遍历栈结构 */
        this.mapStack = [];
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
        this.mapStack.push({ grid: this.startGrid , parent: false , step: false });
        this.seen.push( this.startGrid );
        /* 开始寻找路径 */
        this.forPath( this.mapData , this.endGrid );
    }

    /* 寻找路径 */
    forPath( mapData , endGrid ){
        
        /* 如果搜索队列中存在元素的话就不断循环 */
        let timer = setInterval( () => {
            /* 从尾部获取一个新的节点 */
            let currentGrid = this.mapStack.pop(); 
            
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
                    /* 如果当前节点是没有搜索过的话就把当前节点放入 seen mapStack 队列 */
                    let isSeen = this.seen.includes( grid );
                    if( isSeen === false ){ 
                        /* 计算出距离终点的距离 */
                        let step = Math.abs(endGrid.indexY - grid.indexY) * 10 + Math.abs(endGrid.indexX - grid.indexX) * 10;
                        this.mapStack.push({ grid: grid , parent: currentGrid , step: step });
                        this.seen.push( grid );
                    }
                    /* 绘制搜索范围 */
                    grid.fillSearchScope = true;

                    /* 以权重值进行排序 */
                    this.mapStack.sort( (a,b) => { return b.step - a.step });

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

                if( this.mapStack.length < 0 ){
                    clearInterval( timer );
                }
            }
        } , 50);
        
    }
}

export default DFS;