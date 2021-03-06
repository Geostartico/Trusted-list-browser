import {Node} from "./link";
import {Settable} from "./settable";
/**
 * T must implement these methods to be used in the @see UnorderedSet
 */

/**
 * linked list node
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
        return Math.abs(element.hashCode()%(this.buckets.length));
    }
    /**
     * doubles the number of buckets
     * @private
     */
    private resize(){
        let nBuck = this.buckets;
        //doubles the buckets
        this.buckets = new Array<Node<T>>(nBuck.length * 2);
        //initialises the buckets
        for(let i = 0; i < this.buckets.length; i ++){
            this.buckets[i] = new Node<T>(null, null);
        }
        //so that .add method works correctly
        this.size = 0;
        //for every bucket it inserts the objects in the new buckets
        nBuck.forEach((node : Node<T>) =>
        {
            let nextElem : Node<T> | null = node.getNext();
            while(nextElem !== null){
                node = nextElem;
                let el : T | null = node?.getElement();
                if(el !== null){
                    this.add(el);
                }
                nextElem = node.getNext();
            }
        })
    }
    /**
     *
     * @param el
     * @returns the node previous to the one containing the object or the last node of the bucket it should reside in
     * @private
     */
    private find(el : T) : Node<T>{
        let buck : Node<T>= this.buckets[this.getBucket(el)];
        let nextBuck : Node<T> | null= buck.getNext();
        while(nextBuck !== null && !nextBuck.getElement()?.isEqual(el)){
            buck = nextBuck;
            nextBuck = buck.getNext();
        }
        return buck
    }
    /**
     * constructs the unordered set
     * @param buckNum number of initial buckets
     */
    constructor(buckNum : number){
        if(buckNum <= 0){
            throw new Error("dimension of the set must be strictly positive");
        }
        this.size = 0;
        this.buckets = new Array<Node<T>>(buckNum);
        //initialises the buckets
        for(let i = 0; i < this.buckets.length; i ++){
            this.buckets[i] = new Node<T>(null, null);
        }
    }
    /**
     * add the element to the set if it isn't in the set (if needed resizes the set)
     * @param el can't be null
     */
    add(el : T){
        let buck = this.find(el);
        //the element isn't already in the set
        if(buck.getNext() === null){
            buck.setNext(new Node<T>(el, null));
            this.size++;
            //if the buckets get too crowded the hashset is resized
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
        //the element is contained
        if(buck.getNext() !== null){
            buck.setNext(buck.getNext()?.getNext() ?? null);
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
        //the object is contained
        if(buck.getNext() !== null){
            return true;
        }
        return false;
    }
    
    /**
     * iterates over the set calling the given callback function
     * @param fn callback function taking one parameter
     */
    forEach(fn: Function) {
        this.buckets.forEach((elem : Node<T>) => {
            let nextElem : Node<T> | null = elem.getNext();
            while(nextElem !== null){
                elem = nextElem;
                fn(elem.getElement());
                nextElem = elem.getNext()
            }
        })
    }

    /**
     * @returns Array containing all values of the set
     */
    values(): Array<T> {
        let toReturn: Array<T> = new Array<T>();
        this.forEach((item: T) => toReturn.push(item));
        return toReturn;
    }
    /**
     * 
     * @returns a copy o the set
     */
    copy() : UnorderedSet<T>{
        let ret : UnorderedSet<T> = new UnorderedSet<T>(this.buckets.length);
        this.forEach((elem : T) => ret.add(elem));
        return ret
    }
}