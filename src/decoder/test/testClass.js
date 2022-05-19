export class Test {
    constructor(n1, n2) {
        this.num1 = n1;
        this.num2 = n2;
    }
    hashCode() {
        return this.num1 + this.num2;
    }
    isEqual(el) {
        return el.num1 === this.num1 && el.num2 == this.num2;
    }
}
