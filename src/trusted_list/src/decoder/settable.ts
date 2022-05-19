export interface Settable<T>{
    /**
     * get the hashcode of the object
     */
    hashCode();
    /**
     * checks if this and el correspond. if an object gives different hashcodes for two objects such that obj1.isEqual(obj2) === true the set won't work
     * @param el the object to compare
     */
    isEqual(el : T);
}