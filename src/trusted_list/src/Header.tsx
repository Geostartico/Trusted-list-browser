import React, { Component } from 'react';

interface HeaderProps {
    title: string;
    onChangeFilter: Function;
    selectedFilter: number;
}

interface HeaderState {  
    advanced: boolean
}

class Header extends Component<HeaderProps, HeaderState> {

    public static defaultProps = {    
        title: 'Coutries',  
    };

    constructor(props: HeaderProps) {  
        super(props);
        this.state = {
            advanced: false,
        };
    }

    render() {

        return (
          <>
            <div className = 'header'>
              <h1 className = 'title' >{this.props.title}</h1>

              <div className = 'tabs' >

              <button onClick={this.props.onChangeFilter(0)}>Country</button>
              <button onClick={this.props.onChangeFilter(1)}>Type</button>
              <button onClick={this.props.onChangeFilter(2)}>State</button>

              </div>
            </div>
          </>
        );

    }

}

export default Header;
