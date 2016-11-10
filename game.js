
//This document contains the javascript that controls the logic of the game

var areaClicked = 0; //Variable determins if a peg is newly clicked or if 2nd time being clicked
var x,y;
var PreviousPegType;
var PegPosition = new Array();//Will contain the positions of the pegs on the board
var numButtons= 49-16-1;   //Num of all buttons(including invisible corners(a.k.a pegs))

//function that is used when the user selects a peg
function MouseClick(obj,i,j)
{
  var statusP=(PegPosition[i])[j]; //1 if empty space is clicked, 2 is a peg is clicked
  if(areaClicked==1)//if the user is making his second selection 
  {
    if(statusP==2)	//and if a peg has already been selected
	{
	  PreviousPegType.className="peg"; //resets values, so a selected peg wil lturn back
	  areaClicked=0;					// to a normal peg picture
	}
	else
	{ // or if empty is pegSelected
	  if(((Math.abs(i-x) == 2  && Math.abs(j-y) == 0)) ||
	     ((Math.abs(i-x) == 0  && Math.abs(j-y) == 2)) )
	  {
	    if((PegPosition[(x+i)/2])[(y+j)/2]==2)
		{
	      (PegPosition[i])[j]=2;
	      (PegPosition[x])[y]=1;
	      (PegPosition[(x+i)/2])[(y+j)/2]=1;
		  Repaint();
		  if(--numButtons==1)				//if numButtons is 1 then the game has been completed
          {
		    playSound("media/complete.wav");					//congrats the player
            alert("Congratulations, you completed the game!");
		  }
		  else
		  { // tests if player can still make more moves
		    var CanMove=false;
		    for(var i=0;i<7 && ! CanMove;++i)
			{
			  for(var j=0;j<7;++j)
			  {
			    if((PegPosition[i])[j]==2 && (((i != 6 && PegPosition[i+1])[j]==2) ||(j != 6 && ((PegPosition[i])[j+1]==2))))
				{
				  CanMove=true;
				  break;
				}
			  }
			}
			if ( ! CanMove)		//if there are no mroe moves then inform player
			{
              playSound("media/nomoves.wav");
			  alert("No more moves! - " + numButtons + "  pegs left!")
		    }
			else
	          playSound("media/move.wav");	//else play the move sound
		  }
		  return;
		}
      }
      playSound("media/invalid.wav");	//else play the invalid move sound
	}
  }
  if(statusP==2 && areaClicked==0) //if a peg has been clicked, and its the first time user has clicked
  {
    playSound("media/click.wav"); //then play sound of peg being clicked 
    PreviousPegType=obj;		  
	obj.className="pegSelected"	//change picture of norm peg to selected peg
	x=i;
	y=j;
	areaClicked=1;
  }
}

//the first function used in this fial, used when the html final is loaded up
function StartUp()
{
  for(var i=0;i<7;++i) //loops  through the 7 rows (in the array) to decide where to position pegs
  {
    PegPosition[i]=new Array()
    for(var j=0;j<7;++j) //loops  through the 7 colums (in the array) to decide where to position pegs
	{
       // 0 - an area from the corner, no pegs will go here
       // 1 - empty area, where a peg ahs been taken from or at the start in the centre
       // 2 - an area where a peg is, should be, positioned

      PegPosition[i][j]=((i<2 && (j<2 || j >4))||(i>4 && (j<2 || j >4)))? 0:((i==3 && j==3)? 1:2);
	  //Populates the PegPosition array 
	}
  }  
  Repaint(); //initiates the repaint function to produce the visulisation
  playSound("media/startup.wav");
}

//This function is used to refresh the page when the user has made a move, to update the positions of the peg
function Repaint()
{
  var html="<table>";
  for(var i=0;i<7;++i) //loop through each row of the board
  {
    html+="<tr>";
    for (var j=0;j<7;++j) //loop through each coloum of the board
	{
	  var statusP=(PegPosition[i])[j]; //
	  if (statusP==0)
	  {
	    html+="<td class='vazio'>&nbsp;</td>";
      }
	  else
	  {
        var form;  //The type of peg held in statusP, if there is a peg or isn't
        if(statusP==1)
		  form="noPeg";
		else
		  form="peg";
        html+="<td class='"+form+"' onclick='MouseClick(this,"+i+","+j+");'>&nbsp;</td>";
      }
	}
    html+="</tr>";
  }
  html+="</table>";
  document.getElementById("board").innerHTML = html;
}

// ==== play sound
function playSound(soundfile)
{
  document.getElementById("dummy").innerHTML=
           "<embed src=\""+soundfile+"\" hidden=\"true\" autostart=\"true\" loop=\"false\" />";
}
