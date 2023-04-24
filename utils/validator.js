module.exports = {
	error:'',
	check : function (data, rule){
		for(var i = 0; i < rule.length; i++){
			if (!rule[i].type){return true;}
			if (!rule[i].name) {return true;}
			if (!rule[i].message) {return true;}
			if (!data[rule[i].name]) {this.message = rule[i].message; return false;}
			switch (rule[i].type){
				case 'string':
					var reg = new RegExp('^.{' + rule[i].rule + '}$');
					if(!reg.test(data[rule[i].name])) {this.message = rule[i].message; return false;}
				break;
				case 'numeric':
					var reg = new RegExp('^(-[1-9]|[1-9])[0-9]{' + rule[i].rule + '}$');
					if(!reg.test(data[rule[i].name])) {this.message = rule[i].message; return false;}
					break;
				break;
				case 'length':
					var minMax = rule[i].rule.split(',');
					var min = Number(minMax[0]);
					var max = Number(minMax[1]);
					if (data[rule[i].name].length > max || data[rule[i].name].length < min) {
						this.message = rule[i].message;
						return false;
					}
				break;
				case 'between':
					if (!this.isNumber(data[rule[i].name])){
						this.message = rule[i].message;
						return false;
					}
					var minMax = rule[i].rule.split(',');
					minMax[0] = Number(minMax[0]);
					minMax[1] = Number(minMax[1]);
					if (data[rule[i].name] > minMax[1] || data[rule[i].name] < minMax[0]) {
						this.message = rule[i].message;
						return false;
					}
				break;
				case 'betweenD':
					var reg = /^-?[1-9][0-9]?$/;
					if (!reg.test(data[rule[i].name])) { this.message = rule[i].message; return false; }
					var minMax = rule[i].rule.split(',');
					minMax[0] = Number(minMax[0]);
					minMax[1] = Number(minMax[1]);
					if (data[rule[i].name] > minMax[1] || data[rule[i].name] < minMax[0]) {
						this.message = rule[i].message;
						return false;
					}
				break;
				case 'betweenF': 
					var reg = /^-?[0-9][0-9]?.+[0-9]+$/;
					if (!reg.test(data[rule[i].name])){this.message = rule[i].message; return false;}
					var minMax = rule[i].rule.split(',');
					minMax[0] = Number(minMax[0]);
					minMax[1] = Number(minMax[1]);
					if (data[rule[i].name] > minMax[1] || data[rule[i].name] < minMax[0]) {
						this.message = rule[i].message;
						return false;
					}
				break;
				case 'same':
					if (data[rule[i].name] != rule[i].rule) { this.message = rule[i].message; return false;}
				break;
				case 'notsame':
					if (data[rule[i].name] == rule[i].rule) { this.message = rule[i].message; return false; }
				break;
				case 'email':
					var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
					if (!reg.test(data[rule[i].name])) { this.message = rule[i].message; return false; }
				break;
				case 'phone':
					var reg = /^1[0-9]{10,10}$/;
					if (!reg.test(data[rule[i].name])) { this.message = rule[i].message; return false; }
				break;
				case 'zipcode':
					var reg = /^[0-9]{6}$/;
					if (!reg.test(data[rule[i].name])) { this.message = rule[i].message; return false; }
				break;
				case 'reg':
					var reg = new RegExp(rule[i].rule);
					if (!reg.test(data[rule[i].name])) { this.message = rule[i].message; return false; }
				break;
				case 'in':
					if(rule[i].rule.indexOf(data[rule[i].name]) == -1){
						this.message = rule[i].message; return false;
					}
				break;
				case 'sameField': // 判断是否与某个Field的值相同,两次密码对比
					if (data[rule[i].name] != data[rule[rule].name]) { this.message = rule[i].message; return false;}
				break;
				case 'required':
					if(data[rule[i].name] == null || data[rule[i].name].length < 1){this.message = rule[i].message; return false;}
				break;
			}
		}
		return true;
	},
	isNumber : function (checkVal){
		checkVal = Number(checkVal);
		if(checkVal == NaN){return false;}
		return true;
	}
}