
var arr = [
    {name:"不限"},
    {
        name : "技术",
        code: "01",
        val:[
            {name:"不限"},
            {
                name: "后端开发",
                code: "011",
                val:[
                    {name:"不限"},
                    {name:"c",code:"0111"},
                    {name:"c++",code:"0112"},
                    {name:"c#",code:"0113"}
                ]
            },
            {
                name: "后端开发2",
                code: "011",
                val:[
                    {name:"c",code:"0111"},
                    {name:"c++",code:"0112"},
                    {name:"c#",code:"0113"}
                ]
            }
        ]
    },
    {
        name : "技术",
        code: "01",
        val:[
            {
                name: "后端开发",
                code: "011",
                val:[
                    {name:"c",code:"0111"},
                    {name:"c++",code:"0112"},
                    {name:"c#",code:"0113"}
                ]
            },
            {
                name: "后端开发2",
                code: "011",
                val:[
                    {name:"c",code:"0111"},
                    {name:"c++",code:"0112"},
                    {name:"c#",code:"0113"}
                ]
            }
        ]
    }
    ];

var fs = require('fs');
var util = require('util');
var _ = require('underscore');
var xlsx = require('node-xlsx');
var objArr = xlsx.parse('f:/data.xls');
var dataArr = {};
objArr.forEach(function(obj){
    if(obj.name == 'data'){
        dataArr = obj.data.slice(2);
    }
});
function addLimit(jsonData,deep){
    var noLimitObj = {"name":"不限"};
    var count = 0;
    deep = deep || 2;
    var deepLimit = function(tempData){
        if(_.isArray(tempData)){
            tempData.unshift(noLimitObj);
            tempData.forEach(function(data){
                deepLimit(data);
            });
        }else if(_.isObject(tempData)){
            if(count <= deep){
                for(var i in tempData){
                    deepLimit(tempData[i]);
                }
                count++;
            }else{
                count = 0;
            }
        }
    };
    deepLimit(jsonData);
    return jsonData;
}
function  templateDataArr(){
    var jsonArr = [];
    var rowArr,link_1,link_2,currentIndex=-1;
    for(var i=0,len = dataArr.length; i<len; i++){
        var obj_1 = {};
        var obj_2 = {};
        var arr_2 = [];
        var arr_3 = [];
        rowArr = dataArr[i];
        if(rowArr[0]){
            link_1 = rowArr[0];
            obj_1.name = link_1;
            obj_1.code = (currentIndex+2) < 10 ? '0'+ (currentIndex+2) : currentIndex+2;
            obj_1.val = arr_2;
            currentIndex++;
        }else{
            obj_1 = jsonArr[currentIndex];
            arr_2 = obj_1.val;
        }
        link_2 = rowArr[1];
        obj_2.name = link_2;
        obj_2.code = obj_1.code + (i+1);
        obj_2.val = arr_3;
        arr_2.push(obj_2);
        for(var j =2,leng = dataArr[i].length; j<leng; j++){
            var obj_3 = {};
            obj_3.name = dataArr[i][j];
            obj_3.code =  obj_2.code + (j-1);
            arr_3.push(obj_3);
        }
        if(rowArr[0]) jsonArr.push(obj_1);
    }
    return jsonArr;
}
/*
fs.writeFile('data.json',JSON.stringify(addLimit(templateDataArr())),function(err){
    if (err) throw err;
    console.log('It\'s saved!'); //文件被保存
});*/
fs.writeFile('data-no-limit.json',JSON.stringify(templateDataArr()),function(err){
    if (err) throw err;
    console.log('It\'s saved!'); //文件被保存
});