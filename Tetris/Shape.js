//定义Cell类型描述每个格子的数据结构:
function Cell(r,c,src){//三个属性: r c src
	this.r=r; this.c=c; this.src=src;
}
//定义父类型Shape描述所有图形类型共同属性和方法
function Shape(cells,src,states,orgi){
	this.cells=cells;
	//遍历cells属性中每个cell对象
	for(var i=0;i<this.cells.length;i++){
		//设置当前cell的src为src
		this.cells[i].src=src;
	}
	//将四个格子中的参照格单独存储
	this.orgCell=this.cells[orgi];
	this.states=states;
	this.statei=0;//保存每个图形对象所处的旋转状态
}
//定义Shape类型原型对象，保存所有图形共有方法
Shape.prototype={
	IMGS:{
		T:"day36-37image/T.png",
		O:"day36-37image/O.png",
		I:"day36-37image/I.png",
	},
	moveLeft:function(){
		//遍历 当前图形(this) 中的每个cell
		for(var i=0;i<this.cells.length;i++){
			this.cells[i].c--;//将当前cell的c-1
		}
	},
	moveRight:function(){
		//遍历当前图形中的每个cell
		for(var i=0;i<this.cells.length;i++){
			this.cells[i].c++;//将当前cell的c+1
		}
	},
	moveDown:function(){
		//遍历当前图形中的每个cell
		for(var i=0;i<this.cells.length;i++){
			this.cells[i].r++;//将当前cell的r+1
		}
	},
	rotateR:function(){//顺时针旋转
		//将当前对象的statei+1
		this.statei++;
		//如果statei等于states的length，就改回0
		this.statei==this.states.length
						&&(this.statei=0);
		this.rotate();//调用重构的旋转
	},
	rotate:function(){//重构，旋转
		//获得states中statei位置的状态对象state
		var state=this.states[this.statei];
		//遍历当前图形中每个cell(i=0,1,2,3)
		for(var i=0;i<this.cells.length;i++){
			//设置当前格的r等于orgCell的r+state的ri
			this.cells[i].r=this.orgCell.r+state["r"+i];
			//设置当前格的c等于orgCell的c+state的ci
			this.cells[i].c=this.orgCell.c+state["c"+i];
		}
	},
	rotateL:function(){//顺时针旋转
		//将当前对象的statei-1
		this.statei--;
		//如果statei等于states的length，就改回0
		this.statei==-1&&
			(this.statei=this.states.length-1);
		this.rotate();//调用重构的旋转
	}
}
//定义State类型描述图形的一种旋转状态
function State(){//arguments:[0 1  2 3  4 5  6 7]
                           //r0c0 r1c1 r2c2 r3c3
    for(var i=0;i<4;i++){
    	this["r"+i]=arguments[2*i];
    	this["c"+i]=arguments[2*i+1];
    }
}
//定义T类型来描述T图形的数据结构
function T(){
	//借用Shape类型构造函数
	Shape.call(this,
		[new Cell(0,3),new Cell(0,4),
		 new Cell(0,5),new Cell(1,4)],
		this.IMGS.T,
		[  //states  r0 c0  r1c1   r2c2   r3c3
			new State(0,-1,  0,0,  0,+1,  +1,0),
      		new State(-1,0,  0,0,  +1,0,  0,-1),
      		new State(0,+1,  0,0,  0,-1,  -1,0),
      		new State(+1,0,  0,0,  -1,0,  0,+1)
		],
		1
	);
}
//让子类型原型继承父类型原型
Object.setPrototypeOf(
	T.prototype,Shape.prototype
);
function O(){
	//借用Shape类型构造函数
	Shape.call(this,
		[new Cell(0,4),new Cell(0,5),
		 new Cell(1,4),new Cell(1,5)],
		this.IMGS.O,
		[//states  r0 c0  r1c1   r2c2   r3c3
		new State(0,-1,  0,0,  +1,-1,  +1,0)],
		1
	);
}
//让子类型原型继承父类型原型
Object.setPrototypeOf(
	O.prototype,Shape.prototype
);
function I(){
	//借用Shape类型构造函数
	Shape.call(this,
		[new Cell(0,3),new Cell(0,4),
     	 new Cell(0,5),new Cell(0,6)],
		this.IMGS.I,
		[  //states  r0 c0  r1c1   r2c2   r3c3
			new State(0,-1,  0,0,  0,+1,  0,+2),
     		new State(-1,0,  0,0,  +1,0,  +2,0)
		],
		1
	);
}
//让子类型原型继承父类型原型
Object.setPrototypeOf(
	I.prototype,Shape.prototype
);











