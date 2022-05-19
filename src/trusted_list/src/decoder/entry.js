export class Entry {
    constructor(aKey, aValue) {
        this.key = aKey;
        this.value = aValue;
    }
    getKey() {
        return this.key;
    }
    getValue() {
        return this.value;
    }
    setValue(aValue) {
        this.value = aValue;
    }
}
