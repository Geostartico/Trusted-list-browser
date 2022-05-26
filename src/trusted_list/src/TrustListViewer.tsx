import React, { Component, useEffect, useState } from 'react';
import Header from './Header';
import ItemViewer from './ItemViewer';
import FilterContainer from './FilterContainer';
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import {Facade, IgetView} from './facade/facade';
import { UnorderedSet } from './decoder/UnorderedSet';
import { Country, Provider, Service, Status, Type } from "./decoder/items";
import { Item } from "./decoder/itemInterface";
import { FilterType, SelectionType } from "./Enums";
import { Settable } from './decoder/settable';
import {UnorderedMap} from './decoder/UnorderedMap';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

interface TrustListViewerProps {
    appTitle: string;
}

interface TrustListViewerState {
    activeFilter: FilterType;
    facade: Facade;
    activeFilterItems: UnorderedMap<Country | Type | Status | Provider, SelectionType> | null;
    viewItems: IgetView | null;

    countryEntrieFilter: UnorderedMap<Country, SelectionType> | null;
    typeEntrieFilter: UnorderedMap<Type, SelectionType> | null;
    stateEntrieFilter: UnorderedMap<Status, SelectionType> | null;
    providerEntrieFilter: UnorderedMap<Provider, SelectionType> | null;
}

class TrustListViewer extends Component<TrustListViewerProps, TrustListViewerState> {

    constructor(props: TrustListViewerProps) {
        super(props);

        this.onChangeFilter = this.onChangeFilter.bind(this);
        this.createEntryFilterSet = this.createEntryFilterSet.bind(this);
        this.onToggle = this.onToggle.bind(this);
        this.onSetUpCompleted = this.onSetUpCompleted.bind(this);


        this.state = {
            activeFilter: FilterType.Country,
            facade: new Facade(this.onSetUpCompleted),
            activeFilterItems: null,
            viewItems: null,
            countryEntrieFilter: null,
            typeEntrieFilter: null,
            stateEntrieFilter: null, 
            providerEntrieFilter: null,

        };

        toast.success('🦄 SetUp running!');

        // Set up All the Set for the Filter
    }

    onSetUpCompleted() {

        this.setState({
            countryEntrieFilter: this.createEntryFilterSet(this.state.facade.getSelectableCountries()),
            typeEntrieFilter: this.createEntryFilterSet(this.state.facade.getSelectableTypes()),
            stateEntrieFilter: this.createEntryFilterSet(this.state.facade.getSelectableStatus()),
            providerEntrieFilter: this.createEntryFilterSet(this.state.facade.getSelectableProviders()),
            viewItems: this.state.facade.getView(),
        }, () => {

            toast.success('🦄 Set up Done!');

        });
    }

    /*
    componentDidMount() {
        this.setState({
            viewItems: this.state.facade.getView(),
        });
    }
    */

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
                if(this.state.countryEntrieFilter === null) return;
                map = this.state.countryEntrieFilter;
            break;
            case FilterType.State:
                if(this.state.stateEntrieFilter === null) return;
                map = this.state.stateEntrieFilter;
            break;
            case FilterType.Provider:
                if(this.state.providerEntrieFilter === null) return;
                map = this.state.providerEntrieFilter;
            break;
            case FilterType.Type:
                if(this.state.typeEntrieFilter === null) return;
                map = this.state.typeEntrieFilter;
            break;
        }

        if(map.get(item) === SelectionType.Selectable) {
            map.set(item, SelectionType.Selected)
            console.log("selected ", item.getText())
        }
        else {
            map.set(item, SelectionType.Selectable)
            console.log("deselected ", item.getText())
        }

        map.get(item) === SelectionType.Selected ? this.state.facade.updateAdd(item) : this.state.facade.updateRemove(item);
        this.onChangeFilter(this.state.activeFilter);
    }

    onChangeFilter(selectedFilter: FilterType) {

        let filtersSet: UnorderedSet<Country | Type | Status | Provider>;
        let map: UnorderedMap<Country | Type | Status | Provider, SelectionType>;

        switch(selectedFilter) {
            case FilterType.Country:
                if(this.state.countryEntrieFilter === null) return;
                filtersSet = this.state.facade.getSelectableCountries();
                map = this.state.countryEntrieFilter;
            break;
            case FilterType.State:
                if(this.state.stateEntrieFilter === null) return;
                filtersSet = this.state.facade.getSelectableStatus();
                map = this.state.stateEntrieFilter;
            break;
            case FilterType.Provider:
                if(this.state.providerEntrieFilter === null) return;
                filtersSet = this.state.facade.getSelectableProviders();
                map = this.state.providerEntrieFilter;
            break;
            case FilterType.Type:
                if(this.state.typeEntrieFilter === null) return;
                filtersSet = this.state.facade.getSelectableTypes();
                map = this.state.typeEntrieFilter;
            break;
        }

        map.forEach((val: SelectionType, item: Country | Type | Status | Provider) => {
            // Make unselectabel only the one are not more in the set of the selectable
            if (!filtersSet.has(item)) {
                map.set(item, SelectionType.NotSelectable);
            } else if(map.get(item) === SelectionType.NotSelectable) {
                map.set(item, SelectionType.Selectable);
            }

        });

        this.setState({
            activeFilter: selectedFilter,
            activeFilterItems: map,
            viewItems: this.state.facade.getView(),
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
            <ToastContainer
                position="bottom-right"
                autoClose={2000}
            />
            <body>
                <Allotment onVisibleChange={() => this.forceUpdate()}>
                    <Allotment.Pane minSize={300}>

                       <div className="viewer">
                           {this.state.viewItems !== null &&
                            <ItemViewer
                               key={"0"}
                               viewItems={this.state.viewItems}
                               items = {null}
                               indent = {1}
                           />}
                       </div>
 
                    </Allotment.Pane >
                    <Allotment.Pane minSize={510} snap>
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
