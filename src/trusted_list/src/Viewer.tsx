import React, { Component } from 'react';

import { Facade } from "./facade/facade";
import {Country} from "./decoder/items"
interface ViewerProps {
}

interface ViewerState {  
    facede: Facade;
}

class Viewer extends Component<ViewerProps, ViewerState> {

    constructor(props: ViewerProps) {  
        super(props);
        this.state = {
            facede: new Facade(),
        };

        //INSERISCI QUA SCRIPT

        this.state.facede.getView().countries.forEach((val: Country) => {
            console.log(val);
        })


    }

    render() {

        return (
          <>
            <div className = 'viewer'>
                <p>
                manid
                </p>
            </div>
          </>
        );

    }

}

export default Viewer;
