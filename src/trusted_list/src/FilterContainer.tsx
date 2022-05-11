import React, { Component } from 'react';
import {FilterTypes} from './Enums';
import FilterCountry from './FilterCountry';
import FilterState from './FilterState';
import FilterType from './FilterType';

interface FilterProps {
     selectedFilter: number;
}

interface FilterStateInerface {  
}

class FilterContainer extends Component<FilterProps, FilterStateInerface> {

    constructor(props: FilterProps) {  
        super(props);
        this.state = {
        };
    }

    render() {

        return (
          <>
            <div className = 'filtersContainer'>
                 
                {this.props.selectedFilter == 0 &&
                    <FilterCountry/>
                }
                {this.props.selectedFilter == 1 &&
                    <FilterType/>
                }
                {this.props.selectedFilter == 2 &&
                    <FilterState/>
                }

            </div>
          </>
        );

    }

}

export default FilterContainer;
