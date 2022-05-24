import React, { Component, useEffect, useState } from 'react';
import Header from './Header';
import Viewer from './Viewer';
import FilterContainer from './FilterContainer';
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import {Facade} from './facade/facade';
import { UnorderedSet } from './decoder/UnorderedSet';
import { Country, Provider, Service, Status, Type } from "./decoder/items";
import { Item } from "./decoder/itemInterface";
import { FilterType } from "./Enums";


interface TrustListViewerProps {
    appTitle: string;
}

interface TrustListViewerState {
    activeFilter: FilterType;
    facade: Facade;
    activeFilterItems: Item[]
}

class TrustListViewer extends Component<TrustListViewerProps, TrustListViewerState> {

    constructor(props: TrustListViewerProps) {
        super(props);
        this.state = {
            activeFilter: FilterType.Country,
            facade: new Facade(),
            activeFilterItems: [],
        };

        this.onChangeFilter = this.onChangeFilter.bind(this);
        this.getFilters = this.getFilters.bind(this);
    }

    onChangeFilter(selectedFilter: FilterType){
        this.setState({
            activeFilter: selectedFilter,
            activeFilterItems: this.getFilters(selectedFilter),
        });
    }


    // Func to update the viewer

    // func callback the filer
    
    getFilters(filterType: FilterType): Item[] {

        let filters: Item[] = [];
        let filtersSet: UnorderedSet<Country | Type | Status | Provider>;

        switch(filterType) {

            case FilterType.Country:
                filtersSet = this.state.facade.getSelectableCountries();
            break;
            case FilterType.State:
                filtersSet = this.state.facade.getSelectableStatus();
            break;
            case FilterType.Provider:
                filtersSet = this.state.facade.getSelectableProviders();
            break;
            case FilterType.Type:
                filtersSet = this.state.facade.getSelectableTypes();
            break;

            default:
                return [];
        }


        filtersSet.forEach((val: Item) => {
            filters.push(val);
        })

        return filters;
    }

    render() {
        return (
          <>
            <header>
                <Header
                    title = {this.props.appTitle}
                    onChangeFilter = {this.onChangeFilter}
                    selectedFilter = {this.state.activeFilter}
                />
            </header>
            <body>

                <Allotment onVisibleChange={() => this.forceUpdate()}>
                    <Allotment.Pane minSize={200}>
                        <Viewer 
                            viewItems={this.state.facade.getView()} // for now update each render
                        />
                    </Allotment.Pane>
                    <Allotment.Pane snap>
                        <FilterContainer
                            selectedFilter = {this.state.activeFilter}
                            filters = {this.state.activeFilterItems}
                        />
                    </Allotment.Pane>
                </Allotment>

            </body>
          </>
        );

    }

}

export default TrustListViewer;

/*

                <div className='mainContainer'>
                    <Viewer />
                    <FilterContainer
                        selectedFilter = {this.state.activeFilter}
                    />
                </div>

 * */
