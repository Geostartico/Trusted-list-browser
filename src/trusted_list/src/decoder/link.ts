export class Node<T>{
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
