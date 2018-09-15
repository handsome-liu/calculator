class Calculator {
    constructor(target) {
        this.target = target;
        this.arr = [];
        this.num1 = '';
        this.sym = '';
        this.num2 = '';
        this.init();
    }
    /*
        1.click 1 => num1 = 1
        2.click + => sym = +

        3.click 2 => num2 = 2
        4.click + =>  push(num1), clear(num1),push(sym), clear(sym), num1 = num2, clear(num2), sym = +
        5.click 3 => again 3

        6.click = => push(num1), clear(num1), push(sym), clear(sym), push(num2), clear(num2), computed
    */

    init() {
        //算出结果
        this.target.equal.onclick = () => {
            if (this.sym) {
                if (this.num2) {
                    this.pushA('num1').clear('num1');
                    this.pushA('sym').clear('sym');
                    this.pushA('num2').clear('num2');
                    this.showData('result', this.expressHandle(this.arr));
                    this.showData('express', this.arr);
                    console.log(this.arr);
                    this.clear('arr');
                }
            } else if (this.num1) {
                this.showData('result', [this.num1]);
                this.clear('num1');
            }
        };

        //输入运算符
        this.target.operator.forEach((element, index) => {
            element.onclick = () => {
                if (this.sym && this.num2) {
                    this.pushA('num1').clear('num1');
                    this.pushA('sym').clear('sym');
                    this.num1 = this.num2;
                    this.clear('num2');
                }
                if (!this.sym && !this.num1) return;
                this.sym = this.target.operator[index].innerHTML;
                this.showData('result', [this.sym]);
            };
        });

        //输入数据
        this.target.num.forEach((element, index) => {
            element.onclick = () => {
                (this.sym && (this.getNum('num2', index), 1)) || this.getNum('num1', index);
            };
        });

        // point;
        this.target.point.onclick = () => {
            (this.sym && (this.getPoint('num2'), 1)) || this.getPoint('num1');
        };

        //persent
        this.target.persent.onclick = () => {
            if (this.sym) {
                if (this.num2) this.persent('num2');
            } else {
                if (this.num1) this.persent('num1');
            }
            //精确度到17后开始不精准
        };

        //清空数据
        this.target.clear.onclick = () => {
            this.showData('result', ['0']);
            this.showData('express', ['']);
            this.clear('arr');
            this.clear('num1');
            this.clear('num2');
            this.clear('sym');
        };
    }

    /**
     * 百分号persent按键进行运算
     * @param {*} num
     * @memberof Calculator
     */
    persent(num) {
        this[num] = this.expressHandle([this[num], '/', '100'])[0];
        this.showData('result', [this[num]]);
    }

    /**
     *  用于小数点point按键获取键值
     * @param {*} num
     * @memberof Calculator
     */
    getPoint(num) {
        if (this[num]) {
            if ((this[num] + '').indexOf('.') == -1) this[num] += '.';
        } else {
            this[num] = '0.';
        }
        this.showData('result', [this.num1]);
    }

    /**
     *  用于num按键获取键值
     * @param {*} num
     * @memberof Calculator
     */
    getNum(num, index) {
        const arr = [];
        this[num] += this.target.num[index].innerHTML;
        (this[num] == '0' && (this.clear(num), arr.push('0'), 1)) || arr.push(this[num]);
        this.showData('result', arr);
    }

    /**
     *
     * @param tar 显示数据的位置 String
     * @param data 需要显示的数据 Array类型
     * @returns undefined
     * @description 把数据显示在页面上tar上
     * @memberof Calculator
     */
    showData(tar, data) {
        this.target[tar].innerHTML = data.join('');
    }

    /**
     *
     * @param {*} str String或者Number都可以
     * @returns undefined
     * @description 把str推入arr
     * @memberof Calculator
     */
    clear(str) {
        if (str == 'arr') {
            this[str].length = 0;
        } else {
            this[str] = '';
        }
    }

    /**
     *
     * @param {*} str String或者Number都可以
     * @returns this
     * @description 把str推入arr
     * @memberof Calculator
     */
    pushA(str) {
        this.arr.push(this[str]);
        return this;
    }

    /**
     *
     * @param {*} arr Array类型 完整表达式的数组
     * @returns Array类型
     * @description 数字和运算符优先级处理
     * @memberof Calculator
     */
    expressHandle(arr) {
        const temp = arr.slice(0, arr.length);
        const first = temp.filter(value => value === '*' || value === '/');
        const second = temp.filter(value => value === '+' || value === '-');
        // console.log(temp);//初始运算式
        while (true) {
            const operator = first.shift() || second.shift();
            if (!operator) break; //跳出
            const index = temp.indexOf(operator);
            const base = this.floatHandle(temp[index - 1], temp[index + 1]);
            const result = this.computed(temp[index - 1], temp[index + 1], temp[index], base);
            if (!Number.isFinite(result)) {
                console.log(temp);
                return ['除数不能为零'];
            }
            temp.splice(index - 1, 3, result + '');
            // console.log(temp);//每次的运算结果
        }
        return temp;
    }

    /**
     *
     * @param {*} a String或者Number都可以
     * @param {*} b String或者Number都可以
     * @returns Number类型
     * @description 浮点数精度处理,只能处理加号减号
     * @memberof Calculator
     */
    /*
        (a + '').indexOf('.')   =>  代表a字符串中有几位整数
        (a + '').length - 1     =>  总共有多少位数字
        相减之下则是小数点后多少位
    */
    floatHandle(a, b) {
        const aIsInt = Number.isInteger(a * 1);
        const bIsInt = Number.isInteger(b * 1);
        const aLen = (a + '').length - 1;
        const bLen = (b + '').length - 1;
        const aFpn = aLen - (aIsInt ? aLen : (a + '').indexOf('.'));
        const bFpn = bLen - (bIsInt ? bLen : (b + '').indexOf('.'));
        return 10 ** (aFpn > bFpn ? aFpn : bFpn);
    }

    /**
     *  浮点乘法，解决乘法运算浮点精度问题
     * @param {*} num1 String或者Number都可以
     * @param {*} num2 String或者Number都可以
     * @returns Number类型
     * @memberof Calculator
     */
    floatMul(num1, num2, m = 0) {
        const check = function(str) {
            if (str.indexOf('.') !== -1) {
                return str.split('.')[1].length;
            } else {
                return 0;
            }
        };
        //num1 * 1 + ''为了去除无意义的0和小数点
        const [s1, s2] = [num1 * 1 + '', num2 * 1 + ''];
        m = check(s1) + check(s2);
        return (s1.replace('.', '') * s2.replace('.', '')) / 10 ** m;
    }

    /**
     *
     * @param {*} String或者Number都可以
     * @param {*} String或者Number都可以
     * @param {*} String  /  *  -  +
     * @param {*} base floatHandle(a, b)的返回值，表示进制数
     * @returns Number类型
     * @description 四则运算
     * @memberof Calculator
     */
    /* 
        base 使用提取公因数
        除法的除数不能为0
    */
    computed(num1, num2, operator, base) {
        switch (operator) {
            case '+':
                return (this.floatMul(num1, base) + this.floatMul(num2, base)) / base;
            case '-':
                return (this.floatMul(num1, base) - this.floatMul(num2, base)) / base;
            case '*':
                return (this.floatMul(num1, base) * this.floatMul(num2, base)) / base ** 2;
            case '/':
                return this.floatMul(num1, base) / this.floatMul(num2, base);
            //not default
        }
    }
}

new Calculator({
    express: document.querySelector('#calculator ul .express'),
    result: document.querySelector('#calculator ul .result'),
    clear: document.querySelector('#calculator ul .clear'),
    persent: document.querySelector('#calculator ul .persent'),
    equal: document.querySelector('#calculator ul .equal'),
    operator: document.querySelectorAll('#calculator ul .operator'),
    num: document.querySelectorAll('#calculator ul .num'),
    point: document.querySelector('#calculator ul .point')
});
