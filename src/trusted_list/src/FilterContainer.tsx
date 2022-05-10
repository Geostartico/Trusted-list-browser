import React, { Component } from 'react';
import {FilterType} from './Enums';

interface FilterProps {
     selectedFilter: number;
}

interface FilterState {  
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
                <h1>Qui dovrebbe esserci il filtro per: {FilterType[this.props.selectedFilter]}</h1>
            </div>
          </>
        );

    }

}

export default FilterContainer;
