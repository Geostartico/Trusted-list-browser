import { Node } from "./node.js";
import { Entry } from "./entry.js";
import { Settable } from "./settable.js";

export class UnorderedMap<K extends Settable<K>,V>{
     /**
     * buckets of the set
     * @private
     */
      private buckets : Array<Node<Entry<K, V>>>;
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
      private getBucket(k : K){
          return Math.abs(k.hashCode()%this.buckets.length);
      }
      /**
       * doubles the number of buckets
       * @private
       */
      private resize(){
          let nBuck = this.buckets;
          this.buckets = new Array<Node<Entry<K,V>>>(nBuck.length * 2);
          for(let i = 0; i < this.buckets.length; i ++){
              this.buckets[i] = new Node<Entry<K, V>>(null, null);
          }
          this.size = 0;
          nBuck.forEach((node) =>
          {
              while(node.getNext() != null){
                  node = node.getNext();
                  this.set(node.getElement().getKey(), node.getElement().getValue());
              }
          })
      }
      /**
       *
       * @param el
       * @returns the node previous to the one containing the object or the last node of the bucket it should reside in
       * @private
       */
      private find(k : K){
          let buck = this.buckets[this.getBucket(k)];
          while(buck.getNext() != null && !buck.getNext().getElement().getKey().isEqual(k)){
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
          this.buckets = new Array<Node<Entry<K,V>>>(buckNum);
          for(let i = 0; i < this.buckets.length; i ++){
              this.buckets[i] = new Node<Entry<K,V>>(null, null);
          }
          //this.buckets.forEach((element) => element = new Node<T>(null, null));
      }
      /**
       * add the element to the set if it isn't in the set (if needed resizes the set)
       * @param el
       */
      set(k : K, v : V){
          let buck = this.find(k);
          if(buck.getNext() == null){
              buck.setNext(new Node<Entry<K, V>>(new Entry(k, v), null));
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
      remove(k : K){
          let buck = this.find(k);
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
      has(k : K){
          let buck = this.find(k);
          if(buck.getNext() != null){
              return true;
          }
          return false;
      }
      /**
       * iterates over the set calling the given callback function
       * @param fn callback function taking one parameter
       */
      forEach(fn: Function) {
          this.buckets.forEach((elem) => {
              while(elem.getNext() != null){
                  elem = elem.getNext();
                  fn(elem.getElement().getValue(), elem.getElement().getKey());
              }
          })
      }
  
      /**
       * @returns Array containing all values of the set
       */
      values(): Array<Entry<K, V>> {
          let toReturn: Array<Entry<K, V>> = new Array<Entry<K, V>>();
          this.forEach((v : V, k : K) => toReturn.push(new Entry<K, V>(k, v)));
          return toReturn;
      }
}