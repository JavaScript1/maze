##深度优先遍历思想

```
    类似于把多位数组打散成一维数组的一种过程
    
    按照树形结构进行一层一层的打散

    比如在第二层有三个数组 ABC 它们各包含 3 个数组（A1 A2 A3 . B1 B2 B3 . C1 C2 C3）

    子数组又包含三个数组( A11 A22 A33 B11 B22 B33 C11 C22 C33)

    那么在打散到第二层的时候 进行如下操作

    打散成 

        A B C

        A1 A2 A3 B C
        
        A11 A22 A33 B C

        A11 A22 A33 B1 B2 B3 C

        A11 A22 A33 B11 B22 B33 C

        A11 A22 A33 B11 B22 B33 C1 C2 C3

        A11 A22 A33 B11 B22 B33 C11 C22 C33 ...

    以次类推 这种以层级优先打散的过程就是 DFS 

```

```

    在代码中可以用一个栈结构在辅助完成

    let root = 多纬数组;

    let stack = [];

    stack.push( root );
        
    第一层

        let currentNode = stack.pop();

        if( currentNode === 集合 )

        stack.push( ...currentNode );

    第二层

        let currentNode = stack.pop();

        if( currentNode === 集合 )

        stack.push( ...currentNode );
    
    ...

    这种循环结构就像 一个不断加工的工厂 不断的从栈结构尾部取出 打散再放入 ...

    而且你每次取出的肯定是当前子级 待打散的集合

    等全部打散完毕 这样的过程就是广度优先

```