import React, { Component } from 'react';
import FilterPane from './FilterPane';
import { Country, Provider, Service, Status, Type } from "./decoder/items";
import {FilterType, SelectionType} from './Enums';
import {UnorderedMap} from './decoder/UnorderedMap';

interface FilterProps {
    selectedFilter: FilterType;
    filters: UnorderedMap<Country | Type | Status | Provider, SelectionType>;
    onToggle: Function;
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
                        onToggle = {this.props.onToggle}
                   /> 

            </div>
          </>
        );

    }

}

export default FilterContainer;
