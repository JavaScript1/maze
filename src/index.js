class maze {
    constructor(params) {
        /* 获取当前浏览器宽高 并设置为地图宽高 */
        this.mapWidth = window.innerWidth * 0.9;
        this.mapHeight = window.innerHeight * 0.8;
        /* 设置格子宽高 */
        this.gridWidth = 30;
        this.gridHeight = 30;
        /* 地图的数据模型 */
        this.mapData = [];
        /* 地图容器元素 */
        this.mapElement = {};
    }
    init(){
        this.createMap();
        this.createMapData();
        this.registerMouseEvent();
    }
    /* 注册鼠标事件 */
    registerMouseEvent(){
        this.mapElement.addEventListener( 'mousedown' , e => {
            this.mapElement.checked = true;
        });
        this.mapElement.addEventListener( 'mousemove' , e => {
            if( this.mapElement.checked === true ){
                e.target.flag = true;
            }
        });
        this.mapElement.addEventListener( 'mouseup' , e => {
            this.mapElement.checked = false;
        });
        this.mapElement.addEventListener( 'click' , e => {
            e.target.flag = true;
        });
        this.mapElement.addEventListener( 'dblclick' , e => {
            this.mapData.forEach( item => {
                item.forEach( grid => {
                    grid.flag = false;
                })
            })
        });
    }
    /* 创建地图数据模型*/
    createMapData(){
        /* 数据模型为二维数组 map高度为一维Length 宽度为二维Length */
        for( let y=0; y<this.mapHeight; y+=this.gridHeight ){
            let arr = [];
            for( let x=0; x<this.mapWidth; x+=this.gridWidth ){
                /* 创建格子元素 并传递坐标值 */
                let grid = this.createGrid( x  , y  );
                /* 将格子元素 压入地图容器中 */
                this.mapElement.appendChild( grid );
                /* 将格子元素封装成数据对象 并压入数组 */
                let gridDataObj = this.bindGridModel( grid );
                arr.push( gridDataObj );
            }
            this.mapData.push( arr );
        }
        /* 创建完成之后 将地图元素压入DOM */
        document.body.appendChild( this.mapElement );
    }
    /* 创建地图 */
    createMap(){
        /* 创建地图容器 SVG */
        let map = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            map.style.width = this.mapWidth + this.gridWidth;
            map.style.height = this.mapHeight + this.gridHeight;
            map.id = "mapBox";
            this.mapElement = map;
        return map; 
    }
    /* 创建格子 */
    createGrid( x , y ){
        /**
         * @param x {number} [当前格子的X坐标]
         * @param y {number} [当前格子的Y坐标]
         */
        let grid = document.createElementNS('http://www.w3.org/2000/svg','rect');
            grid.setAttribute('width' , this.gridWidth);
            grid.setAttribute('height' , this.gridHeight);
            grid.setAttribute('x' , x );
            grid.setAttribute('y' , y );
            grid.setAttribute('fill' , '#fff');
            grid.setAttribute('stroke' , '#000');
            grid.setAttribute('stroke-width' , '1');
            grid.setAttribute('stroke-opacity' , '0.3');
            grid.classList.add('grid');
        return grid;
    }
    /* 为格子元素绑定数据 */
    bindGridModel( grid ){
        Object.defineProperties( grid , {
            'flag': {
                get(){
                    return grid._flag
                },
                set( bool ){
                    grid._flag = bool;
                    if( bool === true ){
                        grid.setAttribute( 'fill' , '#808080' );
                    }else{
                        grid.setAttribute( 'fill' , '#fff' );
                    }
                }
            },
            'xx': {
                get(){
                    return grid.getAttribute('x');
                },
                set( val ){
                    this.grid.setAttribute('x' , val);
                }
            },
            'yy': {
                get(){
                    return grid.getAttribute('y');
                },
                set( val ){
                    this.grid.setAttribute('y' , val);
                }
            },
        });
        grid._flag = false;
        return grid;
    }
};

let mazeObj = new maze();
    mazeObj.init();
window.mazeObj = mazeObj;
