import React, { Component } from 'react';
import Header from './Header';
import ItemViewer from './ItemViewer';
import FilterPane from './FilterPane';
import { Allotment } from "allotment";
import { Facade, IgetView } from '../facade/facade';
import { UnorderedSet } from '../decoder/UnorderedSet';
import { Country, Provider, Status, Type } from "../decoder/items";
import { FilterType, SelectionType } from "./Enums";
import { Settable } from '../decoder/settable';
import { UnorderedMap } from '../decoder/UnorderedMap';
import { ToastContainer, toast } from 'react-toastify';


/**
 * @param appTitle Title of the web page
 */
interface TrustListViewerProps {
    appTitle: string;
}

/**
 * @param activeFilter rapresents the active filter tab, initially null
 * @param facade used to get all the data and update all the selected or not entries in the filters
 * @param activeFilterItems selectable entries of a single filter
 * @param viewItems all the information filtered and ready to be displayed
 * @param countryEntriesFilter all possible entries inside the Country filter and the SelectionType status
 * @param typeEntriesFilter all possible entries inside the Type filter and the SelectionType status
 * @param statusEntriesFilter all possible entries inside the Status filter and the SelectionType status
 * @param providerEntriesFilter all possible entries inside the Provider filter and the SelectionType status
 */
interface TrustListViewerStatus {
    activeFilter: FilterType;
    facade: Facade;
    activeFilterItems: UnorderedMap<Country | Type | Status | Provider, SelectionType> | null;
    viewItems: IgetView | null;

    countryEntriesFilter: UnorderedMap<Country, SelectionType> | null;
    typeEntriesFilter: UnorderedMap<Type, SelectionType> | null;
    statusEntriesFilter: UnorderedMap<Status, SelectionType> | null;
    providerEntriesFilter: UnorderedMap<Provider, SelectionType> | null;
}

/**
 * Main component that contain all the website, there is three different parts:
 *  + Header
 *  + Viewer
 *  + Filters
 */
class TrustListViewer extends Component<TrustListViewerProps, TrustListViewerStatus> {

    // Used to manage the loading toast
    static isLoading: boolean = false;

