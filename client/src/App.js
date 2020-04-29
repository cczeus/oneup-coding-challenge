import React, {Component} from 'react';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      access_token: "",
      data: null
    };

    this.updateAccessToken = this.updateAccessToken.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.renderEntry = this.renderEntry.bind(this);
    this.renderAllergyIntoleranceEntry = this.renderAllergyIntoleranceEntry.bind(this);
    this.renderCarePlan = this.renderCarePlan.bind(this);
    this.renderCondition = this.renderCondition.bind(this);
  }

  updateAccessToken(e) {
    this.setState({ access_token: e.target.value });
  }

  async fetchData() {
    let options = {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    }
    let data = await fetch('http://localhost:5000/api/everything/' + this.state.access_token, options).then(data => {
      console.log("Got data: " + data)
      return data.json();
    }).catch(err => {
      console.log(err);
      return "{}"
    });
    this.setState({ data: data });
  }

  renderAllergyIntoleranceEntry(entry) {
    return (<div>
      <h1>Allergy Intolerance</h1>
      <div>Recorded by: {entry.resource.recorder.display}</div>
      <div>Reaction:</div>
      <ul>
        {entry.resource.reaction.map(reaction => {
          return (
            <li>
              <ul>
                <li>Onset: {reaction.onset}</li>
                <li>Certainty: {reaction.certainty}</li>
                <li>
                  <ul>
                  {reaction.manifestation.map(manifestation => {
                    return (<li>Manifestation: {manifestation.text}</li>)
                  })}
                  </ul>
                </li>
              </ul>
            </li>
          )
        })}
      </ul>
      <div>Substance: {entry.resource.substance.text}</div>
      <div>Criticality: {entry.resource.criticality}</div>
    </div>)
  }

  renderCarePlan(entry) {
    return (<div>
      <h1>Care Plan</h1>
      <div>
        Addresses:
        <ul>
          {entry.resource.addresses.map(addresses => {
            return <li>{addresses.display}</li>
          })}
        </ul>
      </div>
      <div>
        Goals:
        <ul>
          {entry.resource.goal.map(goal => {
            return <li>{goal.display}</li>
          })}
        </ul>
      </div>
      <div>
        Activities:
        <ul>
          {entry.resource.activity.map(activity => {
            return <li>{activity.detail.code.text}</li>
          })}
        </ul>
      </div>
    </div>)
  }

  renderCondition(entry) {
    return (<div>
      <h1>Condition</h1>
      <div>{entry.resource.category.text}: {entry.resource.code.text}</div>
      <div>Asserter: {entry.resource.asserter.display}</div>
      <div>Date Recorderd: {entry.resource.dateRecorded}</div>
      <div>Verification Status: {entry.resource.verificationStatus}</div>
      <div>Clinical Status: {entry.resource.clinicalStatus}</div>
    </div>)
  }

  renderEntry(entry) {
    switch(entry.resource.resourceType) {
      case "AllergyIntolerance":
        return this.renderAllergyIntoleranceEntry(entry);
      case "CarePlan":
        return this.renderCarePlan(entry);
      case "Condition":
        return this.renderCondition(entry);
      default:
        return (<div>No Resource Type Exists For {entry.resource.resourceType}</div>)
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <input type="text" value={this.state.access_token} onChange={this.updateAccessToken} placeholder="Access Token" />
          <input type="button" onClick={this.fetchData} value="Fetch User Data" />
          { this.state.data !== null ?
          <div>
            {this.state.data.entry.map(entry => {
              return this.renderEntry(entry);
            })}
          </div>
          :
          <div></div>
          }
        </header>
      </div>
    );
  }
}

export default App;
