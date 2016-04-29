var fs = require('fs');
var util = require('util');
var _ = require('underscore');
var xlsx = require('node-xlsx');
var objArr = xlsx.parse('f:/data.xls');
var dataArrObj = {};
var jsonObj = {};
var property_1;
var property_2;
var handelObj = function(objInit){
    var obj = _.extend({"不限":{}},objInit);
    for(var i in obj){
        if(i == "不限") continue;
        if(_.isObject(obj[i])){
            obj[i] = _.extend({"不限":[]},obj[i]);
            for(var j in obj[i]){
                if(_.isArray(obj[i][j]) && j!="不限"){
                    obj[i][j].unshift("不限");
                }
            }
        }
    }
    return obj;
};
objArr.forEach(function(obj,index){
    if(obj.name == 'data'){
        dataArrObj = obj.data;
    }
});
dataArrObj.forEach(function(arr,index){
    if(index > 1){
        property_2 = arr[1];
        if(arr[0]){
            property_1 = arr[0];
            jsonObj[property_1] = {};
        }
        jsonObj[property_1][property_2] = arr.slice(2);
    }
});

fs.writeFile('data.json',JSON.stringify(handelObj(jsonObj)).replace(/\],/g,'],\r\n\t\t').replace(/\{/g,'{\r\n\t\t').replace(/\},/g,'\r\n\t},\r\n\t'),function(err){
    if (err) throw err;
    console.log('It\'s saved!'); //文件被保存
});