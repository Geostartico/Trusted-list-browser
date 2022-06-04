/**
 * interface to ensure immutability
 */
export interface Immutable {
    isImmutable() : boolean;
    makeImmutable() : void;
}