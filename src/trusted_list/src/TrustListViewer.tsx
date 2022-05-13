import React, { Component } from 'react';
import Header from './Header';
import Viewer from './Viewer';
import FilterContainer from './FilterContainer';

interface TrustListViewerProps {
    appTitle: string;
}

interface TrustListViewerState {
    activeFilter: number;
}

class TrustListViewer extends Component<TrustListViewerProps, TrustListViewerState> {

    constructor(props: TrustListViewerProps) {
        super(props);
        this.state = {
            activeFilter: 0,
        };
        this.onChangeFilter = this.onChangeFilter.bind(this);
    }

    onChangeFilter(selectedFilter: number){
        this.setState({
            activeFilter: selectedFilter
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
                <div className = 'mainContainer'>

                    <Viewer />
                    <FilterContainer
                        selectedFilter = {this.state.activeFilter}
                    />

                </div>
            </body>
          </>
        );

    }

}

export default TrustListViewer;

/*
 * */