"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatesInfo = void 0;
class DatesInfo {
    constructor(flightOffer) {
        this.flightOffer_ = flightOffer;
    }
    getDates() {
        let count = this.flightOffer_.itineraries_[0].segments_.length;
        return {
            departure: this.flightOffer_.itineraries_[0].segments_[0].departure_.at_,
            iataCodeDeparture: this.flightOffer_.itineraries_[0].segments_[0].departure_.iataCode_,
            arrival: this.flightOffer_.itineraries_[0].segments_[count - 1].arrival_.at_,
            iataCodeArrival: this.flightOffer_.itineraries_[0].segments_[count - 1].arrival_.iataCode_
        };
    }
}
exports.DatesInfo = DatesInfo;
//# sourceMappingURL=DatesInfo.js.map