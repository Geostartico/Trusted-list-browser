import { Node } from "./link";
import { Entry } from "./entry";
import { Settable } from "./settable";
import { UnorderedSet } from "./UnorderedSet";

export class UnorderedMap<K extends Settable<K>,V>{
    /**
     * buckets of the map
     * @private
     */
    private buckets : Array<Node<Entry<K, V>>>;
    /**
     * number of items in the map
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
    private getBucket(k : K) : number{
        return Math.abs(k.hashCode()%(this.buckets.length));
    }

    /**
     * doubles the number of buckets
     * @private
     */
    private resize(){
        let nBuck = this.buckets;
        //initialises the new buckets
        this.buckets = new Array<Node<Entry<K,V>>>(nBuck.length * 2);
        for(let i = 0; i < this.buckets.length; i ++){
            this.buckets[i] = new Node<Entry<K, V>>(null, null);
        }
        //set to zero so that the .set works correctly
        this.size = 0;
        //iterates over every element of the old buckets and inserts it in the new buckets
        nBuck.forEach((node : Node<Entry<K,V>>) =>
        {
            let nextNode : Node<Entry<K,V>> | null = node.getNext();
            while(nextNode !== null){
                node = nextNode;
                let l : Entry<K,V> | null = node.getElement();
                if(l !== null){
                    this.set(l.getKey(), l.getValue());
                }
                nextNode = node.getNext();
            }
        })
    }
    /**
     * method to find the correct node for the key
     * @param k the key to find
     * @returns the node previous to the correct one or the last one of the bucket were the entry should be contained
     */
    private find(k : K) : Node<Entry<K,V>>{
        let buck : Node<Entry<K,V>> = this.buckets[this.getBucket(k)];
        let nextBuck : Node<Entry<K,V>> | null = buck.getNext();
        while(nextBuck !== null && !nextBuck.getElement()?.getKey()?.isEqual(k)){
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
            throw new Error("the dimension of the map must be strictly positive");
        }
        this.size = 0;
        //initialises the buckets
        this.buckets = new Array<Node<Entry<K,V>>>(buckNum);
        for(let i = 0; i < this.buckets.length; i ++){
            this.buckets[i] = new Node<Entry<K,V>>(null, null);
        }
    }
    /**
     * insterts the entry (k,v) if not contained, or updates the entry with key k with the value v
     * @param k the key of the entry to find or to create if not contained
     * @param v the value of the entry to update or insert
     */
    set(k : K, v : V | null ){
        let buck : Node<Entry<K,V>> = this.find(k);
        let nextBuck : Node<Entry<K,V>> | null= buck.getNext(); 
        //the entry wasn't contained
        if(nextBuck === null){
            buck.setNext(new Node<Entry<K, V>>(new Entry(k, v), null));
            this.size++;
            if(this.size/this.buckets.length > 0.75){
                this.resize()
            }
        }
        //updated the value of the entry with the given value
        else{
            nextBuck.getElement()?.setValue(v);
        }
    }
    /**
     * removes the entry with key k if contained
     * @param k the key of the entry to remove
     * @returns true if the entry was contained
     */
    remove(k : K): boolean{
        let buck : Node<Entry<K, V>>= this.find(k);
        let nextBuck : Node<Entry<K,V>> | null = buck.getNext();
        //the entry was contained
        if(nextBuck !== null){
            buck.setNext(nextBuck.getNext());
            this.size--;
            return true;
        }
        //the entry wasn't contained
        return false;
    }
    /**
     * verify if the entry with key k exists
     * @param k the key of the entry to look for
     * @returns true if the entry with key k exists
     */
    has(k : K) : boolean{
        let buck = this.find(k);
        //the entry exists
        if(buck.getNext() !== null){
            return true;
        }
        //the entry wasn't contained
        return false;
    }
    /**
     * get the value of the entry with key k
     * @param k key of the entry to look for
     * @returns the value of the entry or null if the entry doesn't exist
     */
    get(k : K) : V | null{
        let buck = this.find(k);
        let nextBuck : Node<Entry<K,V>> | null = buck.getNext();
        //the entry exists
        if(nextBuck !== null){
            return nextBuck.getElement()?.getValue() ?? null;
        }
        //the entry doesn't exist
        return null;
    }
    /**
     * iterates over the map calling the callback function
     * @param fn callback function that accepts as parameters a V value and a K value (in this order)
     */
    forEach(fn: Function) {
        this.buckets.forEach((elem : Node<Entry<K,V>>) => {
            let nextElem : Node<Entry<K,V>> | null = elem.getNext();
            while(nextElem !== null){
                elem = nextElem;
                fn(elem.getElement()?.getValue(), elem?.getElement()?.getKey());
                nextElem = elem.getNext();
            }
        })
    }

