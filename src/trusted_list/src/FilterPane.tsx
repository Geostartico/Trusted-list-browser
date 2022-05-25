import React, { Component } from 'react';
import { Country, Provider, Service, Status, Type } from "./decoder/items";
import{ Item } from "./decoder/itemInterface"
import {UnorderedMap} from './decoder/UnorderedMap';
import {SelectionType} from './Enums';

interface FilterProps {
    filters: UnorderedMap<Country | Type | Status | Provider, SelectionType>;
    onToggle: Function;
}

interface FilterState {
    filters: Item[];
    filtersType: SelectionType[];
}

class FilterPane extends Component<FilterProps, FilterState> {

    constructor(props: FilterProps) {  
        super(props);
        this.state = {
            filters: this.props.filters.keys(),
            filtersType: this.props.filters.entries().map((entry) => entry.getValue() ?? SelectionType.NotSelectable),
        };
        console.log(this.state.filters);
    }

    componentWillReceiveProps(nextProps: FilterProps) {

        this.setState({
            filters: nextProps.filters.keys(),
            filtersType: nextProps.filters.entries().map((entry) => entry.getValue() ?? SelectionType.NotSelectable),
        });
        
    }


    render() {
        return (
          <>
            <div className = 'filtersContainer'>

                {
                    this.state.filters.map((val: Item, index: number) => {
                        return (
                            <div key={val.getText() + index} className='filterEntryContainer'>
                                <label className="switch">
                                <input 
                                    type="checkbox" 
                                    onChange={() => this.state.filtersType[index] !== SelectionType.NotSelectable ? this.props.onToggle(this.state.filters[index]) : undefined}
                                    checked ={this.state.filtersType[index] == SelectionType.Selected}
                                />
                                    <span className={"slider" + (this.state.filtersType[index] === SelectionType.NotSelectable ? ' NotSelectable' : '')} >
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