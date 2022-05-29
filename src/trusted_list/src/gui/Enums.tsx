/**
 * These rapresents all the four possible type of filters
 */
export enum FilterType {
    Country, //= 'Country', // id: 0
    Type, //= 'Type', // id: 0
    Status, // = 'Status', // id: 0
    Provider, // = 'Provider', // id: 0
};

/**
 * These are the three possible states of an entry inside the filter
 */
export enum SelectionType {
    Selectable,
    Selected,
    NotSelectable,
};
