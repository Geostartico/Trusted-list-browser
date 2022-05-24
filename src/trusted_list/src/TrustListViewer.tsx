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
import { FilterType, SelectionType } from "./Enums";
import { Settable } from './decoder/settable';
import {UnorderedMap} from './decoder/UnorderedMap';

/*
class EntryFilter<T extends Settable<T>> implements Settable<EntryFilter<T>> {

    value: T;
    selected: boolean;

    constructor(value: T) {
        this.value = value;
        this.selected = false;
    }

    isEqual(entry: EntryFilter<T>): boolean {
        return this.value.isEqual(entry.value);
    }

    hashCode(): number {
        return this.value.hashCode();
    }
}
*/

interface TrustListViewerProps {
    appTitle: string;
}

interface TrustListViewerState {
    activeFilter: FilterType;
    facade: Facade;
    activeFilterItems: UnorderedMap<Country | Type | Status | Provider, SelectionType> | null;
}

class TrustListViewer extends Component<TrustListViewerProps, TrustListViewerState> {

    countryEntrieFilter: UnorderedMap<Country, SelectionType>;
    typeEntrieFilter: UnorderedMap<Type, SelectionType>;
    stateEntrieFilter: UnorderedMap<Status, SelectionType>;
    providerEntrieFilter: UnorderedMap<Provider, SelectionType>;

    constructor(props: TrustListViewerProps) {
        super(props);
        this.state = {
            activeFilter: FilterType.Country,
            facade: new Facade(),
            activeFilterItems: null,
        };

        this.onChangeFilter = this.onChangeFilter.bind(this);
        this.createEntryFilterSet = this.createEntryFilterSet.bind(this);
        this.onToggle = this.onToggle.bind(this);

        // Set up All the Set for the Filter
        this.countryEntrieFilter = this.createEntryFilterSet(this.state.facade.getSelectableCountries());
        this.typeEntrieFilter = this.createEntryFilterSet(this.state.facade.getSelectableTypes());
        this.stateEntrieFilter = this.createEntryFilterSet(this.state.facade.getSelectableStatus());
        this.providerEntrieFilter = this.createEntryFilterSet(this.state.facade.getSelectableProviders());
    }

    createEntryFilterSet<T extends Settable<T>, Item>(map: UnorderedSet<T>): UnorderedMap<T, SelectionType> {
        let newMap: UnorderedMap<T, SelectionType> = new UnorderedMap(10);

        map.forEach((val: T) => {
            newMap.set(val, SelectionType.Selectable);
        });

       return newMap;
    }

    // TODO MAKE ALL THE STUFF IN THE ITEMSSS
    onToggle(item : Country | Type | Status | Provider) {

        console.log(item);
        let map: UnorderedMap<Country | Type | Status | Provider, SelectionType>;

        switch(this.state.activeFilter) {
            case FilterType.Country:
                map = this.countryEntrieFilter;
            break;
            case FilterType.State:
                map = this.stateEntrieFilter;
            break;
            case FilterType.Provider:
                map = this.providerEntrieFilter;
            break;
            case FilterType.Type:
                map = this.typeEntrieFilter;
            break;
        }

        if(map.get(item) == SelectionType.Selectable) {
            map.set(item, SelectionType.Selected)
            console.log("selected ", item.getText())
        }
        else {
            map.set(item, SelectionType.Selectable)
            console.log("deselected ", item.getText())
        }

        map.get(item) == SelectionType.Selected ? this.state.facade.updateAdd(item) : this.state.facade.updateRemove(item);
        this.onChangeFilter(this.state.activeFilter);
    }

    // func callback the filer
    
    onChangeFilter(selectedFilter: FilterType){

        let filtersSet: UnorderedSet<Country | Type | Status | Provider>;
        let map: UnorderedMap<Country | Type | Status | Provider, SelectionType>;

        switch(selectedFilter) {
            case FilterType.Country:
                filtersSet = this.state.facade.getSelectableCountries();
                map = this.countryEntrieFilter;
            break;
            case FilterType.State:
                filtersSet = this.state.facade.getSelectableStatus();
                map = this.stateEntrieFilter;
            break;
            case FilterType.Provider:
                filtersSet = this.state.facade.getSelectableProviders();
                map = this.providerEntrieFilter;
            break;
            case FilterType.Type:
                filtersSet = this.state.facade.getSelectableTypes();
                map = this.typeEntrieFilter;
            break;
        }

        map.forEach((val: SelectionType, item: Country | Type | Status | Provider) => {
            // Make unselectabel only the one are not more in the set of the selectable
            if (!filtersSet.has(item)) {
                map.set(item, SelectionType.NotSelectable);
            } 
        });

        this.setState({
            activeFilter: selectedFilter,
            activeFilterItems: map,
        });
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
                        {this.state.activeFilterItems !== null ?
                            <FilterContainer
                                selectedFilter = {this.state.activeFilter}
                                filters = {this.state.activeFilterItems}
                                onToggle = {this.onToggle}
                            /> 

                            :

                            <div>
                                <h2>Created by Andrea - Gabriele - Giovanni - Giulio</h2>
                            </div>
                        }
                    </Allotment.Pane>
                </Allotment>

            </body>
          </>
        );
    }
}

export default TrustListViewer;
