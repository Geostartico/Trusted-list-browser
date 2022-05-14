class Node {
    constructor(el, aNext) {
        this.element = el;
        this.next = aNext;
    }
    getNext() {
        return this.next;
    }
    getElement() {
        return this.element;
    }
    setNext(n) {
        this.next = n;
    }
    setElement(el) {
        this.element = el;
    }
}
//very dumb dumb Set by geo
export class UnorderedSet {
    constructor(buckNum) {
        this.size = 0;
        this.buckets = new Array(buckNum);
        for (let i = 0; i < this.buckets.length; i++) {
            this.buckets[i] = new Node(null, null);
        }
        //this.buckets.forEach((element) => element = new Node<T>(null, null));
    }
    getSize() {
        return this.size;
    }
    getBucket(element) {
        return element.hashCode() % this.buckets.length;
    }
    resize() {
        let nBuck = this.buckets;
        this.buckets = new Array(nBuck.length * 2);
        for (let i = 0; i < this.buckets.length; i++) {
            this.buckets[i] = new Node(null, null);
        }
        this.size = 0;
        nBuck.forEach((node) => {
            while (node.getNext() != null) {
                node = node.getNext();
                this.add(node.getElement());
            }
        });
    }
    find(el) {
        let buck = this.buckets[this.getBucket(el)];
        while (buck.getNext() != null && !buck.getNext().getElement().isEqual(el)) {
            buck = buck.getNext();
        }
        return buck;
    }
    add(el) {
        let buck = this.find(el);
        if (buck.getNext() == null) {
            buck.setNext(new Node(el, null));
            this.size++;
            if (this.size / this.buckets.length > 0.75) {
                this.resize();
            }
        }
    }
    remove(el) {
        let buck = this.find(el);
        if (buck.getNext() != null) {
            buck.setNext(buck.getNext().getNext());
            return true;
        }
        return false;
    }
    has(el) {
        let buck = this.find(el);
        if (buck.getNext() != null) {
            return true;
        }
        return false;
    }
    forEach(fn) {
        this.buckets.forEach((elem) => {
            while (elem.getNext() != null) {
                elem = elem.getNext();
                fn(elem.getElement());
            }
        });
    }
}
/*
class Test implements Settable<Test>{
    num1 : number;
    num2 : number;
    constructor(n1 : number, n2 : number){
        this.num1 = n1;
        this.num2 = n2;
    }

    hashCode() {
        return this.num1 + this.num2;
    }
    isEqual(el: Test) {
        return el.num1 === this.num1 && el.num2 == this.num2;
    }

}


let set = new UnorderedSet<Test>(8);
let t1 = new Test(1, 2);
let t2 = new Test(1, 2);
set.add(t1);
set.add(t2);
for(let i = 0; i < 11; i ++){
    set.add(new Test(3, i));
}
console.log(set.getSize());
console.log(set.has(t2));
console.log(set.has(new Test(4, 5)));
set.remove(t2);
set.forEach((elem) => console.log(elem));
*/ 