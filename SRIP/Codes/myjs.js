
  var allRegisters = ['$r0','$at','$v0','$v1','$a0','$a1','$a2','$a3','$t0','$t1','$t2','$t3','$t4','$t5','$t6','$t7','$s0','$s1','$s2','$s3','$s4','$s5','$s6','$s7','$t8','$t9','$k0','$k1','$gp','$sp','$s8','$ra'];

  
  var allRegisterNames = ['r0','at','v0','v1','a0','a1','a2','a3','t0','t1','t2','t3','t4','t5','t6','t7','s0','s1','s2','s3','s4','s5','s6','s7','t8','t9','k0','k1','gp','sp','s8','ra'];

  var data; 
  var instructions; 
  var registers = {}; 
  var registerDOM = []; 
  var allLables = {};
  var currentInstruction;
  var stackLimit = 100; 

  for(var i=0 ; i<allRegisters.length ; i++) {
    registers[allRegisters[i]] = 0;
    registerDOM.push(document.getElementById(allRegisterNames[i]));
  }
  registers['$sp'] = {
    array: [1,2,3,4],
    current: 0
  };
  registers['$zero'] = 0;



  var textareas = document.getElementsByTagName('textarea');
  var count = textareas.length;
  for(var i=0;i<count;i++){
      textareas[i].onkeydown = function(e){
          if(e.keyCode==9 || e.which==9){
              e.preventDefault();
              var s = this.selectionStart;
              this.value = this.value.substring(0,this.selectionStart) + "\t" + this.value.substring(this.selectionEnd);
              this.selectionEnd = s+1; 
          }
      }
  }


function myabout() {
  confirm("MipsParser version 1.0  Designed by-  Thogaru Himabindu . MipsParser is a MIPS assembler and runtime simulator");
}
$(document).ready(function(){
 $("#assem").click(function(){
      $("#execc").click();

  });

 $("#Helpid").click(function(){
      $("#lol").click();

  });

});



var textareas = document.getElementsByTagName('textarea');
  var count = textareas.length;
  for(var i=0;i<count;i++){
      textareas[i].onkeydown = function(e){
          if(e.keyCode==9 || e.which==9){
              e.preventDefault();
              var s = this.selectionStart;
              this.value = this.value.substring(0,this.selectionStart) + "\t" + this.value.substring(this.selectionEnd);
              this.selectionEnd = s+1; 
          }
      }
  }





