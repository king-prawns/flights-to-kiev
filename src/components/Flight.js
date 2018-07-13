import React, { Component } from "react";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import "./Flight.css";

class Flights extends Component {
  getDiff(date) {
    return distanceInWordsToNow(date, {
      includeSeconds: true
    });
  }

  render() {
    if (!this.props.flight) {
      return <span>Loading...</span>;
    }

    return (
      <div>
        <span className="Fligth">
          {this.getDiff(this.props.flight.LocalDepartureTime)}
        </span>
        <span className="Iata">
          {this.props.flight.DepartureIata} > {this.props.flight.ArrivalIata}
        </span>
      </div>
    );
  }
}

export default Flights;
