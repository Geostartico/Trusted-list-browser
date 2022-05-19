export class Node {
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
