Game.Init = function () {
     Log("Game Init Called");
     $("div").show();
     GetElement("Screen2").hide();
     GetElement("PopUpScreen").hide();
     GetElement("StartBtn").html(Text["StartBtn"]).unbind('click').bind('click',Game.StartClick);
     GetElement("HowToPlyBtn").html(Text["HowToPlayBtn"]).unbind('click').bind('click',Game.HowToPlayClick);
     GetElement("CreditsBtn").html(Text["CreditsBtn"]).unbind('click').bind('click',Game.CreditsClick);
     GetElement("ClosePopupBtn").unbind('click').bind('click',Game.HidePopupScreen).html(Text['ClosePopupBtn']);
     
     GetElement("PauseContinue").html(Text["Restart"]).unbind('click').bind('click',Game.PauseContinue);
     GetElement("HowToPlyBtn2").html(Text["HowToPlayBtn"]).unbind('click').bind('click',function(){GetElement("HowToPlyBtn").trigger('click');});
     GetElement("CreditsBtn2").html(Text["CreditsBtn"]).unbind('click').bind('click',function(){GetElement("CreditsBtn").trigger('click');});
     
     GetElement("levelText").html(Text["levelText"]);
     GetElement("ScoreText").html(Text["ScoreText"]);
     GetElement("StartCounter").hide();
     GetElement("PauseContinue").hide();
}

Game.StartClick = function(){
    GetElement("Screen1").hide();
    GetElement("Screen2").show();
    GameEngine.GameStart();
}

Game.HowToPlayClick = function(){
    Game.ShowPopupScreen(Text["Instructions"]);
}

Game.CreditsClick = function(){
    Game.ShowPopupScreen(Text["Developer"]);
}

Game.PauseContinue = function(){
    GetElement("PauseContinue").hide();
    GameEngine.GameStart();
}

Game.ShowPopupScreen = function(strText){
    GetElement("PopupTextContainer").html(strText);
    GetElement("PopUpScreen").show();
}

Game.HidePopupScreen  = function(){
    GetElement("PopUpScreen").hide();
}

Game.UpdateScore = function(iScore){
    GetElement("ScoreNo").html(iScore);
}
Game.UpdateLevel = function(ilvel){
    GetElement("levelNo").html(ilvel);
}

Game.UpdateRemainingTimeCounter = function(iTime){
    if(iTime <11){
        GetElement("Time").css("color","red");
    }else{
        GetElement("Time").css("color","black");
    }
    GetElement("Time").html(iTime + " s");
}

var GameEngine = {
    level : undefined,
    score : undefined,
    ThisLevel : undefined,
    iLevelTime : 120,//seconds
    DukkarToShow : [undefined,108,144,180,210,240],//pass level number and it will return u the value
    GameStart : function(){ 
        GameEngine.level = 1;
        GameEngine.score = 0;
        Game.UpdateScore(GameEngine.score);
        Game.UpdateLevel(GameEngine.level);
        GameEngine.StartCounterAnimation(GameEngine.level);
        $("#Screen2").undelegate("#oGDukkar","click",GameEngine.DukkarTick).delegate("#oGDukkar","click",GameEngine.DukkarTick);
        $("#Screen2").undelegate("#oPot","click",GameEngine.oPotClick).delegate("#oPot","click",GameEngine.oPotClick);
        },
    StartCounterAnimation : function(iLevel){ //iLevel is required to pass to start level
        var iCount = 5;
        var iInterval = setInterval(function(){
            if(iCount) GetElement("CounterText").html(iCount);
            else GetElement("CounterText").html(Text["StartBtn"]);
            
            GetElement("StartCounter").fadeIn(200, function(){ setTimeout(function(){
                GetElement("StartCounter").fadeOut(200,function(){
                    iCount--;
                    if(iCount<0){
                        clearInterval(iInterval);
                        setTimeout(function(){GameEngine.StartLevel(iLevel);},250);
                    } 
                });},300);});
            
        } ,1000);
    },
    StartLevel : function(iLevel){
        Game.UpdateScore(GameEngine.score);
        if(GameEngine.ThisLevel){
            if(GameEngine.ThisLevel.hitCounter / GameEngine.DukkarToShow[iLevel - 1] < 2/3){
                Game.ShowPopupScreen(Text["Failed2by3text"]);
                GameEngine.GameStopped();
                return;
            }
        }
        GameEngine.ThisLevel = {
            hitCounter : 0,
            iTimeCounter : GameEngine.iLevelTime,
            bugsShown : 0
        };
        if(iLevel>5){GameEngine.GameStopped(); return;} 
        Game.UpdateLevel(GameEngine.level);
        Log("Level Started "+iLevel);
        //GetElement("PauseContinue").show();
        Game.UpdateRemainingTimeCounter(GameEngine.ThisLevel.iTimeCounter);
        var iRemainingTimeInverval = setInterval(function(){ 
            GameEngine.ThisLevel.iTimeCounter--;
            Game.UpdateRemainingTimeCounter(GameEngine.ThisLevel.iTimeCounter);
            if(!GameEngine.ThisLevel.iTimeCounter) clearInterval(iRemainingTimeInverval);
        },1000);
        
        var iDukkarsToShow = GameEngine.DukkarToShow[iLevel];
        var iCalculatedInterval = (GameEngine.iLevelTime/ iDukkarsToShow) * 1000;//Gives miliseconds
        //iCalculatedInterval = (120/240)*1000; 
        var iDukkarInterval = setInterval(function(){
            var iRandom = parseInt(Math.random() * 12 + 1);
            var bPlaceJackPot = Math.random()*14 < 1;
            if(iRandom > 12) iRandom = 5;
            GetElement("DukkarPinjara"+iRandom).html("<div id='oGDukkar' style='display : none;'>"+iLevel+"</div>");
            if(bPlaceJackPot){
                var iRandomJackpot = parseInt(Math.random()*6);
                if(iRandomJackpot<1 || iRandomJackpot>5){iRandomJackpot=5;}
                GetElement("luckpot"+iRandomJackpot).html("<div id='oPot' style='display : none;'>"+iLevel+"</div>");
            } 
            var iTimeOut1 = setTimeout(function(){ $("#oGDukkar").show(); $("#oPot").show(); GameEngine.ThisLevel.bugsShown++;},150);
            var iTimeOut2 = setTimeout(function(){ 
                $("#oGDukkar").remove(); 
                $("#oPot").remove(); 
                if(GameEngine.ThisLevel.bugsShown == iDukkarsToShow){
                    clearInterval(iDukkarInterval);
                    GameEngine.level++;
                    GameEngine.StartLevel(GameEngine.level);
                }
                },(iCalculatedInterval - 200)); 
        },iCalculatedInterval); 
    },
    DukkarTick : function(){
        GameEngine.score++;
        GameEngine.ThisLevel.hitCounter++;
    },
    oPotClick : function(){
        GameEngine.score += GameEngine.level *5;
    },
    GameStopped : function(){
        GetElement("PauseContinue").show();
    }
};
