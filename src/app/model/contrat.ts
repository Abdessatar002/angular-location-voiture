import { Client } from "./client";
import { Voiture } from "./voiture";

export class Contrat {
    public id: number;
    public numContrat: string;
    public dateCreated: Date;
    public tarif: number;
    public avance: number;
    public numDay: number;
    public dateDepart: Date;
    public dateRetour: Date;
    public driverOne: Client;
    public driverTwo: Client;
    public voiture: Voiture;
    public caution: number;
    public payer: boolean;

}
