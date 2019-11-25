##广度优先遍历思想

```
    
    类似于把多位数组打散成一维数组的一种过程
    
    按照树形结构进行一层一层的打散

    比如在第二层有三个数组 ABC 它们各包含 3 个数组（A1 A2 A3 . B1 B2 B3 . C1 C2 C3）

    那么在打散到第二层的时候 进行如下操作

    打散成 

        A B C

        A1 A2 A3 B C
        
        A1 A2 A3 B1 B2 B3 C

        A1 A2 A3 B1 B2 B3 C1 C2 C3 ... 

    以次类推 这种以层级优先打散的过程就是 BFS 

```


```
    在代码中可以用一个队列结构在辅助完成

    let root = 多纬数组;

    let queue = [];

        queue.push( root );

    第一层

        let currentNode = queue.shift();

        if( currentNode === 集合 )

        queue.push( ...currentNode );

    第二层

        let currentNode = queue.shift();
        
        if( currentNode === 集合 )

        queue.push( ...currentNode );

    ...

    这种循环结构就像 一个不断加工的工厂 把一个材料从尾部放入 从头部取出 再从尾部放入 ...

    而且你每次取出的肯定是当前层级 待打散的集合

    等全部打散完毕 这样的过程就是广度优先

```