import { JsonProperty, JsonClassType, JsonIgnoreProperties, JsonIgnore } from "jackson-js";

@JsonIgnoreProperties({
    ignoreUnknown:true
  })
export class Segment {
    public constructor(departure:Departure, arrival:Arrival, carrierCode:string,duration:string, id: string,  numberOfStops:string, additionalServices:additionalServices[]) {
        this.segmentId_ = id;
        this.carrierCode_ = carrierCode;
        this.numberOfStops_ = numberOfStops;
        this.departure_ = departure;
        this.arrival_ = arrival;
        this.duration_ = duration;
        this.carrierName_ = "";
        //this.additionalServices_ = additionalServices;
    }

    @JsonProperty({value: "id"})
    @JsonClassType({type: () => [String]})
    segmentId_: string;

    @JsonProperty({value: "carrierCode"})
    @JsonClassType({type: () => [String]})
    carrierCode_:string;

    @JsonProperty({value: "duration"})
    @JsonClassType({type: () => [String]})
    duration_:string;

    @JsonProperty({value: "numberOfStops"})
    @JsonClassType({type: () => [String]})
    numberOfStops_:string;

    @JsonProperty({value: "departure"})
    @JsonClassType({type: () => [Departure]})
    departure_:Departure;

    @JsonProperty({value: "arrival"})
    @JsonClassType({type: () => [Arrival]})
    arrival_:Arrival;

    @JsonProperty()
    @JsonClassType({type: () => [String]})
    carrierName_:string;

    // @JsonProperty({value: "additionalServices"})
    // @JsonClassType({type: () => [Array, [additionalServices]]})
    // additionalServices_: additionalServices[];
 
}

// @JsonIgnoreProperties({
//     ignoreUnknown:true
//   })
export class additionalServices{

    public constructor(amount: string, type: string) {
        this.amount_ = amount;
        this.type_ = type;
    }
    @JsonProperty({value: "amount"})
    @JsonClassType({type: () => [String]})
    amount_: string;
    @JsonProperty({value: "type"})
    @JsonClassType({type: () => [String]})
    type_: string;
}

export class Departure{

    public constructor(iataCode: string, terminal: string, at: string) {
        this.iataCode_ = iataCode;
        this.terminal_ = terminal;
        this.at_ = at;
    }

    @JsonProperty({value: "iataCode"})
    @JsonClassType({type: () => [String]})
    iataCode_: string;

    @JsonProperty({value: "terminal"})
    @JsonClassType({type: () => [String]})
    terminal_: string;

    @JsonProperty({value: "at"})
    @JsonClassType({type: () => [String]})
    at_: string;
}

export class Arrival{

    public constructor(iataCode: string, terminal: string, at: string) {
        this.iataCode_ = iataCode;
        this.terminal_ = terminal;
        this.at_ = at;
    }

    @JsonProperty({value: "iataCode"})
    @JsonClassType({type: () => [String]})
    iataCode_: string;

    @JsonProperty({value: "terminal"})
    @JsonClassType({type: () => [String]})
    terminal_: string;

    @JsonProperty({value: "at"})
    @JsonClassType({type: () => [String]})
    at_: string;
}

@JsonIgnoreProperties({
    value: ['base', 'fees','grandTotal','additionalServices']
  })

//   @JsonIgnoreProperties({
//     ignoreUnknown:true
//   })
export class Price {
    public constructor(total: string, currency: string, grandTotal: string) {
        this.total_ = total;
        this.currency_ = currency;
        this.grandTotal_ = grandTotal;
    }

    @JsonProperty({value: "total"})
    @JsonClassType({type: () => [String]})
    total_: string;

    @JsonProperty({value: "currency"})
    @JsonClassType({type: () => [String]})
    currency_: string;

    @JsonProperty({value: "grandTotal"})
    @JsonClassType({type: () => [String]})
    grandTotal_: string;
}

@JsonIgnoreProperties({
    ignoreUnknown:true
  })
export class Itineraries{
    public constructor(duration: string, segments: Segment[]) {
        this.duration_ = duration;
        this.segments_ = segments;
    }
    @JsonProperty({value: "duration"})
    @JsonClassType({type: () => [String]})
    duration_: string;

    @JsonProperty({value: "segments"})
    @JsonClassType({type: () => [Array, [Segment]]})
    segments_: Segment[];
}

@JsonIgnoreProperties({
    ignoreUnknown:true
  })
export class TravelerPricings{
    public constructor(travelerId: string, fareOption:string, travelerType:string, price:Price, fareDetailsBySegment:FareDetailsBySegment[]) {
        this.travelerId = travelerId;
        this.fareOption = fareOption;
        this.travelerType = travelerType;
        this.price = price;
        this.fareDetailsBySegment = fareDetailsBySegment;
    }
    @JsonProperty({value: "travelerId"})
    @JsonClassType({type: () => [String]})
    travelerId: string;

