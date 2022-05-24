import React, { Component } from 'react';
import { Item } from './decoder/itemInterface';
import { IgetView } from "./facade/facade";
import { Country, Provider, Service, Status, Type } from "./decoder/items";

const indentValue: number = 2;

/*
 * Define an indent:
 * 1 - 
 * 2 -
 * 3 -
 */

interface ItemViewerProps {
    viewItems: IgetView;
    items: Item | null; // if null is the first div
    indent: number; // The indent of the item, recursively
}

interface ItemViewerState {  
    expand: boolean;
    marginLeftStyle: string;
    filteredItems: Item[];
}

class ItemViewer extends Component<ItemViewerProps, ItemViewerState> {

    constructor(props: ItemViewerProps) {  
        super(props);
        this.state = {
            expand: false,
            marginLeftStyle : (this.props.indent) + "vw",
            filteredItems: this.filterItems(),
        };

        this.filterItems = this.filterItems.bind(this);
        this.expand = this.expand.bind(this);
    }

    expand(val: Item) {
        //console.log("lool");

        val.expand = !val.expand;
        this.forceUpdate();
        /*
        this.setState({
            expand: !this.state.expand
        });
        */
    }

    filterItems(): Item[] {
        let items: Item[] = [];

        if( this.props.items === null) {
            this.props.viewItems.countries.forEach((val: Item) => {
                //console.log("contry " + val.getText());
                items.push(val);
            })
        }
        else {

            //console.log("Indentazione " + this.props.indent);

            this.props.items.getChildren().forEach((val: Item) => {

                //console.log("Testing this item: " + val.getText());
                switch (this.props.indent) {
                    case 2: 
                        if(!this.props.viewItems.providers.has(val as Provider)) 
                            return;
                    break;
                    case 3: 
                        if(!this.props.viewItems.services.has(val as Service))
                            return;
                    break;
                }

                items.push(val);
                //console.log("something " + val.getText());

            })
            // now I have to filter in function of the items

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
                        {val.expand && 
                            <ItemViewer key={val.getText() + index} viewItems={this.props.viewItems} items={val} indent={this.props.indent + 1}/>
                        }
                    </>
                )
            })}
        </div>
        );
    }
}

export default ItemViewer;

/*

            <div className = 'itemViewer' style={{marginLeft: this.state.marginLeftStyle}}>
                <p>
                    {this.props.item.getText()}
                </p>

                <>
                    {this.props.item.getChildren().forEach((itemChildren) => {
                        console.log("each childre");
                        return(
                            <ItemViewer
                                item={itemChildren}
                                indent={this.props.indent + 1}
                            />
                        )
                    })}
                </>

            </div>
 */
