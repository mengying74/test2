var tetris={
	RN:20,CN:10,//总行数，总列数
	CSIZE:26, OFFSET:15,//每个格子大小和修正的边距
	pg:null,//保存游戏容器div
	shape:null,//保存正在下落的主角图形
	nextShape:null,//保存下一个备胎图形
	timer:null,//保存定时器序号
	interval:200,//保存下落的速度
	wall:null,//方块墙，保存所有停止下落的方块
	lines:0,//保存删除的行数
	score:0,//保存游戏分数
	SCORES:[0,10,30,60,100],//保存删除行数对应的得分
		 // 0  1  2  3  4
	state:1,//保存游戏状态
	RUNNING:1,//运行中状态
	GAMEOVER:0,//游戏结束
	PAUSE:2,//暂停状态
	start:function(){//启动游戏
		this.state=this.RUNNING;//重置游戏状态
		this.lines=this.score=0;//分数和行数清零
		//将wall赋值为空数组
		this.wall=[];
		//r从0开始到<RN结束
		for(var r=0;r<this.RN;r++){
      		//在wall中压入一个CN个空元素的数组
      		this.wall.push(new Array(this.CN));//——var arr=new Array(n);
		}
      	//debugger;
		//找到class为playground的div保存在pg属性中
		this.pg=document.getElementsByClassName("playground")[0];
		//生成主角和胚胎图形
		this.shape=this.randomShape();//O,I
		this.nextShape=this.randomShape();
		this.paint();
		//启动周期性定时器
		this.timer=setInterval(
			this.moveDown.bind(this),this.interval);
		document.onkeydown=function(e){
			switch(e.keyCode){//判断键盘号
				case 37://是37: 调左移方法
					this.state==this.RUNNING&&this.moveLeft();break;
				case 39://是39: 调右移方法
					this.state==this.RUNNING&&this.moveRight();break;
				case 40://是40: 调下落方法
					this.state==this.RUNNING&&this.moveDown();break;
				case 32://是32: 一落到底
					this.state==this.RUNNING&&this.hardDrop();break;
				case 38://是38: 调右转方法
					this.state==this.RUNNING&&this.rotateR();break;
				case 90://是90: 调左转方法
					this.state==this.RUNNING&&this.rotateL();break;
				case 80://是80: 调暂停方法
					this.state==this.RUNNING&&this.pause();break;
				case 67://是67: 调继续方法
					this.state==this.PAUSE&&this.myContinue();break;
				case 81://是67: 调结束方法
					this.state==this.RUNNING&&this.gameOver();break;
				case 83://是67: 调结束方法
					this.state==this.GAMEOVER&&this.start();break;
					
			}
		}.bind(this);
	},
	gameOver:function(){
		this.state=this.GAMEOVER;
		clearInterval(this.timer);//停止定时器
		this.timer=null;
		this.paint();
	},
	pause:function(){
		this.state=this.PAUSE;//该状态
		clearInterval(this.timer);//停止定时器
		this.timer=null;
		this.paint();
	},
	myContinue:function(){
		this.state=this.RUNNING;
		this.timer=
			setInterval(this.moveDown.bind(this),this.interval);

	},
	canRotate:function(){
		//遍历主角图形中每个cell
		for(var i=0;i<this.shape.cells.length;i++){
			//将当前cell临时保存在cell中
			var cell=this.shape.cells[i];
			//如果r<0或r>=RN或c<0或c>=CN或wall中和cell相同位置有格
			if(cell.r<0||cell.r>=this.RN
				||cell.c<0||cell.c>=this.CN
				||this.wall[cell.r][cell.c]!==undefined){
				return false;//返回false
			}
		}//(遍历结束)
		return true;//返回true
	},
	rotateR:function(){
		this.shape.rotateR();
		if(!this.canRotate()){//如果不可以旋转
			this.shape.rotateL();
		}else{
			this.paint();
		}	
	},
	rotateL:function(){
		this.shape.rotateL();
		if(!this.canRotate()){//如果不可以旋转
			this.shape.rotateR();
		}else{
			this.paint();
		}
	},
	hardDrop:function(){//一落到底
		//只要可以下落，就反复
		while(this.canDown()){
			//调用shape的moveDown方法
			this.shape.moveDown();
		}
		this.paint();//重绘一切
	},
	canLeft:function(){//判断能否左移
		//遍历主角图形中每个cell
		for(var i=0;i<this.shape.cells.length;i++){
			//将当前cell临时保存在cell中
			var cell=this.shape.cells[i];
			//如果cell的c等于0或wall中cell左侧有格
			if(cell.c==0||
				this.wall[cell.r][cell.c-1]!==undefined){
				return false;//返回false
			}
		}//(遍历结束)
		return true;//返回true
	},
	moveLeft:function(){//左移一次
		if(this.canLeft()){//如果可以左移
			this.shape.moveLeft();//调用主角图形的moveLeft方法
			this.paint();//重绘一切
		}
	},
	canRight:function(){//判断能否右移
		//遍历主角图形中每个cell
		for(var i=0;i<this.shape.cells.length;i++){
			//将当前cell临时保存在cell中
			var cell=this.shape.cells[i];
			//如果cell的c等于CN-1或wall中cell右侧有格
			if(cell.c==this.CN-1||
				this.wall[cell.r][cell.c+1]!==undefined){
				return false;//返回false
			}
		}//(遍历结束)
		return true;//返回true
	},
	moveRight:function(){//右移一次
		if(this.canRight()){//如果可以右移
			this.shape.moveRight();//调用主角图形的moveRight方法
			this.paint();//重绘一切
		}
	},
	canDown:function(){//判断能否下落
		//遍历shape中每个cell
		for(var i=0;i<this.shape.cells.length;i++){
      		//将当前cell临时保存在变量cell中
      		var cell=this.shape.cells[i];
      		//如果cell的r等于RN-1或wall中当前cell的下方位置有格（wall二维数组）
      		if(cell.r==this.RN-1
      			||this.wall[cell.r+1][cell.c]!==undefined){
      			return false;//返回false
      		}	
   		}//(遍历结束)
    	return true;//返回true
	},
	landIntoWall:function(){//将主角图形的格落到墙中
		//遍历shape中每个cell
		for(var i=0;i<this.shape.cells.length;i++){
	      //将当前cell临时保存在变量cell中
	      var cell=this.shape.cells[i];
	      //设置wall中cell相同位置的元素值为cell
	      this.wall[cell.r][cell.c]=cell;
	    }
	},
	moveDown:function(){//让主角图形下落
		if(this.canDown()){//如果可以下落
      		//调用主角图形的moveDown方法
      		this.shape.moveDown();
		}else{//否则  
			this.landIntoWall();//落到墙中
			var ln=this.deleteRows();//检查并删除满格行
			//用ln获得对应得分，累加到score中
			this.score+=this.SCORES[ln];
			this.lines+=ln;//将ln累加到lines中
			//如果游戏没有结束
			if(!this.isGameOver()){
	      		this.shape=this.nextShape;//新建主角图形
	      		this.nextShape=this.randomShape();//新建备胎图形
      		}else{//否则
      			//修改游戏的状态为GAMEOVER
      			this.state=this.GAMEOVER;
      			//停止定时器，清空timer
      			clearInterval(this.timer);
      			this.timer=null;
      		}
      	}
		this.paint();//重绘一切！
	},
	isGameOver:function(){
		//遍历备胎图形的cells中每个cell
		for(var i=0;i<this.nextShape.cells.length;i++){
			//将cell另存为cell
			var cell=this.nextShape.cells[i];
			//如果在wall中cell相同位置有格
			if(this.wall[cell.r][cell.c]!==undefined){
				return true;}//返回true
		}//(遍历结束)
		return false;//返回false
	},
	paintState:function(){//根据游戏状态绘制图片
		//如果游戏状态为GAMEOVER
		if(this.state==this.GAMEOVER){
			//新建img元素
			var img=new Image();
			//设置img的src为"gameover 图片"
			img.src="day36-37image/game-over.png";
			this.pg.appendChild(img);
		}else if(this.state==this.PAUSE){//否则，如果游戏状态为PAUSE
			//新建img元素
			var img=new Image();
			//设置imgsrc为"pause 图片"
			img.src="day36-37image/pause.png";
			this.pg.appendChild(img);
		}
	},
	deleteRows:function(){//检查并删除所有满格哼
		//自底向上遍历wall中的每一行
		for(var r=this.RN-1,ln=0;r>=0;r--){
			//如果当前行是空行，或者ln=4  //就退出循环
			if(this.wall[r].join("")==""||ln==4){break;}
			//如果当前行是满格行就删除当前行
			if(this.isFullRow(r)){
				this.deleteRow(r);
				r++;//r留在原地继续判断新的r行
				ln++;
			}
		}
		return ln;//返回ln，删除了几行，最多4行
	},
	isFullRow:function(r){//判断当前行是不是满格
		//如果wall中r行转为字符串后，包括^,或,,或,$
		return String(this.wall[r]).search(/^,|,,|,$/)==-1
	},
	deleteRow:function(r){//删除当前行
		//从r行开始，反向遍历wall中的每一行
		for(;r>=0;r--){
			//用r-1行，替换r行
			this.wall[r]=this.wall[r-1];
			//将r-1行赋值为CN个空元素的数组
			this.wall[r-1]=new Array(this.CN);
			//遍历wall中r行的每个格
			for(var c=0;c<this.CN;c++){
				//如果当前格不是undefined
				if(this.wall[r][c]!==undefined){
					//将当前格的r+1
					this.wall[r][c].r++;
				}
			}//遍历结束
			//如果r-2行为空行，就退出循环
			if(this.wall[r-2].join("")==""){break;}
		}
	},
	randomShape:function(){//随机生成一个新图形
		//在0~2之间生成一个随机整数r
		var r=Math.floor(Math.random()*3);
		switch(r){//判断r
			//是0: 就返回一个新的O图形
			case 0:return new O();
			//是1: 就返回一个新的I图形
			case 1:return new I();
			//是2: 就返回一个新的T图形
			case 2:return new T();
		}
	},
	paint:function(){//重绘一切！
		//将pg的内容中所有img元素替换为""
		this.pg.innerHTML=
			this.pg.innerHTML.replace(/<img\s[^>]+>/g,"");
		this.paintShape();// 重绘 主角图形
		this.paintWall();//重绘 墙中的格
		this.paintNext();//重绘备胎图形
		this.paintScore();//重绘成绩
		this.paintState();//重绘图片
	},
	paintScore:function(){
		//获得id为score的span，设置其内容为score属性
		document.getElementById("score")
				.innerHTML=this.score;
		//获得id为lines的span，设置其内容为lines属性
		document.getElementById("lines")
			    .innerHTML=this.lines;
	},
	paintNext:function(){
		//创建文档片段frag
		var frag=document.createDocumentFragment();
		//遍历备胎图形nextShape中的cells数组中每个cell对象
		for(var i=0;i<this.nextShape.cells.length;i++){
			var img=
				this.paintCell(this.nextShape.cells[i],frag);
			img.style.top=parseFloat(img.style.top)+this.CSIZE+"px";
			img.style.left=parseFloat(img.style.left)+this.CSIZE*10+"px";
		}//(遍历结束)
		this.pg.appendChild(frag);//将frag整体追加到pg上
	},
	paintWall:function(){//重绘墙
		//创建文档片段frag
		var frag=document.createDocumentFragment();
		//自底向上遍历wall中每一行
		for(var r=this.RN-1;r>=0;r--){
			//如果当前行不是空行
			if(this.wall[r].join("")!=""){
				//遍历wall中当前行的每个格
				for(var c=0;c<this.CN;c++){
					//如果当前格有效
					if(this.wall[r][c]){
            			//调用paintCell传入当前格和frag作为参数
            			this.paintCell(this.wall[r][c],frag);
            		}
            	}
         	}else{break;}//否则,退出循环	
        }//(遍历结束)
        this.pg.appendChild(frag); //将frag追加到pg中
	},
	paintCell:function(cell,frag){//重构出，绘制一个格
		var img=new Image();//创建img元素
		img.src=cell.src;//设置img的src为cell的src
		//设置img的宽为CSIZE
		img.style.width=this.CSIZE+"px";
		//设置img的top为OFFSET+cell的r*CSIZE
		img.style.top=
			this.OFFSET+cell.r*this.CSIZE+"px";
		//设置img的left为OFFSET+cell的c*CSIZE
		img.style.left=
			this.OFFSET+cell.c*this.CSIZE+"px";
		frag.appendChild(img);//将img追加到frag中
		return img;//返回新建的img对象
	},
	paintShape:function(){//专门绘制主角图形
		//创建文档片段frag
		var frag=document.createDocumentFragment();
		//遍历主角图形shape中的cells数组中每个cell对象
		for(var i=0;i<this.shape.cells.length;i++){
			this.paintCell(this.shape.cells[i],frag);
		}//(遍历结束)
		this.pg.appendChild(frag);//将frag整体追加到pg上
	},
	
}
tetris.start();