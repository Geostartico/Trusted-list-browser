/**
 * These rapresents all the four possible type of filters
 */
export enum FilterType {
    Country, 
    Type, 
    Status, 
    Provider,
};

/**
 * These are the three possible states of an entry inside the filter
 */
export enum SelectionType {
    Selectable,
    Selected,
    NotSelectable,
};