    /**
     * @returns Array containing all the entries of the set
     */
    entries(): Array<Entry<K, V>> {
        let toReturn: Array<Entry<K, V>> = new Array<Entry<K, V>>();
        this.forEach((v : V, k : K) => toReturn.push(new Entry<K, V>(k, v)));
        return toReturn;
    }

    /**
     * @returns Array containing all the keys of the map
     */
    keys(): Array<K> {
        let toReturn: Array<K> = new Array<K>();
        this.forEach((v : V, k : K) => toReturn.push(k));
        return toReturn;
    }
    /**
     * 
     * @returns a copy of the map
     */
    copy() : UnorderedMap<K,V>{
        let ret : UnorderedMap<K,V> = new UnorderedMap<K,V>(this.buckets.length);
        this.forEach((val : V, key : K) => ret.set(key, val));
        return ret
    }


    /**
    * Intersects a variable number of maps
    * @param maps: comma separated map {@link UnorderedMap} maps
    * @returns: {@link UnorderedSet} containing keys commmon to all maps
    * @throws {@link Error}
    * Thrown if one of the input maps is null
    */
    static mapIntersect<K extends Settable<K>>(maps: Array<UnorderedMap<K, number> | null | undefined>): UnorderedSet<K>{

        let ret = new UnorderedSet<K>(10);

        // Return empty map if there are no input maps
        if(maps.length < 1)
            return ret;

        // Throw error on null map and find the shortest map for faster search
        let shortest_map = maps[0];
        if(shortest_map === undefined || shortest_map === null)
            throw new Error("Error, intersect on null maps");

        for(let map of maps){
            if(map === undefined || map === null)
                throw new Error("Error, intersect on null maps");

            if(map.getSize() < shortest_map.getSize())
                shortest_map = map;
        }

        // If there is just one map, return a copy of it
        if(maps.length === 1){
            for(let service of shortest_map.keys())
                ret.add(service);
            return ret;
        }

        // Search for each filtered service of shortest map in other filtering maps
        let all_maps_have_service: boolean;
        for(let service of shortest_map.keys()){
            all_maps_have_service = true;
            for(let map of maps){
                if(map === undefined || map === null)
                    throw new Error("Error, intersect on null maps");
                if(map === shortest_map)
                    continue;
                if(!map.has(service)){
                    all_maps_have_service = false;
                    break;
                }
            }
            if(all_maps_have_service)
                ret.add(service);
        }

        return ret;
    }
}

// STATIC FUNCTIONS //

 /**
  * Increases the numeric value associated to a key in an {@link UnorderedMap} object, if not present, it inserts it (with the value 1)
  * @param key: value to update
  * @param map: map
  * @throws {@link error}
  * Thrown if the associated value to the key is null or does not exist in the map
  */
export function mapIncreaseOrInsert<K extends Settable<K>>(key: K, map: UnorderedMap<K, number>){
    if(map.has(key)){
        let value: number|null = map.get(key);
        if(value === null || value === undefined)
            throw new Error("Missing or null value in map associated with input key");
        map.set(key, value+1);
    }
    else
        map.set(key, 1);
}

 /**
  * Decreases the numeric value associated to a key in an {@link UnorderedMap} object, if the value drops to 0, it removes the entry
  * The key must be in the map, otherwise an exception will be thrown
  * @param key: key to remove
  * @param map: map containing the key to be removed
  * @throws @link{Error}
  * Thrown if the key is not inserted in the map
  */
export function mapDecreaseOrRemove<K extends Settable<K>>(key: K, map: UnorderedMap<K, number>){
    if(!map.has(key))
        throw new Error("Trying to remove an key that does not exist");
    let value: number|null = map.get(key);
    if(value === null || value === undefined)
        throw new Error("Null value in map associated with input key");
    else if(value > 1)
        map.set(key, value-1);
    else
        map.remove(key);
}
