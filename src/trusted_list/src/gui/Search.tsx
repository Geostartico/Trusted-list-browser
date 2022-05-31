import React, { Component } from 'react';

/**
 * @param onToggle is a callback function to be used when is performed an action o a entry
 */
interface SearchProps {
    onMod: Function;
    textInBox: string;
}

/**
 * @param filters used to store the Item to be displayed
 * @param filtersType used to manage the states of the entries
 */
interface SearchState {
    expand: boolean;
}

class Search extends Component<SearchProps, SearchState> {

    /**
     * @param props is used to set the state variables correctly
     */
    constructor(props: SearchProps) {  
        super(props);
        this.state = {
            expand: false
        };
        this.onToggle = this.onToggle.bind(this);
        //this.handleChange = this.handleChange.bind(this);
    }

    /*
    componentWillReceiveProps(newProps: SearchProps) {
        
    }
    */

    onToggle() {
        this.setState({
            expand: !this.state.expand,
        });
    }

    /*
    handleChange(evet) {

        this.props.onMod(event.);

    }
    */

    /**
     * All the necessary entries will be created on the basis of the internal data of the state
     */
    render() {
        return (
          <>
            <div className = 'textFilterContainer'>
                { this.state.expand &&
                    <form>
                        <input 
                            type="text" 
                            value={this.props.textInBox} 
                            className="inputText" 
                            onChange={(e) => this.props.onMod(e.target.value)} 
                        />
                    </form>
                }
                <button onClick={() => {this.onToggle()}} className="buttonSearchFilter"> 
                    { this.state.expand ?

                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            x="0px" y="0px"
                            viewBox="0 0 30 30"
                            className='svgFilterSearch'
                        >    
                            <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"></path>
                        </svg>

                    :

                        <svg 
                            xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                            viewBox="0 0 50 50"
                            className='svgFilterSearch'
                        >
                        <path d="M 21 3 C 11.601563 3 4 10.601563 4 20 C 4 29.398438 11.601563 37 21 37 C 24.355469 37 27.460938 36.015625 30.09375 34.34375 L 42.375 46.625 L 46.625 42.375 L 34.5 30.28125 C 36.679688 27.421875 38 23.878906 38 20 C 38 10.601563 30.398438 3 21 3 Z M 21 7 C 28.199219 7 34 12.800781 34 20 C 34 27.199219 28.199219 33 21 33 C 13.800781 33 8 27.199219 8 20 C 8 12.800781 13.800781 7 21 7 Z"></path>
                        </svg>

                    }
                </button>
            </div>
          </>
        );

    }

}

export default Search;
