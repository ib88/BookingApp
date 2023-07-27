import { JsonProperty, JsonClassType, JsonIgnoreProperties, JsonIgnore } from "jackson-js";
import { ChangeStreamRefineCollectionShardKeyDocument } from "mongodb";

export class testClass {
    public constructor(name: string, age: string) {
        this.name_ = name;
        this.age_ = age;

    }

    @JsonProperty({ value: "name" })
    @JsonClassType({ type: () => [String] })
    name_: string;

    @JsonProperty({ value: "age" })
    @JsonClassType({ type: () => [String] })
    age_: string;
}


@JsonIgnoreProperties({
    ignoreUnknown: true
})
export class hotelInfos {

    public constructor(type: string, hotelId: string, name: string, dupeId: string, iataCode: string, chainCode: string, geoCode: geoCode) {
        this.type_ = type;
        this.hotelId_ = hotelId;
        this.name_ = name;
        this.dupeId_ = dupeId;
        this.iataCode_ = iataCode;
        this.chainCode_ = chainCode;
        this.geoCode_ = geoCode;
    }

    @JsonProperty({ value: "type" })
    @JsonClassType({ type: () => [String] })
    type_: string;

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

@JsonIgnoreProperties({
    ignoreUnknown:true
  })
export class hotelOffer {

    public constructor(id: string, checkInDate: string, checkOutDate: string, rateCode: string, category:string, rateFamilyEstimated: rateFamilyEstimated, commission: commission, boardType: string, guests: guests, room: room, price: price, policies: policies, chainCode: string, geoCode: geoCode, self: string) {
        this.id_ = id;
        this.checkInDate_ = checkInDate;
        this.checkOutDate_ = checkOutDate;
        this.rateCode_ = rateCode;
        this.category_ = category;
        this.rateFamilyEstimated_ = rateFamilyEstimated;
        this.commission_ = commission;
        this.boardType_ = boardType;
        this.room_ = room;
        this.price_ = price;
        this.policies_ = policies;
        this.chainCode_ = chainCode;
        this.geoCode_ = geoCode;
        this.guests_ = guests;
        this.self_ = self;
        this.original = "";
        this.hotelName_ = "";
    

    }

    //@JsonProperty({ value: "hotel" })
    hotelInfos_: hotelInfos | undefined;

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

    @JsonProperty({ value: "category" })
    @JsonClassType({ type: () => [String] })
    category_: string;

    @JsonProperty({ value: "rateFamilyEstimated" })
    @JsonClassType({ type: () => [rateFamilyEstimated] })
    rateFamilyEstimated_: rateFamilyEstimated;



    @JsonProperty({ value: "commission" })
    @JsonClassType({ type: () => [commission] })
    commission_: commission;

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

    @JsonProperty({ value: "self" })
    @JsonClassType({ type: () => [String] })
    self_: string;

    @JsonProperty()
    @JsonClassType({ type: () => [String] })
    original: string;

    @JsonProperty()
    @JsonClassType({ type: () => [String] })
    hotelName_: string;
}
export class room {
    public constructor(type: string, typeEstimated: typeEstimated, description: description, category:string, beds:string, bedType:string) {
        this.type_ = type;
        this.typeEstimated_ = typeEstimated;
        this.description_ = description;
        this.category_ = category;
        this.beds_ = beds;
        this.bedType_ = bedType;
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

    @JsonProperty({ value: "category" })
    @JsonClassType({ type: () => [String] })
    category_: string;

    @JsonProperty({ value: "beds" })
    @JsonClassType({ type: () => [String] })
    beds_: string;

    @JsonProperty({ value: "bedType" })
    @JsonClassType({ type: () => [String] })
    bedType_: string;
}

export class typeEstimated {
    public constructor(category: string, beds: string, bedType: string) {
        this.category_ = category;
        this.beds_ = beds;
        this.bedType_ = bedType;
    }

    @JsonProperty({ value: "category" })
    @JsonClassType({ type: () => [String] })
    category_: string;

    @JsonProperty({ value: "beds" })
    @JsonClassType({ type: () => [String] })
    beds_: string;

    @JsonProperty({ value: "bedType" })
    @JsonClassType({ type: () => [String] })
    bedType_: string;

}

export class rateFamilyEstimated {
    public constructor(code: string, type: string) {
        this.code_ = code;
        this.type_ = type;
    }

    @JsonProperty({ value: "code" })
    @JsonClassType({ type: () => [String] })
    code_: string;