    @JsonProperty({value: "fareOption"})
    @JsonClassType({type: () => [String]})
    fareOption: string;

    @JsonProperty({value: "travelerType"})
    @JsonClassType({type: () => [String]})
    travelerType: string;

    @JsonProperty({value: "price"})
    @JsonClassType({type: () => [Price]})
    price: Price;

    @JsonProperty({value: "fareDetailsBySegment"})
    @JsonClassType({type: () => [Array, [FareDetailsBySegment]]})
    fareDetailsBySegment: FareDetailsBySegment[];
}

@JsonIgnoreProperties({
    ignoreUnknown:true
  })
export class FareDetailsBySegment{
    public constructor(segmentId: string, cabin:string, fareBasis:string, includedCheckedBags:IncludedCheckedBags) {
        this.segmentId = segmentId;
        this.cabin = cabin;
        this.fareBasis = fareBasis;
        //this.class = class;
        this.class_ = "";
        this.includedCheckedBags = includedCheckedBags;
    }
    @JsonProperty({value: "segmentId"})
    @JsonClassType({type: () => [String]})
    segmentId: string;

    @JsonProperty({value: "cabin"})
    @JsonClassType({type: () => [String]})
    cabin: string;

    @JsonProperty({value: "fareBasis"})
    @JsonClassType({type: () => [String]})
    fareBasis: string;

    @JsonProperty({value: "class"})
    @JsonClassType({type: () => [String]})
    class_: string;

    @JsonProperty({value: "includedCheckedBags"})
    @JsonClassType({type: () => [IncludedCheckedBags]})
    includedCheckedBags: IncludedCheckedBags;

}

@JsonIgnoreProperties({
    ignoreUnknown:true
  })
export class IncludedCheckedBags{
    public constructor(weight: string, weightUnit:string) {
        this.weight = weight;
        this.weightUnit = weightUnit;
    }

    @JsonProperty({value: "weight"})
    @JsonClassType({type: () => [String]})
    weight: string;

    @JsonProperty({value: "weightUnit"})
    @JsonClassType({type: () => [String]})
    weightUnit: string;

}


// @JsonIgnoreProperties({
//     value: ['pricingOptions', 'validatingAirlineCodes', 'travelerPricings', 'additionalServices']
//   })

  @JsonIgnoreProperties({
    ignoreUnknown:true
  })
export class FlightOffer {

    public constructor(type:string, id:string, source:string, lastTicketingDate:string, instantTicketingRequired: boolean, nonHomogeneous: boolean, oneWay:boolean, numberOfBookableSeats: string, itineraries:Itineraries[], price: Price, travelerPricings:TravelerPricings[]) {
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
        this.arrival_ = {iataCode_:'', terminal_:'', at_:''};
        this.departure_ = {iataCode_:'', terminal_:'', at_:''};
        this.travelerPricings = travelerPricings;
        this.original = "";
    }

    @JsonProperty() 
    @JsonClassType({type: () => [String]})
    type_:string;

    @JsonProperty() 
    @JsonClassType({type: () => [String]})
    id_:string;

    // @JsonProperty() 
    // @JsonClassType({type: () => [String]})
    // id:string;

    @JsonProperty() 
    @JsonClassType({type: () => [String]})
    source_:string;

    // @JsonProperty() 
    // @JsonClassType({type: () => [String]})
    // source:string;

    @JsonProperty() 
    @JsonClassType({type: () => [String]})
    lastTicketingDate_:string;

    @JsonProperty() 
    @JsonClassType({type: () => [Boolean]})
    instantTicketingRequired_:boolean;

    @JsonProperty() 
    @JsonClassType({type: () => [Boolean]})
    nonHomogeneous_:boolean;

    @JsonProperty() 
    @JsonClassType({type: () => [Boolean]})
    oneWay_:boolean;

    @JsonProperty() 
    @JsonClassType({type: () => [String]})
    numberOfBookableSeats_:string;

    @JsonProperty({value:"travelerPricings"}) 
    @JsonClassType({type: () => [Array, [TravelerPricings]]})
    travelerPricings:TravelerPricings[];
    
    @JsonProperty({value:"itineraries"}) 
    @JsonClassType({type: () => [Array, [Itineraries]]})
    itineraries_:Itineraries[];

    @JsonProperty({value:"price"}) 
    @JsonClassType({type: () => [Price]})
    price_: Price;

    @JsonProperty() 
    @JsonClassType({type: () => [Departure]})
    departure_: Departure;

    @JsonProperty() 
    @JsonClassType({type: () => [Arrival]})
    arrival_: Arrival;

    @JsonProperty() 
    @JsonClassType({type: () => [String]})
    original: string;
}