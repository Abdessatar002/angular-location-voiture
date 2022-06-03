export class Voiture {
    public id: number;

    public matricule: string;

    public marque: string;

    public model: string;

    public carburant: string;

    public couleur: string;

    public numChassis: string;

    public imageUrl: string;

    public voitureDoc: Document[];

    public numPlace: number;

    public caution: number;

    public tarif: number;

    public gearbox: string;

    public assurance: Date;

    public createdAt: Date;

    public dateDeRetour: Date;

    public dateDeDepart: Date;

    public visiteTechnique: Date;

    public taxe: Date;

    public active: boolean;

    constructor() {
        this.matricule = '';
        this.marque = '';
        this.model = '';
        this.carburant = '';
        this.couleur = '';
        this.numChassis = '';
        this.imageUrl = '';
        this.numPlace = null;
        this.tarif = null;
        this.assurance = null;
        this.visiteTechnique = null;
        this.taxe = null;
        this.active = true;
        this.gearbox = '';


    }
}