function updateData(start,end) {
	data = {}; 
	var d,arr,label,type;
	for(var i=start+1 ; i<end ; i++) {
		if(instructions[i].indexOf('.word')==-1 && instructions[i].indexOf('.space')==-1) { // exiting if not .word or .space
			return false;
		} else {
			d = fetchData(instructions[i]); // middleware
			
			if(!d) return false; // if could not fetch data

			label = d[1];
			type = d[2]; // 'word' or 'space'
			arr = d[3]; // content followed by .word or .space

		

			if(data[label]){ // checking for repetition of label
				alert('"' +label + '" repeated');
				return false;
			}

			arr = removeBlankSpaces(arr); // middleware
			arr = arr.split(','); // breaking the content

			for(var j=0 ; j<arr.length ; j++) { // validating and updating the number in the array
				if(arr[j]>2147483647 || arr[j]<-2147483648) return false;
				arr[j] = Number(arr[j]);
			}

			if(type=='word'){

				if(arr.length==1) data[label] = { // a single word
					type: 'word',
					number:arr[0],
					base: 2000000000+Math.floor(Math.random()*1000000000)
				};
				else data[label] = { // array of words
					type: 'word',
					array: arr.slice(),
					base: 2000000000+Math.floor(Math.random()*1000000000)
				};

			} else if(type=='space') {

				if(arr.length!=1) return false; // if more than 1 space option entered

				arr = arr[0];
				if(arr%4 != 0) return false;

				arr /= 4;
				if(arr==1) data[label] = { // a single word
					type: 'space',
					number:0,
					base: 2000000000+Math.floor(Math.random()*1000000000)
				}; 
				else data[label] = { // an array
					type: 'space',
					array: new Array(arr),
					base: 2000000000+Math.floor(Math.random()*1000000000)
				}

			} else {
				return false;
			}


		}
	}

	instructions.splice(start,end-start); // removing the data section from the array on instructions
	return true;
}

	
function loadProgram() {



	data = {}; // clearing the data section
	allLabels = {};

	document.getElementById('status').innerHTML = ' (loading program . . .)';

		
	for(var i=0 ; i<allRegisters.length ; i++) { // setting all register values to 0
		registers[allRegisters[i]] = 0;
	}


	registers['$sp'] = { // setting the stack to an empty array of size 100
		array: new Array(stackLimit),
		current: -1,
		base: 2000000000+Math.floor(Math.random()*1000000000)
	};


	instructions = document.getElementById('source').value.split('\n'); // fetching the program

	var pos;
	for(var i=0 ; i<instructions.length ; i++) { // scraping the comments from the instructions
		pos = instructions[i].indexOf('#');
		if(pos != -1){
			instructions[i] = instructions[i].slice(0,pos);
		}
		instructions[i] = handleBlankSpaces(instructions[i]); // middleware
	}

	function removeBlanks(){ // removing blank instructons (empty lines)
        var pos = instructions.indexOf('');
        if(pos != -1){
            instructions.splice(pos,1);
            removeBlanks();
        }
    }
    removeBlanks();

    // to load .data section
    pos = instructions.indexOf('.data');
    if(pos != -1) { // if .data exists
    	for(var i=pos+1 ; i<instructions.length ; i++) { // to find the end of .data section
    		if(instructions[i].indexOf(':')==-1) {
    			if(updateData(pos,i)) break;
    			
    		}
    	}
    }


    var x;
    for(var i=0 ; i<instructions.length ; i++) { // to validate the syntax
    	// middlewares: 'validateIns','getInstruction','checkForSyntaxError'
    	
    	if(isLabel(instructions[i])){ // checking for repetition of label

    		if(!validLabel(instructions[i])){
    			alert('Invalid label: "'+removeBlankSpaces(instructions[i])+'"');
				document.getElementById('status').innerHTML = ' ERROR:'+instructions[i];
	    		currentInstruction = instructions.length;
	    		return;
    		}

    		if(allLabels[removeBlankSpaces(instructions[i])]){
    			alert('"'+removeBlankSpaces(instructions[i])+'" repeated');
				document.getElementById('status').innerHTML = ' ERROR:'+instructions[i];
	    		currentInstruction = instructions.length;
	    		return;
    		} else {
    			allLabels[removeBlankSpaces(instructions[i])] = true;
    		}
    	}
	}

    currentInstruction = instructions.indexOf('.text')+1;

    // updateRegistersInUI(); // middleware

	document.getElementById('status').innerHTML = '(program loaded)';
	

}

function loadSampleProgram(id){
	document.getElementById('source').value = sampleProgram[id];
	loadProgram();
}


function nextStep() {

	if(currentInstruction < instructions.length) { // if it has not reached the end

		//document.getElementById('status').innerHTML = 'Instruction Executed: '+instructions[currentInstruction];
		var node = document.createElement("P");
	  var textnode = document.createTextNode(instructions[currentInstruction]);
	  node.appendChild(textnode);
	  document.getElementById("statusT").appendChild(node);
		var instruction = instructions[currentInstruction];
		if(instruction.indexOf('halt') != -1) { // ending if its a 'halt'
			alert('Program Ended!');
			currentInstruction++;
		
			return false;
		} else if(instruction.indexOf('j ') != -1 || instruction.indexOf('$') != -1){ // checking if its not a lable
			if(instructionFunctions[getInstruction(instruction)](instruction)){
				// execution was successful
				// updateRegistersInUI();
				currentInstruction++;
			} else {
				// execution was unsuccessful
				alert('Run time error: '+instruction);
				currentInstruction = instructions.length;
				
				return false;
			}
		} else { // executing next instruction if encountered a label
			currentInstruction++;
			nextStep();
		}
		return true;
	} else {
		return false;
	}

}

