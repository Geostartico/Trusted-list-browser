import React, { Component } from 'react';
import {FilterType} from './Enums';

interface HeaderProps {
    title: string;
    onChangeFilter: Function;
    selectedFilter: FilterType;
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

                <button 
                  onClick={() => this.props.onChangeFilter(FilterType.Country)} 
                  className = {'buttonFilter ' + (this.props.selectedFilter == FilterType.Country ? 'selectedButtonFilter' : '')}>
                      Country
                </button>

                <button 
                  onClick={() => this.props.onChangeFilter(FilterType.Provider)} 
                  className = {'buttonFilter ' + (this.props.selectedFilter == FilterType.Provider ? 'selectedButtonFilter' : '')}>
                      Provider
                </button>

                <button 
                  onClick={() => this.props.onChangeFilter(FilterType.Type)} 
                  className = {'buttonFilter ' + (this.props.selectedFilter == FilterType.Type ? 'selectedButtonFilter' : '')}>
                      Type
                </button>

                <button 
                  onClick={() => this.props.onChangeFilter(FilterType.State)} 
                  className = {'buttonFilter ' + (this.props.selectedFilter == FilterType.State ? 'selectedButtonFilter' : '')}>
                      State
                </button>

              </div>
            </div>
          </>
        );

    }

}

export default Header;
