export class Entry<K, V>{
    /**
     * key of the entry, can't be null
     * @private
     */
    private key : K;
    /**
     * value of the entry, can be null
     * @private
     */
    private value : V | null;
    /**
     * @param aKey key of the entry, not null
     * @param aValue value of the entry, can be null
     */
    constructor(aKey : K, aValue : V | null){
        this.key = aKey;
        this.value = aValue;
    }
    /**
     * 
     * @returns the key of the entry
     */
    getKey() : K{
        return this.key;
    }
    /**
     * 
     * @returns the value of the entry
     */
    getValue() : V | null{
        return this.value;
    }
    /**
     * 
     * @param aValue updates the value of the entry to aValue
     */
    setValue(aValue : V | null) : void{
        this.value = aValue;
    }
}