function runProgram(){
	
	while(nextStep());
}



function add_sub(i,f) {
	var reg = R_format(i);
	var rd = reg[1]; // $xx
	var rt = reg[2]; // $yy
	var rs = reg[3]; // $zz

	if(isConstantReg(rd)) return false; // for constant destination

	if(isArray_register(rt) && isArray_register(rs)) return false; // case of adding array to array

	if(isArray_register(rt)){ // if 'rt' corresponds to and array/address
		
		// modifying the offset of 'rt'
		var offset = registers[rs];
		var index = -offset/4;
		if(offset%4 != 0 || (f(registers[rt].current,index))>=registers[rt].array.length || (f(registers[rt].current,index))<0) return false;

		registers[rd] = JSON.parse(JSON.stringify(registers[rt]));
		registers[rd].current = f(registers[rd].current,index);

	} else if(isArray_register(rs)) { // if 'rs' corresponds to and array/address

		
		var offset = registers[rt];
		var index = -offset/4;
		if(offset%4 != 0 || (f(registers[rs].current,index))>=registers[rs].array.length || (f(registers[rs].current,index))<0) return false;

		registers[rd] = JSON.parse(JSON.stringify(registers[rs]));
		registers[rd].current = f(registers[rd].current,index);
		
	} else { // if 'rt' and 'rs' are both numbers
		registers[rd] = (f(registers[rt],registers[rs]))|0;
	}

	return true;
}

function mul_and_or_nor_slt(i,f) {
	var reg = R_format(i);
	var rd = reg[1]; // $xx
	var rt = reg[2]; // $yy
	var rs = reg[3]; // $zz

	if(isConstantReg(rd)) return false;
		
	if(isArray_register(rt) && isArray_register(rs)) return false; // case of multiplying array to array
		
	registers[rd] = (f(registers[rt],registers[rs]))|0;

	return true;
}

function andi_ori_slti(i,f) {
	var reg = I_format(i);
	var rd = reg[1]; // $xx
	var rt = reg[2]; // $yy
	var imm = Number(reg[3]); // imm
		
	if(isConstantReg(rd)) return false;
		
	if(isArray_register(rt)) return false; // case of AND of array with a number
		
	if(imm>2147483647 || imm<-2147483648) return false; // limiting to 32 bit number

	registers[rd] = (f(registers[rt],imm))|0;

	return true;
}

function beq_bne(i,f) {
	var reg = I_format(i);
	var rd = reg[1]; // $xx
	var rt = reg[2]; // $yy
	var label = reg[3]; // label
			
	if(f(registers[rd],registers[rt])) { // if $xx == $yy
		var pos = labelPosition(label);
		if(pos == -1) { // if label not found
			alert('"' + label + '" not found');
			return false;
		} else { // if label found
			currentInstruction = pos;
		}
	}

	return true;
}

