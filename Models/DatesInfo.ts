import { Departure, FlightOffer } from "../Models/FlightOffer";
import { Flight } from "./Flight";

export class DatesInfo {
    public constructor(flightOffer:FlightOffer) {
        this.flightOffer_ = flightOffer;
    }

    flightOffer_:FlightOffer;

    public getDates(){
        let count = this.flightOffer_.itineraries_[0].segments_.length;

        return {
                departure: this.flightOffer_.itineraries_[0].segments_[0].departure_.at_,
                iataCodeDeparture: this.flightOffer_.itineraries_[0].segments_[0].departure_.iataCode_,

                arrival: this.flightOffer_.itineraries_[0].segments_[count-1].arrival_.at_,
                iataCodeArrival: this.flightOffer_.itineraries_[0].segments_[count-1].arrival_.iataCode_
        }; 
    }
}