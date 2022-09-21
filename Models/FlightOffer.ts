import { JsonProperty, JsonClassType, JsonIgnoreProperties } from "jackson-js";

@JsonIgnoreProperties({
    ignoreUnknown:true
  })
export class Segment {
    public constructor(departure:Departure, arrival:Arrival, carrierCode:string,duration:string, id: string,  numberOfStops:string) {
        this.segmentId_ = id;
        this.carrierCode_ = carrierCode;
        this.numberOfStops_ = numberOfStops;
        this.departure_ = departure;
        this.arrival_ = arrival;
        this.duration_ = duration;
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
    value: ['base', 'fees','grandTotal']
  })
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
    value: ['pricingOptions', 'source','validatingAirlineCodes', 'travelerPricings']
  })
export class FlightOffer {

    public constructor(type:string, id:string, source:string, lastTicketingDate:string, instantTicketingRequired: boolean, nonHomogeneous: boolean, oneWay:boolean, numberOfBookableSeats: string, itineraries:Itineraries[], price: Price) {
        this.type_ = type;
        this.id_ = id;
        this.source_ = source;
        this.lastTicketingDate_ = lastTicketingDate;
        this.instantTicketingRequired_ = instantTicketingRequired;
        this.nonHomogeneous_ = nonHomogeneous;
        this.oneWay_ = oneWay;
        this.numberOfBookableSeats_ = numberOfBookableSeats;
        this.itineraries_ = itineraries;
        this.price_ = price;
        this.arrival_ = {iataCode_:'', terminal_:'', at_:''};
        this.departure_ = {iataCode_:'', terminal_:'', at_:''};
    }

    @JsonProperty() 
    @JsonClassType({type: () => [String]})
    type_:string;

    @JsonProperty() 
    @JsonClassType({type: () => [String]})
    id_:string;

    @JsonProperty() 
    @JsonClassType({type: () => [String]})
    source_:string;

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
}