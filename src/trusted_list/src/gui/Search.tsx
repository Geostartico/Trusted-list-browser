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

    componentWillReceiveProps(newProps: SearchProps) {
        
    }

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
                    { this.state.expand ? 'X' : 'S' }
                </button>
            </div>
          </>
        );

    }

}

export default Search;
