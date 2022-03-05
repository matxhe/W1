// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Score{

    // teacher contract address
    address public teacher;

    constructor() {
        // Tempoary assign contract owner as teacher 1st.
        teacher = msg.sender;
    }

    // A mapping is a key/value map. Here we store each student scores.
    mapping(address => uint8) students;

    function getScore(address studentAddr) public view returns(uint8) {
       return students[studentAddr];
    }

    function appointTeacher(address teacherAddr) OnlyTeacher public {
        teacher = teacherAddr;
    }

    //仅有⽼师（⽤modifier权限控制）可以添加和修改学⽣分数
    modifier OnlyTeacher(){
        require(msg.sender == teacher, "Teacher Only!");
        _;
    }

    //分数不可以⼤于 100
    modifier CannotMoreThan100(address studentAddr){
         _;
        require(getScore(studentAddr) <= 100, "Cannot more than hundred!");
    }

    
    function updateScore(address studentAddr, uint8 points) OnlyTeacher CannotMoreThan100(studentAddr) public {
        students[studentAddr] = points;
    }
}

interface IScore{
    function updateScore(address studentAddr, uint8 points) external;
    function getScore(address studentAddr) external view returns(uint8);
}

contract Teacher{
    function updateStudentScore(address score, address studentAddr, uint8 points) public{
        IScore(score).updateScore(studentAddr, points);
    }

    function getStudentScore(address score, address studentAddr) view public returns (uint8) {
        return IScore(score).getScore(studentAddr);
    }
}