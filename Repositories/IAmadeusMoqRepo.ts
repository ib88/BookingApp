//import { FlightInfo } from "Repositories/IFlightInfo";

 interface IAmadeusRepo {
   getCheapestFlightDates(source: string, destination: string): Promise<FlightInfo[]>;
   getFlightAvailability(source: string, destination: string, departureDate:string): Promise<FlightInfo[]>;
}

interface FlightInfo
{
    price: string
    departure: string
    returnDate: string
    source: string
    destination: string
    duration:string
}

export class AmadeusMockRepo implements IAmadeusRepo {

  async getCheapestFlightDates(source: string, destination: string): Promise<FlightInfo[]> {
    let flights: Array<FlightInfo> = [
      { source:'MAD', destination:'MUC', departure:'2022:11:11', returnDate: '2022:11:13', price:'133', duration:'12:21' },
      { source:'SEA', destination:'PAR', departure:'2022:11:15', returnDate: '2022:11:20', price:'133', duration:'12:21' },
    ];
    return flights;
  }

  async getFlightAvailability(source: string, destination: string): Promise<FlightInfo[]> {
    let flights: Array<FlightInfo> = [
      { source:'MAD', destination:'MUC', departure:'2022:11:11', returnDate: '2022:11:13', price:'133', duration:'12:21' },
      { source:'SEA', destination:'PAR', departure:'2022:11:15', returnDate: '2022:11:20', price:'133', duration:'12:21' },
    ];
    return flights;
  }

}