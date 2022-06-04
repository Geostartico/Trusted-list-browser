export class Node<T>{
    /**
     * element of the node
     * @private
     */
    private element : T | null;
    /**
     * next element of the linked list
     * @private
     */
    private next : Node<T> | null;
    constructor(el : T | null, aNext : Node<T> | null){
        this.element = el;
        this.next = aNext;
    }

    getNext() : Node<T> | null{
        return this.next;
    }

    getElement() : T | null{
        return this.element;
    }

    setNext(n : Node<T> | null){
        this.next = n;
    }

    setElement(el : T | null){
        this.element = el;
    }
}
