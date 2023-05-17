import { JsonProperty, JsonClassType, JsonIgnoreProperties, JsonIgnore } from "jackson-js";
export class hotelInfos{

    public constructor(hotelId: string, name: string, dupeId: string, iataCode:string, chainCode:string, geoCode:geoCode) {
        this.hotelId_ = hotelId;
        this.name_ = name;
        this.dupeId_ = dupeId;
        this.iataCode_ = iataCode;
        this.chainCode_ = chainCode;
        this.geoCode_ = geoCode;
    }
    @JsonProperty({value: "hotelId"})
    @JsonClassType({type: () => [String]})
    hotelId_: string;

    @JsonProperty({value: "name"})
    @JsonClassType({type: () => [String]})
    name_: string;

    @JsonProperty({value: "dupeId"})
    @JsonClassType({type: () => [String]})
    dupeId_: string;

    @JsonProperty({value: "iataCode"})
    @JsonClassType({type: () => [String]})
    iataCode_: string;

    @JsonProperty({value: "chainCode"})
    @JsonClassType({type: () => [String]})
    chainCode_: string;

    @JsonProperty({value: "geoCode"})
    @JsonClassType({type: () => [geoCode]})
    geoCode_: geoCode;

   
    
}

export class geoCode{
    public constructor(latitude: string, longitude: string) {
        this.latitude_ = latitude;
        this.longitude_ = longitude;
    }
    @JsonProperty({value: "latitude"})
    @JsonClassType({type: () => [String]})
    latitude_: string;

    @JsonProperty({value: "longitude"})
    @JsonClassType({type: () => [String]})
    longitude_: string;
}

export class hotelOffer{

    public constructor(id: string, checkInDate: string, checkOutDate: string, rateCode:string, boardType:string, room:room) {
        this.id_ = id;
        this.checkInDate_ = checkInDate;
        this.checkOutDate_ = checkOutDate;
        this.rateCode_ = rateCode;
        this.boardType_ = boardType;
        this.room_ = room;
    }
    @JsonProperty({value: "id"})
    @JsonClassType({type: () => [String]})
    id_: string;

    @JsonProperty({value: "checkInDate"})
    @JsonClassType({type: () => [String]})
    checkInDate_: string;

    @JsonProperty({value: "checkOutDate"})
    @JsonClassType({type: () => [String]})
    checkOutDate_: string;

    @JsonProperty({value: "rateCode"})
    @JsonClassType({type: () => [String]})
    rateCode_: string;

    @JsonProperty({value: "boardType"})
    @JsonClassType({type: () => [String]})
    boardType_: string;

    @JsonProperty({value: "room"})
    @JsonClassType({type: () => [room]})
    room_: room;

    @JsonProperty({value: "guests"})
    @JsonClassType({type: () => [guests]})
    guests_: guests;

    @JsonProperty({value: "price"})
    @JsonClassType({type: () => [price]})
    price_: price;

    @JsonProperty({value: "policies"})
    @JsonClassType({type: () => [policies]})
    policies_: policies;
    

    @JsonProperty({value: "chainCode"})
    @JsonClassType({type: () => [String]})
    chainCode_: string;

    @JsonProperty({value: "geoCode"})
    @JsonClassType({type: () => [geoCode]})
    geoCode_: geoCode;
    
}
export class room{
    public constructor(type: string, checkInDate: string, checkOutDate: string, rateCode:string, boardType:string, room:room) {
        this.id_ = id;
        this.checkInDate_ = checkInDate;
        this.checkOutDate_ = checkInDate;
        this.rateCode_ = rateCode;
        this.boardType_ = boardType;
        this.room = room;
    }
}
 export class typeEstimated{
    public constructor(type: string, checkInDate: string, checkOutDate: string, rateCode:string, boardType:string, room:room) {
    }

 }

 export class description{
    public constructor(type: string, checkInDate: string, checkOutDate: string, rateCode:string, boardType:string, room:room) {
    }
 }

 export class guests{
    public constructor(type: string, checkInDate: string, checkOutDate: string, rateCode:string, boardType:string, room:room) {
    }
 }

  class price{
    public constructor(type: string, checkInDate: string, checkOutDate: string, rateCode:string, boardType:string, room:room) {
    }
 }

  class policies{
    public constructor(type: string, checkInDate: string, checkOutDate: string, rateCode:string, boardType:string, room:room) {
    }
 }
