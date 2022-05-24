import React, { Component } from 'react';
import { UnorderedSet } from './decoder/UnorderedSet';
import { Country, Provider, Service, Status, Type } from "./decoder/items";
import{ Item } from "./decoder/itemInterface"

interface FilterProps {
    filters: Item[];
    //onAdd: Function;
    //onRemove: Function;
}

interface FilterState{  
    //filters: Item[];
}

class FilterPane extends Component<FilterProps, FilterState> {

    constructor(props: FilterProps) {  
        super(props);
        this.state = {
        };

    this.props.filters.forEach((val: Item) => {
        console.log("filter" + val.getText());
    })

}


    render() {

        return (
          <>
            <div className = 'filtersContainer'>

                {
                    this.props.filters.map((val: Item, index: number) => {
                        return (
                            <div className='filterEntryContainer'>
                                <label className="switch">
                                    <input type="checkbox"/>
                                    <span className="slider">
                                    </span>
                                </label>
                                <p className='filterEntryText'>{val.getText()}</p>
                            </div>
                        )
                    })
                }
            </div>
          </>
        );

    }

}

export default FilterPane;
