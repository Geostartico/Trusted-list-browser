import React, { Component } from 'react';

interface StateProps {
}

interface StateState {  
}

class FilterState extends Component<StateProps, StateState> {

    constructor(props: StateProps) {  
        super(props);
        this.state = {
        };
    }

    render() {

        return (
          <>
              <h1 className = 'title' >State</h1>
          </>
        );

    }

}

export default FilterState;