    /**
     * Initially all the information inside the status is null, 
     * the facade have to fetch and decode the data
     */
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
            countryEntriesFilter: null,
            typeEntriesFilter: null,
            statusEntriesFilter: null, 
            providerEntriesFilter: null,
        };

        if(!TrustListViewer.isLoading) {
            //toast.success('🦄 Set up running!');
            toast('🦄 Wow so easy!', {
                position: "bottom-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            TrustListViewer.isLoading = true;
        }
    }

    /**
     * Callback function used by the facade when the set up is finished
     */
    onSetUpCompleted() {

        // Create the maps that store all the entries
        this.setState({
            countryEntriesFilter: this.createEntryFilterSet(this.state.facade.getSelectableCountries()),
            typeEntriesFilter: this.createEntryFilterSet(this.state.facade.getSelectableTypes()),
            statusEntriesFilter: this.createEntryFilterSet(this.state.facade.getSelectableStatus()),
            providerEntriesFilter: this.createEntryFilterSet(this.state.facade.getSelectableProviders()),
            viewItems: this.state.facade.getView(),
        }, () => {

            toast.success('🦄 Set up Done!');
            TrustListViewer.isLoading = false;

        });
    }

    /**
     * @returns an UnorderedMap with Key the values inside the set and Value the SelectionType, initially always selectable
     */
    createEntryFilterSet<T extends Settable<T>>(map: UnorderedSet<T>): UnorderedMap<T, SelectionType> {
        let newMap: UnorderedMap<T, SelectionType> = new UnorderedMap(10);

        map.forEach((val: T) => {
            newMap.set(val, SelectionType.Selectable);
        });

       return newMap;
    }

    /**
     * @param item toggled item inside the filter
     *
     * The function update the selection value inside the map and
     * update also the facade of the selection or deselection 
     */
    onToggle(item : Country | Type | Status | Provider) {
        let map: UnorderedMap<Country | Type | Status | Provider, SelectionType>;

        switch(this.state.activeFilter) {
            case FilterType.Country:
                if(this.state.countryEntriesFilter === null) return;
                map = this.state.countryEntriesFilter;
            break;
            case FilterType.Status:
                if(this.state.statusEntriesFilter === null) return;
                map = this.state.statusEntriesFilter;
            break;
            case FilterType.Provider:
                if(this.state.providerEntriesFilter === null) return;
                map = this.state.providerEntriesFilter;
            break;
            case FilterType.Type:
                if(this.state.typeEntriesFilter === null) return;
                map = this.state.typeEntriesFilter;
            break;
        }

        if(map.get(item) === SelectionType.Selectable) {
            map.set(item, SelectionType.Selected)
        }
        else {
            map.set(item, SelectionType.Selectable)
        }

        map.get(item) === SelectionType.Selected ? this.state.facade.updateAdd(item) : this.state.facade.updateRemove(item);
        this.onChangeFilter(this.state.activeFilter);
    }

    /**
     * Update all the values inside the viewer and inside the filter
     */
    onChangeFilter(selectedFilter: FilterType) {

        // This set will store all the selectable item of a filter
        let filtersSet: UnorderedSet<Country | Type | Status | Provider>;
        let map: UnorderedMap<Country | Type | Status | Provider, SelectionType>;

        switch(selectedFilter) {
            case FilterType.Country:
                if(this.state.countryEntriesFilter === null) return;
                filtersSet = this.state.facade.getSelectableCountries();
                map = this.state.countryEntriesFilter;
            break;
            case FilterType.Status:
                if(this.state.statusEntriesFilter === null) return;
                filtersSet = this.state.facade.getSelectableStatus();
                map = this.state.statusEntriesFilter;
            break;
            case FilterType.Provider:
                if(this.state.providerEntriesFilter === null) return;
                filtersSet = this.state.facade.getSelectableProviders();
                map = this.state.providerEntriesFilter;
            break;
            case FilterType.Type:
                if(this.state.typeEntriesFilter === null) return;
                filtersSet = this.state.facade.getSelectableTypes();
                map = this.state.typeEntriesFilter;
            break;
        }

        // Based on what is returned by the facade update the value inside the map
        map.forEach((val: SelectionType, item: Country | Type | Status | Provider) => {
            // Make unselectable the items that are not in the set of the selectable
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
            {/*This section contain the Header of the web site*/}
            {/*<header>*/}
                <Header
                    title = {this.props.appTitle}
                    onChangeFilter = {this.onChangeFilter}
                    selectedFilter = {this.state.activeFilter}
                />
            {/*</header>*/}

            {/*Used for the notification*/}
            <ToastContainer
                position="bottom-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            {/*The body is divided in two panals, the Viewer container and the Filter container, both resizable*/}
            <div className='panelsContainer'>
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

                        {/**
                          * If the activeFilterItems is null mean that the set up is not finished 
                          * or the user didn't selected a filter to start
                          * In this case an svg will be displayed otherwise the selected filter
                          */}
                        {this.state.activeFilterItems !== null ?

                            <FilterPane
                                 filters= {this.state.activeFilterItems}
                                 onToggle = {this.onToggle}
                            /> 

                            :

                            <div className='titleNameContainer'>
                                <svg viewBox="0 0 1000 300">
                                	<text x="50%" y="0%" dy=".45em" textAnchor="middle">
                                		Giovanni
                                	</text>
                                	<text x="50%" y="25%" dy=".45em" textAnchor="middle">
                                		Giulio
                                	</text>
                                	<text x="50%" y="50%" dy=".45em" textAnchor="middle">
                                		Gabriele
                                	</text>
                                	<text x="50%" y="75%" dy=".45em" textAnchor="middle">
                                		Andrea
                                	</text>
                                </svg>	
                            </div>
                        }

                    </Allotment.Pane>

                </Allotment>

            </div>
          </>
        );
    }
}

export default TrustListViewer;
