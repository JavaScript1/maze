class mapView {
    constructor(params) {
        /* 获取当前浏览器宽高 并设置为地图宽高 */
        this.mapWidth = window.innerWidth * 0.9;
        this.mapHeight = window.innerHeight * 0.8;
        /* 设置格子宽高 */
        this.gridWidth = 30;
        this.gridHeight = 30;
        /* 地图的数据模型 */
        this._mapData = [];
        /* 地图容器元素 */
        this.mapElement = {};
        /* 判断当前起始点是否为移动状态 */
        this.startEndMoveFlag = false;
        /* 保存起始点元素 */
        this.startEndElement = {};
        /* 保存开始点格子 */
        this.startGrid = {};
        /* 保存结束点格子*/
        this.endGrid = {};
    }
    static getInstance(){
        if( mapView.instance === undefined ){
            mapView.instance = new mapView();
        }
        return mapView.instance;
    }
    get getInstance(){
        return mapView.getInstance();
    }
    get column(){
        return this._mapData.length;
    }
    get line(){
        return this._mapData[0].length;
    }
    init(){
        this.createMap();
        this.createMapData();
        this.registerMouseEvent();
        this.createStartEnd();
    }
    /* 注册鼠标事件 */
    registerMouseEvent(){
        this.mapElement.addEventListener( 'mousedown' , e => {
            this.mapElement.checked = true;
            /* 如果当前元素是起始点的话 表示起始点将要移动 取消所有鼠标移动逻辑 为起始点移动做准备*/
            if( e.target.startEnd === 'start' || e.target.startEnd === 'end' ){
                this.startEndMoveFlag = true;
                this.startEndElement = e.target;
            }
        });
        this.mapElement.addEventListener( 'mousemove' , e => {
            /* 如果当前是鼠标点击状态 */
            if( this.mapElement.checked === true && this.startEndMoveFlag === false ){
                /* 当前格子元素设置为障碍物 */
                e.target.flag = true;
            }; 
            /* 如果当前点击的是起始点 */
            if( this.startEndMoveFlag === true ){
                this.startEndMove( e.target );
            }
        });
        this.mapElement.addEventListener( 'mouseup' , e => {
            this.mapElement.checked = false;
            /* 每次点击事件结束都 重置起始点移动状态*/
            this.startEndMoveFlag = false;
        });
        this.mapElement.addEventListener( 'click' , e => {
            e.target.flag = !e.target.flag;
        });
        /* SVG 双击事件取消所有障碍物 */
        this.mapElement.addEventListener( 'dblclick' , e => {
            this._mapData.forEach( item => {
                item.forEach( grid => {
                    grid.flag = false;
                    grid.fillColor = false;
                })
            });
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
            this._mapData.push( arr );
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
            /* 为格子元素添加是否是开始结束点状态 */
            grid.startEnd = false;
            grid.classList.add('grid');
        return grid;
    }
    /* 为格子元素绑定数据 */
    bindGridModel( grid ){
        let self = this;
        Object.defineProperties( grid , {
            'flag': {
                get(){
                    return this._flag
                },
                set( bool ){
                    /* 如果当前格子是起始点则取消赋值 */
                    if( this.startEnd === 'start' || this.startEnd === 'end' ){
                        return ;
                    };
                    this._flag = bool;
                    if( bool === true ){
                        this.setAttribute( 'fill' , '#666' );
                    }else{
                        this.setAttribute( 'fill' , '#fff' );
                    }
                }
            },
            'fillSearchScope':{
                set( bool ){
                    if( this.startEnd === 'start' || this.startEnd === 'end' ){
                        return
                    }
                    if( bool === true ){
                        this.setAttribute( 'fill' , '#98fb98' );
                    }else{
                        this.setAttribute( 'fill' , '#fff' );
                    }
                }
            },
            'fillCurrentGrid':{
                set( bool ){
                    if( this.startEnd === 'start' || this.startEnd === 'end' ){
                        return
                    }
                    if( bool === true ){
                        this.setAttribute( 'fill' , 'yellow' );
                    }
                }
            },
            'fillColor':{
                set( bool ){
                    if( this.startEnd === 'start' || this.startEnd === 'end' ){
                        return
                    }
                    if( bool === true ){
                        this.setAttribute( 'fill' , '#2d78f4' );
                    }else{
                        this.setAttribute( 'fill' , '#fff' );
                    }
                }
            },
            'xx': {
                get(){
                    return Number(this.getAttribute('x'));
                },
                set( val ){
                    this.setAttribute('x' , val);
                }
            },
            'yy': {
                get(){
                    return Number(this.getAttribute('y'));
                },
                set( val ){
                    this.setAttribute('y' , val);
                }
            },
            'indexX': {
                get(){
                    return this.xx / self.gridWidth;
                }
            },
            'indexY': {
                get(){
                    return this.yy / self.gridHeight;
                }
            },
            'startEnd': {
                get(){
                    return this._startEnd;
                },
                set( type ){
                    this._startEnd = type;
                    if( type === 'start' ){
                        this.setAttribute( 'fill' , '#00dd00' );
                    };
                    if( type === 'end' ){
                        this.setAttribute( 'fill' , '#ee4400' );
                    };
                    if( type === false ){
                        this.setAttribute( 'fill' , '#fff' );
                    }
                }
            }
        });
        grid._flag = false;
        return grid;
    }
    /* 创建起始点 */
    createStartEnd(){
        let startX = parseInt( Math.random() * this._mapData[0].length + 0 );
        let startY = parseInt( Math.random() * this._mapData.length + 0 );
        this._mapData[startY][startX].startEnd = 'start';
        this.startGrid = this._mapData[startY][startX];
        
        let endX = parseInt( Math.random() * this._mapData[0].length + 0 );
        let endY = parseInt( Math.random() * this._mapData.length + 0 );
        this._mapData[endY][endX].startEnd = 'end';
        this.endGrid = this._mapData[endY][endX];
    }
    /* 起始点移动逻辑 */
    startEndMove( target ){
        /* 如果路过开始点或者结束点 则停止赋值 */
        if( target.startEnd === 'start' || target.startEnd === 'end' ){
            return 
        }
        /* 同当前元素 不断替换起始点元素 并清空历史起始点元素的状态 */
        let type = this.startEndElement.startEnd;
        this.startEndElement.startEnd = false;
        target.startEnd = type;
        this.startEndElement = target;
        /* 把修改后的起始点坐标 赋值到this中 */
        if( type === 'start' ){
            this.startGrid = target;
        };
        if( type === 'end' ){
            this.endGrid = target;
        };
    }
};

export default mapView;