import React, { Component } from 'react';

interface ViewerProps {
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
            <h1>Qui dovrebbe esserci il visualizer</h1>
          </>
        );

    }

}

export default Viewer;
