import React, { Component } from 'react';

interface CountriesProps {
    title: string;
}

interface CountriesState {  
    advanced: boolean
}

class Header extends Component<HeaderProps, HeaderState> {

    public static defaultProps = {    
        title: 'Coutries',  
    };

    constructor(props: HeaderProps) {  super(props);
        this.state = {
            advanced: false,
        };
    }

    render() {

        return (
          <>
            <div className = 'header'>
              <h1 className = 'title' >{this.props.title}</h1>
            </div>
          </>
        );

    }

}

export default Header;