    @JsonProperty({ value: "type" })
    @JsonClassType({ type: () => [String] })
    type_: string;

}

export class commission {
    public constructor(percentage: string) {
        this.percentage_ = percentage;

    }

    @JsonProperty({ value: "percentage" })
    @JsonClassType({ type: () => [String] })
    percentage_: string;


}



export class guests {
    public constructor(adults: string) {
        this.adults_ = adults;
    }
    @JsonProperty({ value: "adults" })
    @JsonClassType({ type: () => [String] })
    adults_: string;
}

class price {
    public constructor(base: string, currency: string, total: string, variations: variations) {
        this.currency_ = currency;
        this.total_ = total;
        this.variations_ = variations;
        this.base_ = base;
    }

    @JsonProperty({ value: "base" })
    @JsonClassType({ type: () => [String] })
    base_: string;

    @JsonProperty({ value: "currency" })
    @JsonClassType({ type: () => [String] })
    currency_: string;

    @JsonProperty({ value: "total" })
    @JsonClassType({ type: () => [String] })
    total_: string;

    @JsonProperty({ value: "variations" })
    @JsonClassType({ type: () => [variations] })
    variations_: variations;
}

@JsonIgnoreProperties({
    ignoreUnknown:true
  })
class policies {
    public constructor(guarantee: guarantee, paymentType: string, cancellation: cancellations[]) {
        this.guarantee_ = guarantee;
        this.paymentType_ = paymentType;
        this.cancellations_ = cancellation;
    }

    @JsonProperty({ value: "guarantee" })
    @JsonClassType({ type: () => [guarantee] })
    guarantee_: guarantee;

    @JsonProperty({ value: "paymentType" })
    @JsonClassType({ type: () => [String] })
    paymentType_: string;

    @JsonProperty({ value: "cancellations" })
    @JsonClassType({ type: () => [Array, [cancellations]] })
    cancellations_: cancellations[];
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

class guarantee {
    public constructor(acceptedPayments: acceptedPayments) {
        this.acceptedPayments_ = acceptedPayments;
    }

    @JsonProperty({ value: "acceptedPayments" })
    @JsonClassType({ type: () => [acceptedPayments] })
    acceptedPayments_: acceptedPayments;
}

class acceptedPayments {
    public constructor(creditCards: string[], methods: string[]) {
        this.creditCards_ = creditCards;
        this.methods_ = methods;
    }

    @JsonProperty({ value: "creditCards" })
    @JsonClassType({ type: () => [Array, [String]] })
    creditCards_: string[];

    @JsonProperty({ value: "methods" })
    @JsonClassType({ type: () => [Array, [String]] })
    methods_: string[];
}


@JsonIgnoreProperties({
    ignoreUnknown:true
  })
class cancellations {
    public constructor(amount: string, deadline: string, numberOfNights: string) {
        this.deadline_ = deadline;
        this.numberOfNights_ = numberOfNights;
        this.amount_ = amount;
    }

    @JsonProperty({ value: "amount" })
    @JsonClassType({ type: () => [String] })
    amount_: string;

    @JsonProperty({ value: "deadline" })
    @JsonClassType({ type: () => [String] })
    deadline_: string;

    @JsonProperty({ value: "numberOfNights" })
    @JsonClassType({ type: () => [String] })
    numberOfNights_: string;
}

class average {
    public constructor(base: string) {
        this.base_ = base;
    }

    @JsonProperty({ value: "base" })
    @JsonClassType({ type: () => [String] })
    base_: string;
}

class variations {
    public constructor(average: average, changes: changes[]) {
        this.average_ = average;
        this.changes_ = changes;
    }

    @JsonProperty({ value: "average" })
    @JsonClassType({ type: () => [average] })
    average_: average;

    @JsonProperty({ value: "changes" })
    @JsonClassType({ type: () => [Array, [changes]] })
    changes_: changes[];
}

class changes {
    public constructor(startDate: string, endDate: string, base: string) {
        this.startDate_ = startDate;
        this.endDate_ = endDate;
        this.base_ = base;
    }

    @JsonProperty({ value: "startDate" })
    @JsonClassType({ type: () => [String] })
    startDate_: string;

    @JsonProperty({ value: "endDate" })
    @JsonClassType({ type: () => [String] })
    endDate_: string;

    @JsonProperty({ value: "base" })
    @JsonClassType({ type: () => [String] })
    base_: string;
}


