import React, { Component } from 'react';
import { Country, Provider, Status, Type } from "../decoder/items";
import { Item } from "../decoder/itemInterface"
import { UnorderedMap } from '../decoder/UnorderedMap';
import { SelectionType } from './Enums';
import Search from './Search';

/**
 * @param filters contain all the entries of the active filter
 * @param onToggle is a callback function to be used when is performed an action o a entry
 */
interface FilterProps {
    filters: UnorderedMap<Country | Type | Status | Provider, SelectionType>;
    onToggle: Function;
}

/**
 * @param filters used to store the Item to be displayed
 * @param filtersType used to manage the states of the entries
 * @param textFilter used to filter the entries
 */
interface FilterState {
    filters: Item[];
    filtersType: SelectionType[];
    textFilter : string;
}

class FilterPane extends Component<FilterProps, FilterState> {

    /**
     * @param props is used to set the state variables correctly
     */
    constructor(props: FilterProps) {  
        super(props);
        this.state = {
            filters: this.props.filters.keys(),
            filtersType: this.props.filters.entries().map((entry) => entry.getValue() ?? SelectionType.NotSelectable),
            textFilter: ""
        };
         
        this.onModifyTextFilter = this.onModifyTextFilter.bind(this);
    }

    /**
     * Each time there is an update the entries have to be recalculate
     */
    componentWillReceiveProps(nextProps: FilterProps) {

        this.setState({
            filters: nextProps.filters.keys(),
            filtersType: nextProps.filters.entries().map((entry) => entry.getValue() ?? SelectionType.NotSelectable),
            textFilter: "",
        });
        
    }

    /**
     * Each time the text in the Search is modified the FilterPane has to be rerendered
     */
    onModifyTextFilter(newTextFilter: string) {

        this.setState({
            textFilter: newTextFilter,
        });

    }


    /**
     * All the necessary entries will be created on the basis of the internal data of the state
     */
    render() {
        return (
          <>
            <div className = 'filtersContainer'>
                <Search 
                    onMod={this.onModifyTextFilter} 
                    textInBox={this.state.textFilter}
                />
                {
                    // loop each value in the array and create a proper div with:
                    //  + checkbox
                    //  + description
                    this.state.filters.map((val: Item, index: number) => {
                        {/* If a filter text is specified and the text in the entry does not contain the string than not render it */}
                        if(this.state.textFilter !== "" && !val.getText().toLowerCase().includes(this.state.textFilter.toLowerCase()))
                            return;
                        return (
                            <div key={val.getText() + index} className='filterEntryContainer'>
                                <label className="switch">
                                <input 
                                    type="checkbox" 
                                    onChange={() => this.state.filtersType[index] !== SelectionType.NotSelectable ? this.props.onToggle(this.state.filters[index]) : undefined}
                                    checked ={this.state.filtersType[index] === SelectionType.Selected}
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
