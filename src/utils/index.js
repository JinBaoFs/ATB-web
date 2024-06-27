import * as math from "mathjs"
import BigNumber from "bignumber.js";

export function calculate(type,num1,num2){
    let val1 = new BigNumber(num1)
    let val2 = new BigNumber(num2)
    let str = 0
    switch(type){
        case '+':
            // str = math.format(math.add(num1,num2),{precision: 14})
            str = (val1.plus(val2)).toString(10)
        break;
        case '-':
            // str = math.format(math.subtract(num1,num2),{precision: 14})
            str = (val1.minus(val2)).toString(10)
        break;
        case '*':
            // str = math.format(math.multiply(num1,num2),{precision: 14})
            str = (val1.times(val2)).toString(10)
        break;
        case '%':
            // str = math.format(math.divide(num1,num2),{precision: 14})
            str = (val1.dividedBy(val2)).toString(10)
        default:
    }
    return str
}
