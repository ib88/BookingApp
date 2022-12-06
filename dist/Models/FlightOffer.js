"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlightOffer = exports.IncludedCheckedBags = exports.FareDetailsBySegment = exports.TravelerPricings = exports.Itineraries = exports.Price = exports.Arrival = exports.Departure = exports.Segment = void 0;
const jackson_js_1 = require("jackson-js");
let Segment = class Segment {
    constructor(departure, arrival, carrierCode, duration, id, numberOfStops) {
        this.segmentId_ = id;
        this.carrierCode_ = carrierCode;
        this.numberOfStops_ = numberOfStops;
        this.departure_ = departure;
        this.arrival_ = arrival;
        this.duration_ = duration;
        this.carrierName_ = "";
    }
};
__decorate([
    (0, jackson_js_1.JsonProperty)({ value: "id" }),
    (0, jackson_js_1.JsonClassType)({ type: () => [String] })
], Segment.prototype, "segmentId_", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)({ value: "carrierCode" }),
    (0, jackson_js_1.JsonClassType)({ type: () => [String] })
], Segment.prototype, "carrierCode_", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)({ value: "duration" }),
    (0, jackson_js_1.JsonClassType)({ type: () => [String] })
], Segment.prototype, "duration_", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)({ value: "numberOfStops" }),
    (0, jackson_js_1.JsonClassType)({ type: () => [String] })
], Segment.prototype, "numberOfStops_", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)({ value: "departure" }),
    (0, jackson_js_1.JsonClassType)({ type: () => [Departure] })
], Segment.prototype, "departure_", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)({ value: "arrival" }),
    (0, jackson_js_1.JsonClassType)({ type: () => [Arrival] })
], Segment.prototype, "arrival_", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)(),
    (0, jackson_js_1.JsonClassType)({ type: () => [String] })
], Segment.prototype, "carrierName_", void 0);
Segment = __decorate([
    (0, jackson_js_1.JsonIgnoreProperties)({
        ignoreUnknown: true
    })
], Segment);
exports.Segment = Segment;
class Departure {
    constructor(iataCode, terminal, at) {
        this.iataCode_ = iataCode;
        this.terminal_ = terminal;
        this.at_ = at;
    }
}
__decorate([
    (0, jackson_js_1.JsonProperty)({ value: "iataCode" }),
    (0, jackson_js_1.JsonClassType)({ type: () => [String] })
], Departure.prototype, "iataCode_", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)({ value: "terminal" }),
    (0, jackson_js_1.JsonClassType)({ type: () => [String] })
], Departure.prototype, "terminal_", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)({ value: "at" }),
    (0, jackson_js_1.JsonClassType)({ type: () => [String] })
], Departure.prototype, "at_", void 0);
exports.Departure = Departure;
class Arrival {
    constructor(iataCode, terminal, at) {
        this.iataCode_ = iataCode;
        this.terminal_ = terminal;
        this.at_ = at;
    }
}
__decorate([
    (0, jackson_js_1.JsonProperty)({ value: "iataCode" }),
    (0, jackson_js_1.JsonClassType)({ type: () => [String] })
], Arrival.prototype, "iataCode_", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)({ value: "terminal" }),
    (0, jackson_js_1.JsonClassType)({ type: () => [String] })
], Arrival.prototype, "terminal_", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)({ value: "at" }),
    (0, jackson_js_1.JsonClassType)({ type: () => [String] })
], Arrival.prototype, "at_", void 0);
exports.Arrival = Arrival;
let Price = class Price {
    constructor(total, currency, grandTotal) {
        this.total_ = total;
        this.currency_ = currency;
        this.grandTotal_ = grandTotal;
    }
};
__decorate([
    (0, jackson_js_1.JsonProperty)({ value: "total" }),
    (0, jackson_js_1.JsonClassType)({ type: () => [String] })
], Price.prototype, "total_", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)({ value: "currency" }),
    (0, jackson_js_1.JsonClassType)({ type: () => [String] })
], Price.prototype, "currency_", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)({ value: "grandTotal" }),
    (0, jackson_js_1.JsonClassType)({ type: () => [String] })
], Price.prototype, "grandTotal_", void 0);
Price = __decorate([
    (0, jackson_js_1.JsonIgnoreProperties)({
        value: ['base', 'fees', 'grandTotal']
    })
], Price);
exports.Price = Price;
class Itineraries {
    constructor(duration, segments) {
        this.duration_ = duration;
        this.segments_ = segments;
    }
}
__decorate([
    (0, jackson_js_1.JsonProperty)({ value: "duration" }),
    (0, jackson_js_1.JsonClassType)({ type: () => [String] })
], Itineraries.prototype, "duration_", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)({ value: "segments" }),
    (0, jackson_js_1.JsonClassType)({ type: () => [Array, [Segment]] })
], Itineraries.prototype, "segments_", void 0);
exports.Itineraries = Itineraries;
class TravelerPricings {
    constructor(travelerId, fareOption, travelerType, price, fareDetailsBySegment) {
        this.travelerId = travelerId;
        this.fareOption = fareOption;
        this.travelerType = travelerType;
        this.price = price;
        this.fareDetailsBySegment = fareDetailsBySegment;
    }
}
__decorate([
    (0, jackson_js_1.JsonProperty)({ value: "travelerId" }),
    (0, jackson_js_1.JsonClassType)({ type: () => [String] })
], TravelerPricings.prototype, "travelerId", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)({ value: "fareOption" }),
    (0, jackson_js_1.JsonClassType)({ type: () => [String] })
], TravelerPricings.prototype, "fareOption", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)({ value: "travelerType" }),
    (0, jackson_js_1.JsonClassType)({ type: () => [String] })
], TravelerPricings.prototype, "travelerType", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)({ value: "price" }),
    (0, jackson_js_1.JsonClassType)({ type: () => [Price] })
], TravelerPricings.prototype, "price", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)({ value: "fareDetailsBySegment" }),
    (0, jackson_js_1.JsonClassType)({ type: () => [Array, [FareDetailsBySegment]] })
], TravelerPricings.prototype, "fareDetailsBySegment", void 0);
exports.TravelerPricings = TravelerPricings;
class FareDetailsBySegment {
    constructor(segmentId, cabin, fareBasis, includedCheckedBags) {
        this.segmentId = segmentId;
        this.cabin = cabin;
        this.fareBasis = fareBasis;
        //this.class = class;
        this.class_ = "";
        this.includedCheckedBags = includedCheckedBags;
    }
}
__decorate([
    (0, jackson_js_1.JsonProperty)({ value: "segmentId" }),
    (0, jackson_js_1.JsonClassType)({ type: () => [String] })
], FareDetailsBySegment.prototype, "segmentId", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)({ value: "cabin" }),
    (0, jackson_js_1.JsonClassType)({ type: () => [String] })
], FareDetailsBySegment.prototype, "cabin", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)({ value: "fareBasis" }),
    (0, jackson_js_1.JsonClassType)({ type: () => [String] })
], FareDetailsBySegment.prototype, "fareBasis", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)({ value: "class" }),
    (0, jackson_js_1.JsonClassType)({ type: () => [String] })
], FareDetailsBySegment.prototype, "class_", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)({ value: "includedCheckedBags" }),
    (0, jackson_js_1.JsonClassType)({ type: () => [IncludedCheckedBags] })
], FareDetailsBySegment.prototype, "includedCheckedBags", void 0);
exports.FareDetailsBySegment = FareDetailsBySegment;
class IncludedCheckedBags {
    constructor(weight, weightUnit) {
        this.weight = weight;
        this.weightUnit = weightUnit;
    }
}
__decorate([
    (0, jackson_js_1.JsonProperty)({ value: "weight" }),
    (0, jackson_js_1.JsonClassType)({ type: () => [String] })
], IncludedCheckedBags.prototype, "weight", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)({ value: "weightUnit" }),
    (0, jackson_js_1.JsonClassType)({ type: () => [String] })
], IncludedCheckedBags.prototype, "weightUnit", void 0);
exports.IncludedCheckedBags = IncludedCheckedBags;
let FlightOffer = class FlightOffer {
    constructor(type, id, source, lastTicketingDate, instantTicketingRequired, nonHomogeneous, oneWay, numberOfBookableSeats, itineraries, price, travelerPricings) {
        this.type_ = type;
        this.id_ = id;
        //this.id = id;
        this.source_ = source;
        //this.source = source;
        this.lastTicketingDate_ = lastTicketingDate;
        this.instantTicketingRequired_ = instantTicketingRequired;
        this.nonHomogeneous_ = nonHomogeneous;
        this.oneWay_ = oneWay;
        this.numberOfBookableSeats_ = numberOfBookableSeats;
        this.itineraries_ = itineraries;
        this.price_ = price;
        this.arrival_ = { iataCode_: '', terminal_: '', at_: '' };
        this.departure_ = { iataCode_: '', terminal_: '', at_: '' };
        this.travelerPricings = travelerPricings;
        this.original = "";
    }
};
__decorate([
    (0, jackson_js_1.JsonProperty)(),
    (0, jackson_js_1.JsonClassType)({ type: () => [String] })
], FlightOffer.prototype, "type_", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)(),
    (0, jackson_js_1.JsonClassType)({ type: () => [String] })
], FlightOffer.prototype, "id_", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)(),
    (0, jackson_js_1.JsonClassType)({ type: () => [String] })
], FlightOffer.prototype, "source_", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)(),
    (0, jackson_js_1.JsonClassType)({ type: () => [String] })
], FlightOffer.prototype, "lastTicketingDate_", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)(),
    (0, jackson_js_1.JsonClassType)({ type: () => [Boolean] })
], FlightOffer.prototype, "instantTicketingRequired_", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)(),
    (0, jackson_js_1.JsonClassType)({ type: () => [Boolean] })
], FlightOffer.prototype, "nonHomogeneous_", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)(),
    (0, jackson_js_1.JsonClassType)({ type: () => [Boolean] })
], FlightOffer.prototype, "oneWay_", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)(),
    (0, jackson_js_1.JsonClassType)({ type: () => [String] })
], FlightOffer.prototype, "numberOfBookableSeats_", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)({ value: "travelerPricings" }),
    (0, jackson_js_1.JsonClassType)({ type: () => [Array, [TravelerPricings]] })
], FlightOffer.prototype, "travelerPricings", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)({ value: "itineraries" }),
    (0, jackson_js_1.JsonClassType)({ type: () => [Array, [Itineraries]] })
], FlightOffer.prototype, "itineraries_", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)({ value: "price" }),
    (0, jackson_js_1.JsonClassType)({ type: () => [Price] })
], FlightOffer.prototype, "price_", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)(),
    (0, jackson_js_1.JsonClassType)({ type: () => [Departure] })
], FlightOffer.prototype, "departure_", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)(),
    (0, jackson_js_1.JsonClassType)({ type: () => [Arrival] })
], FlightOffer.prototype, "arrival_", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)(),
    (0, jackson_js_1.JsonClassType)({ type: () => [String] })
], FlightOffer.prototype, "original", void 0);
FlightOffer = __decorate([
    (0, jackson_js_1.JsonIgnoreProperties)({
        value: ['pricingOptions', 'validatingAirlineCodes', 'travelerPricings']
    })
], FlightOffer);
exports.FlightOffer = FlightOffer;
//# sourceMappingURL=FlightOffer.js.map