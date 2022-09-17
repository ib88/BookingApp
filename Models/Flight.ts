import { JsonProperty, JsonClassType } from "jackson-js";

export class Segment {
    public constructor(price: number) {
        this.price_ = price;
    }

    @JsonProperty()
    price_: number;
}

export class Price {
    public constructor(price: number) {
        this.price_ = price;
    }

    @JsonProperty()
    price_: number;
}

export class Flight {

    public constructor(price: Price, departure: string) {
        this.price = price;
        this.departure = departure;
    }

    @JsonProperty() //@JsonClassType({type: () => [String]})
    price: Price;

    @JsonProperty() //@JsonClassType({type: () => [String]})
    departure: string;
}