class maze{
    constructor( width , height ){
        this.frg = document.createDocumentFragment();
        this.width = width;
        this.height = height;
        this.x = 20;
        this.y = 20;
    }
    init(){
        /**
         * @title [初始迷宫对象]
         * @this  {Element} box [迷宫盒子] 
         */
        this.box = document.getElementById('mazeBox');
        
    }
    createStep(){
        /**
         * @title   [创建迷宫格子]
         * @let     {Number} width  [迷宫格子宽度]
         * @let     {Number} height [迷宫格子高度]
         * @return  [Array] 
         */

        let [width , height] = [this.x , this.y];

        let step = document.createElement( 'div' );
            step.style.width = width + 'px';
            step.style.height = height + 'px';
            step.classList.add("true");
            step.classList.add("step");

        return [step , width , height];
    }
    cetetaMaze(){
        /**
         * @title [创建迷宫]
         * @param {Number}  x    [格子宽度用于计算X轴格子个数]
         * @param {Number}  y    [格子高度用于计算Y轴格子个数]
         * @param {Element} elm  [格子元素]
         ]
         */

        
        // 初始化文档片段
        this.frg = document.createDocumentFragment();
        this.frg.appendChild( this.createStep()[0] );
        
        this.box.appendChild( this.frg );
    }
    mazeData(){
        /**
         * @title [迷宫数据模型]
         * @let   {Number} xFor [X轴循环数]
         * @let   {Number} yFor [Y轴循环数]
         * @let   {Array}  data [数据模型]  
         */
        let [width , height] = [this.width , this.height];
        let [xFor , yFor] = [width / this.x  , height / this.y];
        let data = [];
        
    }
};

    
