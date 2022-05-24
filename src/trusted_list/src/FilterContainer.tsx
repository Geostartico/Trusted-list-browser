import React, { Component } from 'react';
import FilterPane from './FilterPane';
import { UnorderedSet } from './decoder/UnorderedSet';
import { Country, Provider, Service, Status, Type } from "./decoder/items";
import {FilterType} from './Enums';
import { Item } from "./decoder/itemInterface";

interface FilterProps {
    selectedFilter: FilterType;
    filters: Item[];
}

interface FilterState{  
}

class FilterContainer extends Component<FilterProps, FilterState> {

    constructor(props: FilterProps) {  
        super(props);
        this.state = {
        };
    }

    render() {

        return (
          <>
            <div className = 'filtersContainer'>
                 
                   <FilterPane
                        filters= {this.props.filters}
                   /> 

            </div>
          </>
        );

    }

}

export default FilterContainer;
