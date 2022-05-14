//T must implement these methods to be used
//if an object gives different hashcodes for two objects such that obj1.isEqual(obj2) === true the set won't work
export interface Settable<T>{
    hashCode();
    isEqual(el : T);
}
class Node<T>{
    private element : T;
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

//very dumb dumb Set by geo
export class UnorderedSet<T extends Settable<T>>{
    private buckets : Array<Node<T>>;
    private size : number;
    getSize(){
        return this.size;
    }
    private getBucket(element : T){
        return element.hashCode()%this.buckets.length;
    }
    private resize(){
        let nBuck = this.buckets;
        this.buckets = new Array<Node<T>>(nBuck.length * 2);
        for(let i = 0; i < this.buckets.length; i ++){
            this.buckets[i] = new Node<T>(null, null);
        }        this.size = 0;
        nBuck.forEach((node) => 
        {
            while(node.getNext() != null){
                node = node.getNext();
                this.add(node.getElement());
            }
        })
    }
    private find(el : T){
        let buck = this.buckets[this.getBucket(el)];
        while(buck.getNext() != null && !buck.getNext().getElement().isEqual(el)){
            buck = buck.getNext();
        }
        return buck
    }

    constructor(buckNum : number){
        this.size = 0;
        this.buckets = new Array<Node<T>>(buckNum);
        for(let i = 0; i < this.buckets.length; i ++){
            this.buckets[i] = new Node<T>(null, null);
        }
        //this.buckets.forEach((element) => element = new Node<T>(null, null));
    }
    add(el : T){
        let buck = this.find(el);
        if(buck.getNext() == null){
            buck.setNext(new Node<T>(el, null));
            this.size++;
            if(this.size/this.buckets.length > 0.75){
                this.resize()
            }
        }
    }
    remove(el : T){
        let buck = this.find(el);
        if(buck.getNext() != null){
            buck.setNext(buck.getNext().getNext());
            return true;
        }
        return false;
    }
    has(el: T){
        let buck = this.find(el);
        if(buck.getNext() != null){
            return true;
        }
        return false;
    }
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