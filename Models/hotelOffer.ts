import { JsonProperty, JsonClassType, JsonIgnoreProperties, JsonIgnore } from "jackson-js";
import { ChangeStreamRefineCollectionShardKeyDocument } from "mongodb";
export class hotelInfos {

    public constructor(hotelId: string, name: string, dupeId: string, iataCode: string, chainCode: string, geoCode: geoCode) {
        this.hotelId_ = hotelId;
        this.name_ = name;
        this.dupeId_ = dupeId;
        this.iataCode_ = iataCode;
        this.chainCode_ = chainCode;
        this.geoCode_ = geoCode;
    }
    @JsonProperty({ value: "hotelId" })
    @JsonClassType({ type: () => [String] })
    hotelId_: string;

    @JsonProperty({ value: "name" })
    @JsonClassType({ type: () => [String] })
    name_: string;

    @JsonProperty({ value: "dupeId" })
    @JsonClassType({ type: () => [String] })
    dupeId_: string;

    @JsonProperty({ value: "iataCode" })
    @JsonClassType({ type: () => [String] })
    iataCode_: string;

    @JsonProperty({ value: "chainCode" })
    @JsonClassType({ type: () => [String] })
    chainCode_: string;

    @JsonProperty({ value: "geoCode" })
    @JsonClassType({ type: () => [geoCode] })
    geoCode_: geoCode;



}

export class geoCode {
    public constructor(latitude: string, longitude: string) {
        this.latitude_ = latitude;
        this.longitude_ = longitude;
    }
    @JsonProperty({ value: "latitude" })
    @JsonClassType({ type: () => [String] })
    latitude_: string;

    @JsonProperty({ value: "longitude" })
    @JsonClassType({ type: () => [String] })
    longitude_: string;
}

export class hotelOffer {

    public constructor(id: string, checkInDate: string, checkOutDate: string, rateCode: string, boardType: string, guests: guests, room: room, price: price, policies: policies, chainCode: string, geoCode: geoCode) {
        this.id_ = id;
        this.checkInDate_ = checkInDate;
        this.checkOutDate_ = checkOutDate;
        this.rateCode_ = rateCode;
        this.boardType_ = boardType;
        this.room_ = room;
        this.price_ = price;
        this.policies_ = policies;
        this.chainCode_ = chainCode;
        this.geoCode_ = geoCode;
        this.guests_ = guests;
    }
    @JsonProperty({ value: "id" })
    @JsonClassType({ type: () => [String] })
    id_: string;

    @JsonProperty({ value: "checkInDate" })
    @JsonClassType({ type: () => [String] })
    checkInDate_: string;

    @JsonProperty({ value: "checkOutDate" })
    @JsonClassType({ type: () => [String] })
    checkOutDate_: string;

    @JsonProperty({ value: "rateCode" })
    @JsonClassType({ type: () => [String] })
    rateCode_: string;

    @JsonProperty({ value: "boardType" })
    @JsonClassType({ type: () => [String] })
    boardType_: string;

    @JsonProperty({ value: "room" })
    @JsonClassType({ type: () => [room] })
    room_: room;

    @JsonProperty({ value: "guests" })
    @JsonClassType({ type: () => [guests] })
    guests_: guests;

    @JsonProperty({ value: "price" })
    @JsonClassType({ type: () => [price] })
    price_: price;

    @JsonProperty({ value: "policies" })
    @JsonClassType({ type: () => [policies] })
    policies_: policies;


    @JsonProperty({ value: "chainCode" })
    @JsonClassType({ type: () => [String] })
    chainCode_: string;

    @JsonProperty({ value: "geoCode" })
    @JsonClassType({ type: () => [geoCode] })
    geoCode_: geoCode;

}
export class room {
    public constructor(type: string, typeEstimated: typeEstimated, description: description) {
        this.type_ = type;
        this.typeEstimated_ = typeEstimated;
        this.description_ = description;
    }
    @JsonProperty({ value: "type" })
    @JsonClassType({ type: () => [String] })
    type_: string;

    @JsonProperty({ value: "typeEstimated" })
    @JsonClassType({ type: () => [typeEstimated] })
    typeEstimated_: typeEstimated;

    @JsonProperty({ value: "description" })
    @JsonClassType({ type: () => [description] })
    description_: description;

}

export class typeEstimated {
    public constructor(type: string, checkInDate: string, checkOutDate: string, rateCode: string, boardType: string, room: room) {
    }

}

export class guests {
    public constructor(type: string, checkInDate: string, checkOutDate: string, rateCode: string, boardType: string, room: room) {
    }
}

class price {
    public constructor(type: string, checkInDate: string, checkOutDate: string, rateCode: string, boardType: string, room: room) {
    }
}

class policies {
    public constructor(guarantee: guarantee, paymentType: string, cancellation: cancellation) {
        this.guarantee_ = guarantee;
        this.paymentType_ = paymentType;
        this.cancellation_ = cancellation;
    }

    @JsonProperty({ value: "guarantee" })
    @JsonClassType({ type: () => [guarantee] })
    guarantee_: guarantee;

    @JsonProperty({ value: "paymentType" })
    @JsonClassType({ type: () => [String] })
    paymentType_: string;

    @JsonProperty({ value: "cancellation" })
    @JsonClassType({ type: () => [cancellation] })
    cancellation_: cancellation;
}

class description {
    public constructor(text: string, lang: string) {
        this.text_ = text;
        this.lang_ = lang;
    }

    @JsonProperty({ value: "text" })
    @JsonClassType({ type: () => [String] })
    text_: string;

    @JsonProperty({ value: "lang" })
    @JsonClassType({ type: () => [String] })
    lang_: string;
}

class guarantee{
    public constructor(acceptedPayments: acceptedPayments) {
        this.acceptedPayments_ = acceptedPayments;
    }

    @JsonProperty({ value: "acceptedPayments" })
    @JsonClassType({ type: () => [acceptedPayments] })
    acceptedPayments_: acceptedPayments;
}

class acceptedPayments{
    public constructor(creditCards: string[], methods: string[]) {
        this.creditCards_ = creditCards;
        this.methods_ = methods;
    }

    @JsonProperty({ value: "creditCards" })
    @JsonClassType({type: () => [Array, [String]]})
    creditCards_: string[];

    @JsonProperty({ value: "creditCards" })
    @JsonClassType({type: () => [Array, [String]]})
    methods_: string[];
}

class cancellation{
    public constructor(deadline: string) {
        this.deadline_ = deadline;
    }

    @JsonProperty({ value: "lang" })
    @JsonClassType({ type: () => [String] })
    deadline_: string;
}