var instructionFunctions = {

	add: function(i){
		return add_sub(i,function(a,b){ return a+b; });
	},

	addi: function(i){ // addi $xx , $yy , imm

		var reg = I_format(i);
		var rd = reg[1]; // $xx
		var rt = reg[2]; // $yy
		var imm = Number(reg[3]); // imm

		if(isConstantReg(rd)) return false;

		if(imm>2147483647 || imm<-2147483648) return false; // limiting to 32 bit number

		if(isArray_register(rt)){ // if 'rt' corresponds to and array/address

			// modifying the offset of 'rt'
			var offset = imm;
			var index = -(offset/4);
			if(offset%4 != 0 || (registers[rt].current+index)>=registers[rt].array.length || (registers[rt].current+index)<-1) return false;

			registers[rd] = JSON.parse(JSON.stringify(registers[rt]));
			registers[rd].current += index;

		} else { // if 'rt' is a number
			registers[rd] = (registers[rt] + imm)|0;
		}

		return true;

	},

	sub: function(i){
		return add_sub(i,function(a,b){ return a-b; });
	},

	mul: function(i){ 
		return mul_and_or_nor_slt(i,function(a,b){ return a*b; });
	},

	and: function(i){
		return mul_and_or_nor_slt(i,function(a,b){ return a&b; });
	},

	andi: function(i){
		return andi_ori_slti(i,function(a,b){ return a&b; });
	},

	or: function(i){
		return mul_and_or_nor_slt(i,function(a,b){ return a|b; });
	},

	ori: function(i){
		return andi_ori_slti(i,function(a,b){ return a|b; });
	},

	nor: function(i){
		return mul_and_or_nor_slt(i,function(a,b){ return ~(a|b); });
	},

	slt: function(i){
		return mul_and_or_nor_slt(i,function(a,b){ return a<b?1:0; });
	},

	slti: function(i){
		return andi_ori_slti(i,function(a,b){ return a<b?1:0; });
	},

	beq: function(i){ 
		return beq_bne(i,function(a,b){ return a==b; });
	},

	bne: function(i){
		return beq_bne(i,function(a,b){ return a!=b; });
	},

	j: function(i){ // j label

		var reg = J_format(i);
		var label = reg[1]; // label

		var pos = labelPosition(label);
			
		if(pos == -1) { // if label not found
			alert('"' + label + '" not found');
			return false;
		} else { // if label found
			currentInstruction = pos;
		}

		return true;

	},

	lw: function(i){

		if(islw_Format1(i)) { // lw $xx , offset($yy)

			var d = lw_form1(i);
			var rd = d[1]; // $xx
			var offset = Number(d[2]); // offset
			var arr = registers[d[3]].array; // $yy

			if(isConstantReg(rd)) return false;
			
			if(offset%4 != 0 || !arr) return false;

			offset /= 4;
			var index = (registers[d[3]].current||0) - offset; // index from the offset

			if(index>=arr.length || index<0) return false;
			registers[rd] = arr[index]|0; // loading the word

		} else if(islw_Format2(i)) { // lw $xx , label

			var d = lw_form2(i);
			var rd = d[1]; // $xx
			var label = d[2]; // label

			if(isConstantReg(rd)) return false;
			
			if(data[label].constructor != Object || data[label].array) return false; // if its array or not an address
			
			registers[rd] = data[label].number|0; // loading the word

		} else { // invalid lw format
			return false;
		}

		return true;

	},

	sw: function(i){

		if(islw_Format1(i)) { // sw $xx , offset($yy)

			var d = lw_form1(i);
			var rd = d[1]; // $xx
			var offset = Number(d[2]); // offset
			var arr = registers[d[3]].array; // $yy

			if(isArray_register(rd)) return false;

			if(offset%4 != 0 || !arr) return false;

			offset /= 4;
			var index = (registers[d[3]].current||0) - offset; // index from the offset

			if(index>=arr.length || index<0) return false;

			registers[d[3]].array[index] = registers[rd]|0;  // storing the word
			if(registers[d[3]].label) data[registers[d[3]].label].array[index] = registers[rd]|0;

		} else if(islw_Format2(i)){ // sw $xx , label

			var d = lw_form2(i);
			var rd = d[1]; // $xx
			var label = d[2]; // label

			if(data[label].constructor != Object || data[label].array || registers[rd].constructor == Object) return false;
			
			data[label].number = registers[rd]|0; // storing the word

		} else { // invalid sw format
			return false;
		}

		return true;

	},

	la : function(i) { // la $xx , label
		
		if(islw_Format2(i)) {

			var d = lw_form2(i);
			var rd = d[1]; // $xx
			var label = d[2]; // label

			if(isConstantReg(rd) || !data[label]) return false;
			
			if(data[label].constructor == Object && data[label].array){ // if label contains array
				if(data[label].type == 'word'){ // type = word
					registers[rd] = {
						array: data[label].array.slice().reverse(),
						current: data[label].array.length-1,
						base: data[label].base,
						label: label
					};
				} else { // type = space
					registers[rd] = {
						array: data[label].array,
						current: data[label].array.length-1,
						base: data[label].base,
						label: label
					};
				}
			} else if(data[label].constructor == Object) { // if label contains single word
				registers[rd] = {
					array: [data[label].number],
					current: 0 ,
					base: data[label].base,
					label: label
				};
			} else { // invalid label
				return false;
			}
			
			return true;

		} else { // invalid la format
			return false;
		}

	}

};


