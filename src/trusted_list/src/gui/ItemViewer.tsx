import React, { Component } from 'react';
import { Item } from '../decoder/itemInterface';
import { IgetView } from "../facade/facade";
import { Provider, Service } from "../decoder/items";

/**
 * Define an indent:
 * 1 - Country
 * 2 - Provider
 * 3 - Service
 */

/**
 * @param viewItems This object contain all the information and values to 
 * dispay the filtered items, used primarily by the first container
 * @param This contain all the entries that have to be displayed
 * @param This rapresent the intentation of the component, there is structure for the indentation
 */
interface ItemViewerProps {
    viewItems: IgetView;
    items: Item | null; // if null is the first div
    indent: number; // The indent of the item, recursively
}

/**
 * @param expand used to show or not the inside entries of an entry
 * @param marginLeftStyle used to calculate the indent 
 * @param filteredItems contain all the items that have to be shown, after been properly filtered
 */
interface ItemViewerState {  
    marginLeftStyle: string;
    filteredItems: Item[];
}

/**
 * Recursively render all the entries
 */
class ItemViewer extends Component<ItemViewerProps, ItemViewerState> {

    constructor(props: ItemViewerProps) {  
        super(props);
        this.state = {
            marginLeftStyle : (this.props.indent) + "vw",
            filteredItems: this.filterItems(this.props),
        };

        this.filterItems = this.filterItems.bind(this);
        this.expand = this.expand.bind(this);
    }

    /**
     * Eeach time there is an update the entries have to be filtered again
     */
    UNSAFE_componentWillUpdate(nextProps: ItemViewerProps) {

        this.setState({
            filteredItems: this.filterItems(nextProps),
        });

    }

    /*
     * Function used to toggle the expand variable and than force a new render
     */
    expand(val: Item) {
        val.expand = !val.expand;
        this.forceUpdate();
    }

    /**
     * Create an array with the filtered value in funcion of the arrived props
     */
    filterItems(props: ItemViewerProps): Item[] {
        let items: Item[] = [];

        // If props.items is null mean that this is the Country countries
        if( props.items === null) {
            // So I have to display all the arrived countries from the facade
            props.viewItems.countries.forEach((val: Item) => {
                items.push(val);
            })
        }
        else {

            // otherwise the childrens of the parent container have to be dislayed
            props.items.getChildren().forEach((val: Item) => {

                // use the indent to distinguish
                switch (props.indent) {
                    case 2: 
                        // Check that the children is the the filterd Provider
                        if(!props.viewItems.providers.has(val as Provider)) 
                            return;
                    break;
                    case 3: 
                        // Check that the children is the the filterd Service
                        if(!props.viewItems.services.has(val as Service))
                            return;
                    break;
                }

                items.push(val);
            })
        }

        return items;
    }

    render() {
        return (
        <div className = 'viewerInside' id = {this.props.items === null ? 'firstDivViwer' : ''} style={{marginLeft: this.state.marginLeftStyle}} >
            {this.state.filteredItems.map((val: Item, index: number) => {
                return (
                    <>
                        <button onClick={this.props.indent < 4 ? () => this.expand(val) : undefined} className="buttonViewer" >
                            {val.getText()}
                        </button>
                        {/* recursively render all the childs of this components */}
                        {val.expand && 
                            <ItemViewer key={val.getText() + index.toString()} viewItems={this.props.viewItems} items={val} indent={this.props.indent + 1}/>
                        }
                    </>
                )
            })}
        </div>
        );
    }
}

export default ItemViewer;
