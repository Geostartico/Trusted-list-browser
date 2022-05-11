import React, { Component } from 'react';

interface CountryProps {
}

interface CountryState {  
}

class FilterCountry extends Component<CountryProps, CountryState> {

    constructor(props: CountryProps) {  
        super(props);
        this.state = {
        };
    }

    render() {

        return (
          <>
              <h1 className = 'title' >Country</h1>
          </>
        );

    }

}

export default FilterCountry;
