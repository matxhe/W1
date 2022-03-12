# 欧科定向培训作业

# W3作业：

## Introduction

用ReactJs + esthers.Js 简单实现ERC20，ERC721与用户互动（授权，转帐，铸币，提现）作用

演示：https://matxhe.github.io/homework/

截图：
## ERC20

![Screenshot](https://github.com/matxhe/homework/blob/main/W3/ERC20%20Dapp%20screen.png)
![Screenshot](https://github.com/matxhe/homework/blob/main/W3/ERC20%20Dapp%20Approve%20screen.png)
![Screenshot](https://github.com/matxhe/homework/blob/main/W3/ERC20%20Dapp%20Deposit%20screen.png)
![Screenshot](https://github.com/matxhe/homework/blob/main/W3/ERC20%20Withdraw%20screen.png)
![Screenshot](https://github.com/matxhe/homework/blob/main/W3/ERC20%20Withdraw%20succeed%20screen.png)

## ERC721
![Screenshot](https://github.com/matxhe/homework/blob/main/W3/ERC721%20Transfer%20event.png)


# W2_1作业：

* 编写⼀个Bank合约：

Contract Address: 0xfeA7AB8b96E68b87892cE60E74919a909A3c73a7

* 通过 Metamask 向Bank合约转账ETH

Trx HASH: 0xad6e50c3bf24010ee0d6829b1402703545051eb05b4262fffd25a188e9a90b3a


* 在Bank合约记录每个地址转账⾦额
* 编写 Bank合约withdraw(), 实现提取出所有的 ETH

Trx HASH:0xad6e50c3bf24010ee0d6829b1402703545051eb05b4262fffd25a188e9a90b3a


https://ropsten.etherscan.io/tx/0xad6e50c3bf24010ee0d6829b1402703545051eb05b4262fffd25a188e9a90b3a

https://ropsten.etherscan.io/address/0x2970d5d97afe69ef727bb200b24edea26decbb25


# W2_2作业
* 编写合约Score，⽤于记录学⽣（地址）分数：

   * 仅有⽼师（⽤modifier权限控制）可以添加和修改学⽣分数

    modifier OnlyTeacher(){
    require(msg.sender == teacher, "Teacher Only!");
    _;
    }

   * 分数不可以⼤于 100；

   modifier CannotMoreThan100(address studentAddr){
         _;
        require(getScore(studentAddr) <= 100, "Cannot more than hundred!");
    } 
    
* 编写合约 Teacher 作为⽼师，通过 IScore 接⼝调⽤修改学⽣分数。

    function updateStudentScore(address score, address studentAddr, uint8 points) public{
        IScore(score).updateScore(studentAddr, points);
    }
