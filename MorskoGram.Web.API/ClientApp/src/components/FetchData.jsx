import React, { Component } from 'react';
import { getAsync } from '../utils/fetcher';

export default class FetchData extends Component {
  constructor(props) {
    super(props);
    this.state = { forecasts: [], loading: true };
  }

  componentDidMount() {
    this.populateWeatherData();
  }

  static renderForecastsTable(forecasts) {
    return (
      <table className="table table-striped" aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Date</th>
            <th>Temp. (C)</th>
            <th>Temp. (F)</th>
            <th>Summary</th>
          </tr>
        </thead>
        <tbody>
          {forecasts.map((forecast) => (
            <tr key={forecast.date}>
              <td>{forecast.date}</td>
              <td>{forecast.temperatureC}</td>
              <td>{forecast.temperatureF}</td>
              <td>{forecast.summary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  async populateWeatherData() {
    this.setState({
      forecasts: await getAsync()('/weatherforecast'),
      loading: false,
    });
  }

  render() {
    const { loading, forecasts } = this.state;
    const contents = loading
      ? <p><em>Loading...</em></p>
      : FetchData.renderForecastsTable(forecasts);

    return (
      <>
        <h1 id="tabelLabel">Weather forecast</h1>
        <p>This component demonstrates fetching data from the server.</p>
        {contents}
      </>
    );
  }
}

FetchData.displayName = FetchData.name;
