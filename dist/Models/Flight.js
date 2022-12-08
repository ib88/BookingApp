"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flight = exports.Price = exports.Segment = void 0;
const jackson_js_1 = require("jackson-js");
class Segment {
    constructor(price) {
        this.price_ = price;
    }
}
__decorate([
    (0, jackson_js_1.JsonProperty)()
], Segment.prototype, "price_", void 0);
exports.Segment = Segment;
class Price {
    constructor(price) {
        this.price_ = price;
    }
}
__decorate([
    (0, jackson_js_1.JsonProperty)()
], Price.prototype, "price_", void 0);
exports.Price = Price;
class Flight {
    constructor(price, departure) {
        this.price = price;
        this.departure = departure;
    }
}
__decorate([
    (0, jackson_js_1.JsonProperty)() //@JsonClassType({type: () => [String]})
], Flight.prototype, "price", void 0);
__decorate([
    (0, jackson_js_1.JsonProperty)() //@JsonClassType({type: () => [String]})
], Flight.prototype, "departure", void 0);
exports.Flight = Flight;
//# sourceMappingURL=Flight.js.map