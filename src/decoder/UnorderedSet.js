import { Node } from "./node.js";
/**
 * T must implement these methods to be used in the @see UnorderedSet
 */
/**
 * linked list node
 */
/**
 * very dumb dumb Set by geo
 */
export class UnorderedSet {
    /**
     * constructs the unordered set
     * @param buckNum number of initial buckets
     */
    constructor(buckNum) {
        this.size = 0;
        this.buckets = new Array(buckNum);
        for (let i = 0; i < this.buckets.length; i++) {
            this.buckets[i] = new Node(null, null);
        }
        //this.buckets.forEach((element) => element = new Node<T>(null, null));
    }
    /**
     * get the size
     * @returns th enumber of items
     */
    getSize() {
        return this.size;
    }
    /**
     * get the bucket for the item
     * @param element
     * @returns the bucket in which elemetn should reside
     */
    getBucket(element) {
        return Math.abs(element.hashCode() % this.buckets.length);
    }
    /**
     * doubles the number of buckets
     * @private
     */
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
    /**
     *
     * @param el
     * @returns the node previous to the one containing the object or the last node of the bucket it should reside in
     * @private
     */
    find(el) {
        let buck = this.buckets[this.getBucket(el)];
        while (buck.getNext() != null && !buck.getNext().getElement().isEqual(el)) {
            buck = buck.getNext();
        }
        return buck;
    }
    /**
     * add the element to the set if it isn't in the set (if needed resizes the set)
     * @param el
     */
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
    /**
     * removes the elemet from the set
     * @param el
     * @returns true if the element was in the set
     */
    remove(el) {
        let buck = this.find(el);
        if (buck.getNext() != null) {
            buck.setNext(buck.getNext().getNext());
            this.size--;
            return true;
        }
        return false;
    }
    /**
     *
     * @param el
     * @returns true if el was in the set
     */
    has(el) {
        let buck = this.find(el);
        if (buck.getNext() != null) {
            return true;
        }
        return false;
    }
    /**
     * iterates over the set calling the given callback function
     * @param fn callback function taking one parameter
     */
    forEach(fn) {
        this.buckets.forEach((elem) => {
            while (elem.getNext() != null) {
                elem = elem.getNext();
                fn(elem.getElement());
            }
        });
    }
    /**
     * @returns Array containing all values of the set
     */
    values() {
        let toReturn;
        this.forEach((item) => toReturn.push(item));
        return toReturn;
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
