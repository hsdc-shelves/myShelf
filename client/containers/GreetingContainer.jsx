import React, { Component } from 'react';
import { connect } from 'react-redux';
import GreetingDisplay from '../components/GreetingDisplay.jsx';

const mapStateToProps = (state) => {  //subscribe the component to a certain part of state
//and this has to be done in conjunction with connect(mapStateToProps, null(could also be mapDispatchToProps))
//at the bottom of the file
  return {
    displayName: state.user.userProfile.firstName
  }
}

class GreetingContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <GreetingDisplay {...this.props} />
    )
  }
}

export default connect(mapStateToProps, null)(GreetingContainer);
//connect property is how we connect to store
//connect is a function that always takes two parameters (mapStatetoProps, and mapDispatchToProps)