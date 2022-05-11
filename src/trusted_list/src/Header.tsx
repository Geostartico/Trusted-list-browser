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

              <button onClick={() => this.props.onChangeFilter(0)} className = {'buttonFilter ' + (this.props.selectedFilter == 0 ? 'selectedButtonFilter' : '')}>Country</button>
              <button onClick={() => this.props.onChangeFilter(1)} className = {'buttonFilter ' + (this.props.selectedFilter == 1 ? 'selectedButtonFilter' : '')}>Type</button>
              <button onClick={() => this.props.onChangeFilter(2)} className = {'buttonFilter ' + (this.props.selectedFilter == 2 ? 'selectedButtonFilter' : '')}>State</button>

              </div>
            </div>
          </>
        );

    }

}

export default Header;
