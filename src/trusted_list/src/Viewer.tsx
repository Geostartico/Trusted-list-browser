import React, { Component } from 'react';

import { IgetView } from "./facade/facade";
import ItemViewer from "./ItemViewer"
import { Item } from './decoder/itemInterface';

interface ViewerProps {
    viewItems: IgetView;
}

interface ViewerState {  
}

class Viewer extends Component<ViewerProps, ViewerState> {

    constructor(props: ViewerProps) {  
        super(props);
        this.state = {
        };
    }


    render() {

        return (
          <>
            <div className="viewer">
                <ItemViewer
                    key={"0"}
                    viewItems={this.props.viewItems}
                    items = {null}
                    indent = {1}
                />
            </div>
          </>
        );

    }

}

export default Viewer;
