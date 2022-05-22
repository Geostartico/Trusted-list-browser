import React, { Component } from 'react';
import Header from './Header';
import Viewer from './Viewer';
import FilterContainer from './FilterContainer';
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import {Facade} from './facade/facade';


interface TrustListViewerProps {
    appTitle: string;
}

interface TrustListViewerState {
    activeFilter: number;
    facade: Facade;
}

class TrustListViewer extends Component<TrustListViewerProps, TrustListViewerState> {

    constructor(props: TrustListViewerProps) {
        super(props);
        this.state = {
            activeFilter: 0,
            facade: new Facade(),
        };
        this.onChangeFilter = this.onChangeFilter.bind(this);
    }

    onChangeFilter(selectedFilter: number){
        this.setState({
            activeFilter: selectedFilter
        });
    }


    // Func to update the viewe

    // func callback the filer

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
