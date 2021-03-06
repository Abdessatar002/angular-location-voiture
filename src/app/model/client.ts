import { Cin } from "./cin";
import { Document } from "./document";
import { Permis } from "./Permis";


export class Client {
    public id: number;

    public prenom: string;

    public nom: string;

    public dateDeNaissance: Date;


    public address: string;

    public tel: string;

    public clientDoc: Document[];

    public cin = new Cin();

    public permis: Permis;


    constructor() {
        this.nom = '';
        this.prenom = '';
        this.dateDeNaissance = null;
        this.address = '';
        this.tel = '';
        this.permis = new Permis();
        this.clientDoc = null;

    }

}