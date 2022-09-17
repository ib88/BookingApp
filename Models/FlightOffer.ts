import { JsonProperty, JsonClassType } from "jackson-js";


export class Segment {
    public constructor(segmentId: string, carrierCode:string, duration:string, numberOfStops:string, departure:Departure, arrival:Arrival) {
        this.segmentId_ = segmentId;
        this.carrierCode_ = carrierCode;
        this.numberOfStops_ = numberOfStops;
        this.departure_ = departure;
        this.arrival_ = arrival;
        this.duration_ = duration;
    }

    @JsonProperty()
    segmentId_: string;

    @JsonProperty()
    carrierCode_:string;

    @JsonProperty()
    duration_:string;

    @JsonProperty()
    numberOfStops_:string;

    @JsonProperty()
    departure_:Departure;

    @JsonProperty()
    arrival_:Arrival;
}

export class Departure{

    public constructor(iataCode: string, terminal: string, at: string) {
        this.iataCode_ = iataCode;
        this.terminal_ = terminal;
        this.at_ = at;
    }

    @JsonProperty()
    iataCode_: string;

    @JsonProperty()
    terminal_: string;

    @JsonProperty()
    at_: string;
}

export class Arrival{

    public constructor(iataCode: string, terminal: string, at: string) {
        this.iataCode_ = iataCode;
        this.terminal_ = terminal;
        this.at_ = at;
    }

    @JsonProperty()
    iataCode_: string;

    @JsonProperty()
    terminal_: string;

    @JsonProperty()
    at_: string;
}


export class Price {
    public constructor(price: number, currency: string, total: string) {
        this.price_ = price;
        this.currency_ = currency;
        this.total_ = total;
    }

    @JsonProperty()
    price_: number;

    @JsonProperty()
    currency_: string;

    @JsonProperty()
    total_: string;
}

export class Itineraries{
    public constructor(duration: string, segments: Segment[]) {
        this.duration_ = duration;
        this.segments_ = segments;
    }
    @JsonProperty()
    duration_: string;

    @JsonProperty()
    segments_: Segment[];
}

export class FlightOffer {

    public constructor(id:string, instantTicketingRequired: boolean, nonHomogeneous: boolean, oneWay:boolean, numberOfBookableSeats: string, itineraries:Itineraries[], price: Price, departure: Departure, arrival: Arrival) {
        
        this.id_ = id;
        this.instantTicketingRequired_ = instantTicketingRequired;
        this.nonHomogeneous_ = nonHomogeneous;
        this.oneWay_ = oneWay;
        this.numberOfBookableSeats_ = numberOfBookableSeats;
        this.itineraries_ = itineraries;
        this.price_ = price;
        this.departure_ = departure;
        this.arrival_ = arrival;
    }

    @JsonProperty() //@JsonClassType({type: () => [String]})
    id_:string;

    @JsonProperty() //@JsonClassType({type: () => [String]})
    instantTicketingRequired_:boolean;

    @JsonProperty() //@JsonClassType({type: () => [String]})
    nonHomogeneous_:boolean;

    @JsonProperty() //@JsonClassType({type: () => [String]})
    oneWay_:boolean;

    @JsonProperty() //@JsonClassType({type: () => [String]})
    numberOfBookableSeats_:string;

    @JsonProperty() //@JsonClassType({type: () => [String]})
    itineraries_:Itineraries[];


    @JsonProperty() //@JsonClassType({type: () => [String]})
    price_: Price;

    @JsonProperty() //@JsonClassType({type: () => [String]})
    departure_: Departure;

    @JsonProperty() //@JsonClassType({type: () => [String]})
    arrival_: Arrival;
}