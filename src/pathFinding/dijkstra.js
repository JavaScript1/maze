/**
 * @module mapView {Class} [地图视图]
 * @module AStar  {Class} [A*算法]
 */

import mapView from '../mapView/mapView';
import AStar  from './A*';

class Diskstra extends mapView{
    constructor(){
        super();
        /* 权值队列 */
        this.priorityQueue = [];
        /* 访问过的节点 */
        this.seen = [];
        /* 地图视图 */
        this.mapView = this.getInstance;
        /* 地图数据模型 */
        this.mapData = this.getInstance._mapData;  
        /* 最终路径集合 */
        this.resultPath = []; 
        /* 父节点集合 */
        this.parent = [];
        /* 距离集合 */
        this.distance = [];
    }

    init(){
        
        /* 初始化 开始/结束点 */
        [ this.startGrid , this.endGrid ] = [ this.mapView.startGrid , this.mapView.endGrid ];

        /* 初始化队列 */
        let startGrid = { grid: this.startGrid , distance: 0};
        this.priorityQueue.push( startGrid );
        this.parent.push({ grid: this.startGrid , parent: false });
        this.distance.push( startGrid );

        /* 开始寻找路径 */
        this.forPath( this.mapData , this.endGrid );
    }
    /* 获取指定节点到开始点的距离 */
    getGridDistance( grid ){

        /* 暂未达到的距离设置为无限大 */
        let distance = Infinity;

        for( let item of this.distance ){
            if( item.grid === grid ){
                distance = item.distance;
            }
        }
        return distance;
    }
    /* 从parent获取指定节点 */
    getGridOfParent( grid ){
        for( let item of this.parent ){
            if( item.grid === grid ){
                return item;
            }
        }
    }
    /* 寻找路径 */
    forPath( mapData , endGrid ){

        /* 如果搜索队列中存在元素的话就不断循环 */
        let timer = setInterval( () => {
            /* 从头部获取一个新的节点 */
            let currentGrid = this.priorityQueue.shift(); 
            /* 获取当前元素距离开始点的距离 */
            let distance = currentGrid.distance;
            this.seen.push( currentGrid.grid );
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
                        /* 计算每一个点到当前点的距离 */
                        let step = (currentGrid.grid.indexX - grid.indexX) * (currentGrid.grid.indexY - grid.indexY) === 0 ? 10 : 14;
                            step += distance;
                        /* 如果当前点 + item点的距离 < item点到开始点的距离 */
                        if( step < this.getGridDistance(grid) ){
                            let itemGrid = { grid: grid , distance: step , parent: currentGrid };
                            this.parent.push( itemGrid );
                            this.distance.push( itemGrid );
                            this.priorityQueue.push( itemGrid );
                        }
                        /* 以权重值进行排序 */
                        this.priorityQueue.sort( (a,b) => { return a.distance - b.distance });
                        // debugger;
                    }else{
                        
                    }

                    /* 绘制搜索范围 */
                    grid.fillSearchScope = true;
                    
                    /* 如果找到终点 */
                    if( grid.indexY === endGrid.indexY && grid.indexX === endGrid.indexX ){

                        /* 从parent集合中找到当前元素 */
                        let parentGrid = this.getGridOfParent( currentGrid.grid );
                        
                        clearInterval( timer );
                        
                        let drawPathTimer = setInterval( () => {
                            
                            /* 当前路径节点延parent返回直到开始节 */
                            let flag = parentGrid.grid.indexX === this.startGrid.indexX && parentGrid.grid.indexY === this.startGrid.indexY;

                            /* 终止计时器 */
                            if( flag === true ){
                                clearInterval( drawPathTimer );
                            }

                            /* 将路径节点延parent压入结果数组中 */
                            this.resultPath.unshift({
                                indexX: grid.indexX,
                                indexY: grid.indexY
                            }); 
                            
                            parentGrid.grid.fillColor = true;  
                            parentGrid = parentGrid.parent;

                        } , 50);
                    }
                }
            }

            if( this.priorityQueue.length < 0 ){
                clearInterval( timer );
            }

        } , 50);
    }
}

export default Diskstra;