import { UnorderedSet } from "./UnorderedSet";

/**
 * every item given to the front-end must implement this interface 
 */
export interface Item{
    /**
     * @returns the brief text description of the item
     */
    getText() : string;
    /**
     * @returns the items hierarchically below the item
     */
    getChildren() : Array<any>;
    getServices() : UnorderedSet<any>;
    /**
     * used by gui to check if item shows children
     */
    expand?: boolean;
}
