"use strict";
//import { FlightInfo } from "Repositories/IFlightInfo";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try {
            step(generator.next(value));
        }
        catch (e) {
            reject(e);
        } }
        function rejected(value) { try {
            step(generator["throw"](value));
        }
        catch (e) {
            reject(e);
        } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmadeusMockRepo = void 0;
class AmadeusMockRepo {
    getCheapestFlightDates(source, destination) {
        return __awaiter(this, void 0, void 0, function* () {
            let flights = [
                { source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
                { source: 'SEA', destination: 'PAR', departure: '2022:11:15', returnDate: '2022:11:20', price: '133', duration: '12:21' },
            ];
            return flights;
        });
    }
}
exports.AmadeusMockRepo = AmadeusMockRepo;
//# sourceMappingURL=IAmadeusMoqRepo.js.map