export class Entry<K, V>{
    private key : K;
    private value : V | null;
    constructor(aKey : K, aValue : V | null){
        this.key = aKey;
        this.value = aValue;
    }
    getKey() : K{
        return this.key;
    }
    getValue() : V | null{
        return this.value;
    }
    setValue(aValue : V | null) : void{
        this.value = aValue;
    }
}