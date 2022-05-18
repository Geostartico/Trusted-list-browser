import { Node } from "./link.js";
import { Entry } from "./entry.js";
export class UnorderedMap {
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
    getBucket(k) {
        return Math.abs(k.hashCode() % this.buckets.length);
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
                this.set(node.getElement().getKey(), node.getElement().getValue());
            }
        });
    }
    /**
     *
     * @param el
     * @returns the node previous to the one containing the object or the last node of the bucket it should reside in
     * @private
     */
    find(k) {
        let buck = this.buckets[this.getBucket(k)];
        while (buck.getNext() != null && !buck.getNext().getElement().getKey().isEqual(k)) {
            buck = buck.getNext();
        }
        return buck;
    }
    /**
     * add the element to the set if it isn't in the set (if needed resizes the set)
     * @param el
     */
    set(k, v) {
        let buck = this.find(k);
        if (buck.getNext() == null) {
            buck.setNext(new Node(new Entry(k, v), null));
            this.size++;
            if (this.size / this.buckets.length > 0.75) {
                this.resize();
            }
        }
        else {
            buck.getNext().getElement().setValue(v);
        }
    }
    /**
     * removes the elemet from the set
     * @param el
     * @returns true if the element was in the set
     */
    remove(k) {
        let buck = this.find(k);
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
    has(k) {
        let buck = this.find(k);
        if (buck.getNext() != null) {
            return true;
        }
        return false;
    }
    get(k) {
        let buck = this.find(k);
        if (buck.getNext() != null) {
            return buck.getNext().getElement().getValue();
        }
        return null;
    }
    /**
     * iterates over the set calling the given callback function
     * @param fn callback function taking one parameter
     */
    forEach(fn) {
        this.buckets.forEach((elem) => {
            while (elem.getNext() != null) {
                elem = elem.getNext();
                fn(elem.getElement().getValue(), elem.getElement().getKey());
            }
        });
    }
    /**
     * @returns Array containing all values of the set
     */
    values() {
        let toReturn = new Array();
        this.forEach((v, k) => toReturn.push(new Entry(k, v)));
        return toReturn;
    }
}
