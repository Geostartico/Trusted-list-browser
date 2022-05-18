import React, { Component } from 'react';
import Header from './Header';
import Viewer from './Viewer';
import FilterContainer from './FilterContainer';

import { Allotment } from "allotment";
import "allotment/dist/style.css";


const styles = {
  background: '#000',
  width: '2px',
  cursor: 'col-resize',
  margin: '0 5px',
  height: '100%',
};

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

                <Allotment onVisibleChange={() => this.forceUpdate()}>
                    <Allotment.Pane minSize={200}>
                        <Viewer />
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
