import React, { Component } from 'react';
import {FilterType} from './Enums';

/**
 * @param title is the string will be displayed 
 * @param onChangeFilter a callback function that is called every time the selected tab is changed
 * @param selectedFilter use to displayed the tab differently
 */
interface HeaderProps {
    title: string;
    onChangeFilter: Function;
    selectedFilter: FilterType;
}

interface HeaderState {  }

class Header extends Component<HeaderProps, HeaderState> {

    /**
     * This component contains the entire top of the site
     */
    render() {
        return (
          <>
            <div className = 'header'>

              <h1 className = 'title' >{this.props.title}</h1>

              <div className = 'tabs' >

                {/*There is four type of filter*/}

                <button 
                  onClick={() => this.props.onChangeFilter(FilterType.Country)} 
                  className = {'buttonFilter ' + (this.props.selectedFilter === FilterType.Country ? 'selectedButtonFilter' : '')}>
                      Country
                </button>

                <button 
                  onClick={() => this.props.onChangeFilter(FilterType.Provider)} 
                  className = {'buttonFilter ' + (this.props.selectedFilter === FilterType.Provider ? 'selectedButtonFilter' : '')}>
                      Provider
                </button>

                <button 
                  onClick={() => this.props.onChangeFilter(FilterType.Type)} 
                  className = {'buttonFilter ' + (this.props.selectedFilter === FilterType.Type ? 'selectedButtonFilter' : '')}>
                      Type
                </button>

                <button 
                  onClick={() => this.props.onChangeFilter(FilterType.Status)} 
                  className = {'buttonFilter ' + (this.props.selectedFilter === FilterType.Status ? 'selectedButtonFilter' : '')}>
                      Status
                </button>

              </div>
            </div>
          </>
        );

    }

}

export default Header;