function isR_Format(i) {
	if(/^add$|^sub$|^mul$|^or$|^nor$|^and$|^slt$/g.test(getInstruction(i)))
		return /\w+[ ]+\$\w+[ ]*\,[ ]*\$\w+[ ]*\,[ ]*\$\w+/.test(i);
	else 
		return false;
}


function isI_Format(i) {
	if(/^addi$|^slti$|^andi$|^ori$/g.test(getInstruction(i)))
		return /\w+[ ]+\$\w+[ ]*\,[ ]*\$\w+[ ]*\,[ ]*[-]?[0-9]+/.test(i);
	else if(/^beq$|^bne$/g.test(getInstruction(i)))
		return /\w+[ ]+\$\w+[ ]*\,[ ]*\$\w+[ ]*\,[ ]*\w+/.test(i);
	else
		return false;
}


function isJ_Format(i) {
	i = i.split(' ');
	return i[0]=='j' && i.length==2;
}

function islw_Format1(i){
	if(/^lw$|^sw$/g.test(getInstruction(i)))
		return /\w+[ ]+\$\w+[ ]*\,[ ]*[0-9]+\(\$\w+\)/g.test(i);
	else
		return false;
}

function islw_Format2(i){
	if(/^lw$|^sw$|^la$/g.test(getInstruction(i)))
		return /\w+[ ]+\$\w+[ ]*\,[ ]*[\w0-9]+/g.test(i);
	else
		return false;
}


function isLabel(i) {
	if(i=='halt') return true;
	return /^\w+[ ]*\:$/g.test(i);
}


function validLabel(i) {
	if(i=='halt') return true;
	return /^[a-zA-Z]+[a-zA-Z0-9_]*[ ]*\:$/g.test(i);
}


function R_format(i){
	return /(\$[^, ]*)[^\$]*(\$[^, ]*)[^\$]*(\$[^, ]*)/g.exec(i);
}


function I_format(i){
	return /(\$[^, ]*)[^\$]*(\$[^, ]*)[^A-Za-z0-9\-]*([-]?[A-Za-z0-9]*)/g.exec(i);
}

function J_format(i){
	return /\j\s+(\w+)/g.exec(i);
}

function lw_form1(i) { // offset and register
	return /\w+[ ]*(\$\w+)[ ]*\,[ ]*([0-9]+)\((\$\w+)\)/g.exec(i);
}

function lw_form2(i) { // label
	return /\w+[ ]*(\$\w+)[ ]*\,[ ]*(\w+)/g.exec(i);
}


function getInstruction(i){
	return /\w+/g.exec(i)[0];
}


function fetchData(i){
	return /(\w+)[ ]*\:[ ]*\.(\w+)[ ]*(.*)/g.exec(i);
}


function validateIns(i){
	if(i.indexOf(':')!=-1)
		return isLabel(i);
	else
		return /^add$|^addi$|^sub$|^mul$|^and$|^andi$|^or$|^ori$|^nor$|^slt$|^slti$|^beq$|^bne$|^j$|^lw$|^sw$|^la$|^halt$|^text$/g.test(i);
}


function validRegisters(reg){
	return /^\$r0$|^\$at$|^\$v0$|^\$v1$|^\$a0$|^\$a1$|^\$a2$|^\$a3$|^\$t0$|^\$t1$|^\$t2$|^\$t3$|^\$t4$|^\$t5$|^\$t6$|^\$t7$|^\$s0$|^\$s1$|^\$s2$|^\$s3$|^\$s4$|^\$s5$|^\$s6$|^\$s7$|^\$t8$|^\$t9$|^\$k0$|^\$k1$|^\$gp$|^\$sp$|^\$s8$|^\$ra$|^\$zero$/g.test(reg);
}

