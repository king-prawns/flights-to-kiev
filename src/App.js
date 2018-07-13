import React, { Component } from "react";
import closestIndexTo from "date-fns/closest_index_to";
import isFuture from "date-fns/is_future";
import addDays from "date-fns/add_days";
import format from "date-fns/format";
import Flight from "./components/Flight";
import "./App.css";
import db from "./db/flights.json";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      flights: [],
      nextFlight: null
    };
  }

  componentDidMount() {
    const flights = db.Flights.map(f => {
      const hourMin = f.LocalDepartureTime.split(":");
      const date = new Date();
      date.setHours(hourMin[0], hourMin[1]);
      return {
        DepartureIata: f.DepartureIata,
        ArrivalIata: f.ArrivalIata,
        LocalDepartureTime: date
      };
    });
    this.setState({ flights });
    this.timerID = setInterval(() => this.tick(flights), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick(flights) {
    this.chooseNextFlight(flights);
  }

  chooseNextFlight(flights) {
    const availableFlights = flights.map(f => ({
      DepartureIata: f.DepartureIata,
      ArrivalIata: f.ArrivalIata,
      LocalDepartureTime: !isFuture(f.LocalDepartureTime)
        ? addDays(f.LocalDepartureTime, 1)
        : f.LocalDepartureTime
    }));
    const departures = availableFlights.map(f => f.LocalDepartureTime);
    const closest = closestIndexTo(new Date(), departures);
    this.setState({
      nextFlight: availableFlights[closest]
    });
  }

  render() {
    const { nextFlight } = this.state;
    const now = format(new Date(), "HH:mm");

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Next flight to Kiev</h1>
        </header>
        <div className="App-body">
          <h2>It is {now}</h2>
          <Flight flight={nextFlight} />
        </div>
      </div>
    );
  }
}

export default App;
