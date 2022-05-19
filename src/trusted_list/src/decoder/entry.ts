export class Entry<K, V>{
    private key : K;
    private value : V;
    constructor(aKey : K, aValue : V){
        this.key = aKey;
        this.value = aValue;
    }
    getKey(){
        return this.key;
    }
    getValue(){
        return this.value;
    }
    setValue(aValue : V){
        this.value = aValue;
    }
}