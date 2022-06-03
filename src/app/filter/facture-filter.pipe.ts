import { Pipe, PipeTransform } from '@angular/core';
import { Facture } from '../model/facture';

@Pipe({
  name: 'factureFilter'
})
export class FactureFilterPipe implements PipeTransform {

  transform(facture: Facture[], searchValue: string): Facture[] {
    if (!facture || !searchValue) {
      return facture;
    }
    return facture.filter(facture => {
      return facture.contrat?.numContrat.toLowerCase().includes(searchValue.toLowerCase()) ||
        facture.id.toLowerCase().includes(searchValue.toLowerCase()) ||
        facture.contrat?.dateCreated?.toString().includes(searchValue.toLowerCase()) ||
        facture.contrat?.voiture.marque?.toLowerCase().includes(searchValue.toLowerCase()) ||
        facture.contrat?.voiture.model?.toLowerCase().includes(searchValue.toLowerCase()) ||
        facture.contrat?.voiture.matricule?.toLowerCase().includes(searchValue.toLowerCase()) ||
        facture.contrat?.driverOne?.nom?.toLowerCase().includes(searchValue.toLowerCase()) ||
        facture.contrat?.driverOne?.prenom?.toLowerCase().includes(searchValue.toLowerCase()) ||
        facture.contrat?.dateDepart?.toString().includes(searchValue.toLowerCase()) ||
        facture.contrat?.dateRetour?.toString().includes(searchValue.toLowerCase())

    })
  }

}
