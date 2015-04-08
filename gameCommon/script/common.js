
//Ganesh Jadhav 1444 ;-)

/*
*****List OF Callable Functions*****
ArrayGenerator.GetRandomArray
Log
GetElement
RemoveElement
*/


//*********************Random Array Generator*********************//
/* 
Place Call Only to ArrayGenerator.GetRandomArray(array, nums) 
array == "Array To Randomize"
num == "Number Of Elments To retrieve"
If nums not given nums = aaray.length
*/

var ArrayGenerator = new Object();
ArrayGenerator.random = 0;

ArrayGenerator.GenerateRandomNo = function (range, flag) {
     ArrayGenerator.random = Math.floor(Math.random() * range);
}

ArrayGenerator.GetRandomNo = function (range, flag) {
     ArrayGenerator.GenerateRandomNo(range, flag);
     return ArrayGenerator.random;
}

ArrayGenerator.GetRandomArray = function (array, nums) {
     if (!nums) nums = array.length;
     var navaarray = new Array();
     for (var i = 0; i < nums; i++) {
          var rand = ArrayGenerator.GetRandomNo(array.length);
          navaarray.push(array[rand]);
          array.splice(rand, 1);
     }
     return navaarray;
}
//*********************Random Array Generator*********************//

//*********************Log*********************//
Log = function (str) {
     console.log(str);
}
//*********************Log*********************//

//*********************GetElement To Reduce DOM access*********************//
/* 
DO NOT CALL remove() detach() functions because "THIS" function will return reference even if 
the object is removed from DOM
To Remove Element Form DOM call RemoveElement()

And works with single Identifier
*/
oElements = new Object();

GetElement = function(strElementId){
    if(oElements[strElementId]){
    }else{
        oElements[strElementId] = $("#" + strElementId);
    }
    return oElements[strElementId]; 
}