function isConstantReg(reg) {
	return /^\$zero$|^\$at$/g.test(reg);
}


function isArray_register(reg){
	return registers[reg].constructor == Object && registers[reg].array && registers[reg].array.constructor == Array;
}


function isArray_data(label){
	return data[label].constructor == Array;
}


function isNumber(num) {
	return /^[0-9]*$/g.test(num);
}

function labelPosition(label){
	for(var i=0 ; i<instructions.length ; i++) {
		if(instructions[i].indexOf(':')!=-1 && instructions[i].indexOf(label)!=-1 && (new RegExp('^'+label+'[ ]*\\:','g')).test(instructions[i])) return i;
	}
	return -1;
}


function updateRegistersInUI() {
	document.getElementById('dataSection').innerHTML = "";

	for(var i=0 ; i<allRegisterNames.length ; i++) { // to update the registers
		if(registers[allRegisters[i]].constructor == Object )
			registerDOM[i].innerHTML = registers[allRegisters[i]].base - (registers[allRegisters[i]].current * 4);
		else
			registerDOM[i].innerHTML = registers[allRegisters[i]];
	}

	var word = '' , space = '';

	for(i in data) { // to update the .data section
		if(data[i].type == 'word'){
			word += '&emsp;<li>'+ i + ': ' + (data[i].array? '['+data[i].array+']': data[i].number) + '<br></li>';
		} else if(data[i].type == 'space') {
			space += '&emsp;<li>'+ i + ': ' + (data[i].array? '['+data[i].array.slice().reverse()+']': data[i].number) + '<br></li>';
		}
	}

	// updated values in the stack
	var stack = '<b>$sp</b> (max size = 100 words) : <br>&emsp;' + (registers['$sp'].array? '['+registers['$sp'].array+']': registers['$sp'].number) + '<br>';
	
	document.getElementById('dataSection').innerHTML = stack + '<br>' + (word==''?'':('<b>.word</b>:<ul>' + word+'</ul>')) + (space==''? '' :('<b>.space</b><ul>' + space + '</ul>'));

}



function handleBlankSpaces(text){
    if(text){
	    text = text.replace(/\t/g, ' ');
	    text = text.replace(/\s\s+/g, ' ');
	    if(text[text.length-1]==" " || text[text.length-1]=="\t") {
	      text = text.slice(0,text.length-1);
	    }
	    if(text[0]==" " || text[0]=="\t") {
	      text = text.slice(1,text.length);
	    }
	    return text;
    } else {
    	return "";
    }
}


function removeBlankSpaces(text){
    if(text){
	    text = text.replace(/\s/g, '');
	    text = text.replace(/\t/g, '');
	    return text;
    } else {
    	return "";
    }
}


function checkForSyntaxError(i) {
	if(isR_Format(i)){ // if R format, check for valid registers for 'rd','rs' and 'rt'
		var reg = R_format(i);
		return !(validRegisters(reg[1]) && validRegisters(reg[2]) && validRegisters(reg[3]));
	} else if(isI_Format(i)) { // if I format, check for valid registers for 'rd' and 'rs'
		var reg = I_format(i);
		return !(validRegisters(reg[1]) && validRegisters(reg[2]));
	} else if(isJ_Format(i) || islw_Format1(i) || islw_Format2(i)) { // check for 'j' and 'lw'
		return false;
	} else { // check for label or '.text'
		return !isLabel(i) && i.indexOf('.text')==-1;
	}
}

function copyFunction(containerid) {
if (document.selection) { 
    var range = document.body.createTextRange();
    range.moveToElementText(document.getElementById(containerid));
    range.select().createTextRange();
    document.execCommand("copy"); 

} else if (window.getSelection) {
    var range = document.createRange();
     range.selectNode(document.getElementById(containerid));
     window.getSelection().addRange(range);
     document.execCommand("copy");
}}