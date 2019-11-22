/**
 * @module mapView {Class} [地图视图]
 */

import mapView from '../mapView/mapView';

class A extends mapView{
    constructor(){
        super();
        /* 地图视图 */
        this.mapView = this.getInstance;
        /* 地图数据模型 */
        this.mapData = this.getInstance._mapData;
        /* A* 算法打开列表 */
        this.openList = [];
        /* A* 算法关闭列表 */
        this.closeList = [];
        /* 是否找到了终点 */
        this.isSearchEndGrid = true;
        /* 搜索结果路径数据模型 */
        this.resultPath = [];
    }
    init(){
        this.forPath();
    }
    /* 获取周围8个格子 */
    getSurroundGrid( currentGrid ){
        let [x , y] = [ currentGrid.indexX , currentGrid.indexY ];
        return [
            {indexX: x - 1 , indexY: y - 1},
            {indexX: x     , indexY: y - 1},
            {indexX: x + 1 , indexY: y - 1},
            {indexX: x + 1 , indexY: y    },
            {indexX: x + 1 , indexY: y + 1},
            {indexX: x     , indexY: y + 1},
            {indexX: x - 1 , indexY: y + 1},
            {indexX: x - 1 , indexY: y    }
        ]
    }
    /* 判断格子是否在列表中 */
    isListHave( grid , list ){
        for( let i in list ){
            let item = list[i];
            /* 如果坐标重叠表示在列表中 */
            if( grid.indexX === item.indexX && grid.indexY === item.indexY ){
                /* 返回下标 */
                return i;
            }
        }
        return false;
    }
    /* 开始搜寻路径 */
    forPath(){
        let [startGrid , endGrid] = [this.mapView.startGrid , this.mapView.endGrid];
        /* 将开始点压入打开列表 */
        this.openList.push({indexX: startGrid.indexX , indexY: startGrid.indexY , G: 0});
        let searchDarw = setInterval( () => {
            /* 获取当前格子 */
            let currentGrid = this.openList.shift();
            /* 把当前格子压入到关闭列表 */
            this.closeList.push( currentGrid );
            /* 绘制当前格子颜色并过滤起始点grid为空的情况 */
            if( 'grid' in currentGrid ){
                currentGrid.grid.fillCurrentGrid = true;
            }
            /* 寻找开始点周围的格子 */
            let surroundGrid = this.getSurroundGrid( currentGrid );
            /* 验证周围格子真实性 */
            for( let i=0; i<surroundGrid.length; i++ ){
                let item = surroundGrid[i];
                /* 依次判断周围格子是否在地图的数据模型上*/
                let grid,currentG;
                try {
                    grid = this.mapData[item.indexY][item.indexX];
                } catch (error) { 
                    // console.log( item )
                };
                /* 如果当前格子是有效格子  且   当前格子不是障碍物   且          当前格子不在关闭列表中          */
                if( grid !== undefined && grid.flag === false && !this.isListHave(grid , this.closeList) ){
                    /* 依次计算从开始点到周围点的代价 上下左右为10 斜角为14 */
                    currentG = currentGrid.G + ((currentGrid.indexX - item.indexX) * (currentGrid.indexY - item.indexY) === 0 ? 10 : 14);
                    /* 如果不在开启列表 */
                    if( this.isListHave( item , this.openList ) === false ){
                        /* 计算H 通过水平+垂直距离进行计算 */
                        item.H = Math.abs(endGrid.indexY - item.indexY) * 10 + Math.abs(endGrid.indexX - item.indexX) * 10;
                        /* 为item设置FGH值和父节点 */
                        item.G = currentG;
                        item.F = item.G + item.H;
                        item.parent = currentGrid;
                        item.grid = grid;
                        /* 将item压入打开列表 */
                        grid.fillSearchScope = true;
                        this.openList.push( item );
                    }else{
                        let index = this.isListHave( item , this.openList );
                        /* 判断当前节点是否更近 */
                        if( currentG < this.openList[index].G ){
                            /* 如果更近则替换 */
                            this.openList[index].parent = currentGrid;
                            this.openList[index].G = currentG;
                            this.openList[index].F = currentG + this.openList[index].H;
                            this.openList[index].grid = grid;
                        }
                    }
                }
            }
            /* 每次循环对打开列表排序把F值最小的格子放到一个位 方便取出 */
            this.openList.sort( (a,b) => {return a.F - b.F });
            /* 每次循环判断打开列表中是否存在结束点 */
            this.isSearchEndGrid = this.isListHave( endGrid , this.openList );
            /* 此时isSearchEndGrid为路径中点在开启列表中的下标 所以不会等于布尔值*/
            if( !this.isSearchEndGrid === false ){
                clearInterval( searchDarw );

                /* 如果找到终点 就从终点开始延parent向上依次遍历直到开始点 */
                let flag;
                /* 此时isSearchEndGrid为路径终点在开启列表中的下标 */
                let currentGrid = this.openList[ this.isSearchEndGrid ];
                let drawPathTimer = setInterval( () => {
                    /* 将路径节点延parent压入结果数组中 */
                    this.resultPath.unshift({
                        indexX: currentGrid.indexX,
                        indexY: currentGrid.indexY
                    });

                    currentGrid.grid.fillColor = true;  
                    currentGrid = currentGrid.parent;
                    /* 当前路径节点延parent返回直到开始节 */
                    flag = currentGrid.indexX === startGrid.indexX && currentGrid.indexY === startGrid.indexY;
                    /* 终止计时器 */
                    if( flag === true ){
                        clearInterval( drawPathTimer );
                    }

                } , 50);
            };

        } , 50)
        
    }
}

export default A;


/*
    AStart算法
    
    1. 从起点A开始, 把它作为待处理的方格存入一个"开启列表", 开启列表就是一个等待检查方格的列表.

    2. 寻找起点A周围可以到达的方格, 将它们放入"开启列表", 并设置它们的"父方格"为A.

    3. 从"开启列表"中删除起点 A, 并将起点 A 加入"关闭列表", "关闭列表"中存放的都是不需要再次检查的方格

    核心公式：

        F = G + H

    G 表示从起点 A 移动到网格上指定方格的移动耗费 (可沿斜方向移动).

    H 表示从指定的方格移动到终点 B 的预计耗费.

   

    

    a -> b -> c 是最短路径 b是路径中的一个节点
        
    b点的 H为20 G为10 F为30 同时b点是a节点四周8个方向之一 运用该公式可计算出 b点的F值为最低 

    假设 每次移动的代价为10 那么对角方向移动的代价就是14

    [
        [1,1,1,1,1]
        [1,1,1,1,1],
        [1,a,b,1,c],
        [1,1,1,1,1],
        [1,1,1,1,1]
    ]

    上述二维数组中 
        
        a为开始点 c为终点

        a放入关闭列表

        a周围8个有效节点放入开启列表
        
        从开启列表中选出一个F值最低的节点(b)进行如下处理

            把新节点(b)从开启列表删除并压入到关闭列表中

            检查新节点周围8个相邻节点( 不考虑在关闭列表中的节点和障碍物节点 )
            
            如果它们不再开启列表的话 就把它们压入开启列表 并计算出它们的 F G H 值 并且设置它们的父节点为 新节点(b)

            如果周围8个相邻节点中某一个节点已经在开启列表里了 就进行如下处理

                检查如果使用该节点 G 值是否更低 如果更低就把它的父节点 更改为 当前选中的新节点(b)

                    然后从新计算他的 F G 值 (H值不需要重新计算 因为H值是不变的)

                如果使用改节点 G 值会更高 那么表示该路径不是最优路径 那么我我们什么也不做
*/