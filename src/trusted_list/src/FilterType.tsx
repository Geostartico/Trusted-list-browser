import React, { Component } from 'react';

interface TypeProps {
}

interface TypeState {  
}

class FilterType extends Component<TypeProps, TypeState> {

    constructor(props: TypeProps) {  
        super(props);
        this.state = {
        };
    }

    render() {

        return (
          <>
              <h1 className = 'title' >Type</h1>
          </>
        );

    }

}

export default FilterType;
