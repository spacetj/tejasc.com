import React, { Component } from 'react';
import ReactGA from 'react-ga';
import "./App.css";
import About from './About';
import Resume from './Resume';
import Portfolio from './Portfolio';
import ResumeData from '../../../content/resume/resume.yaml'

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      foo: 'bar',
      resumeData: {}
    };

    ReactGA.initialize('UA-110570651-1');

  }

  getResumeData(){
    this.setState({resumeData: ResumeData});
  }

  componentDidMount(){
    this.getResumeData();
  }

  render() {
    return (
      <div className="Resume" style={{marginBottom:"500px"}}>
          <About data={this.state.resumeData.main} resume={this.state.resumeData.resume}/>
          <Resume data={this.state.resumeData.resume}/>
          <Portfolio data={this.state.resumeData.portfolio}/>
      </div>
    );
  }
}

export default App;
