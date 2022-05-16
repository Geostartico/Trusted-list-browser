/**
 * T must implement these methods to be used in the @see UnorderedSet
 */
export interface Settable<T>{
    /**
     * get the hashcode of the object
     */
    hashCode();
    /**
     * checks if this and el correspond. if an object gives different hashcodes for two objects such that obj1.isEqual(obj2) === true the set won't work
     * @param el the object to compare
     */
    isEqual(el : T);
}
/**
 * linked list node
 */
class Node<T>{
    /**
     * element of the node
     * @private
     */
    private element : T;
    /**
     * next element of the linked list
     * @private
     */
    private next : Node<T>;
    constructor(el : T, aNext : Node<T>){
        this.element = el;
        this.next = aNext;
    }

    getNext(){
        return this.next;
    }

    getElement(){
        return this.element;
    }
    
    setNext(n : Node<T>){
        this.next = n;
    }

    setElement(el : T){
        this.element = el;
    }
}

/**
 * very dumb dumb Set by geo
 */
export class UnorderedSet<T extends Settable<T>>{
    /**
     * buckets of the set
     * @private
     */
    private buckets : Array<Node<T>>;
    /**
     * number of items in the set
     * @private
     */
    private size : number;
    /**
     * get the size
     * @returns th enumber of items
     */
    getSize(){
        return this.size;
    }
    /**
     * get the bucket for the item
     * @param element 
     * @returns the bucket in which elemetn should reside
     */
    private getBucket(element : T){
        return Math.abs(element.hashCode()%this.buckets.length);
    }
    /**
     * doubles the number of buckets
     * @private
     */
    private resize(){
        let nBuck = this.buckets;
        this.buckets = new Array<Node<T>>(nBuck.length * 2);
        for(let i = 0; i < this.buckets.length; i ++){
            this.buckets[i] = new Node<T>(null, null);
        }        
        this.size = 0;
        nBuck.forEach((node) => 
        {
            while(node.getNext() != null){
                node = node.getNext();
                this.add(node.getElement());
            }
        })
    }
    /**
     * 
     * @param el
     * @returns the node previous to the one containing the object or the last node of the bucket it should reside in
     * @private
     */
    private find(el : T){
        let buck = this.buckets[this.getBucket(el)];
        while(buck.getNext() != null && !buck.getNext().getElement().isEqual(el)){
            buck = buck.getNext();
        }
        return buck
    }
    /**
     * constructs the unordered set
     * @param buckNum number of initial buckets
     */
    constructor(buckNum : number){
        this.size = 0;
        this.buckets = new Array<Node<T>>(buckNum);
        for(let i = 0; i < this.buckets.length; i ++){
            this.buckets[i] = new Node<T>(null, null);
        }
        //this.buckets.forEach((element) => element = new Node<T>(null, null));
    }
    /**
     * add the element to the set if it isn't in the set (if needed resizes the set)
     * @param el 
     */
    add(el : T){
        console.log(el);
        let buck = this.find(el);
        if(buck.getNext() == null){
            buck.setNext(new Node<T>(el, null));
            this.size++;
            if(this.size/this.buckets.length > 0.75){
                this.resize()
            }
        }
    }
    /**
     * removes the elemet from the set
     * @param el 
     * @returns true if the element was in the set
     */
    remove(el : T){
        let buck = this.find(el);
        if(buck.getNext() != null){
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
    has(el: T){
        let buck = this.find(el);
        if(buck.getNext() != null){
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
            while(elem.getNext() != null){
                elem = elem.getNext();
                fn(elem.getElement());
            }
        })
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