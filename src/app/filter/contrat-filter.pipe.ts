import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { Contrat } from '../model/contrat';

@Pipe({
  name: 'contratFilter'
})
export class ContratFilterPipe implements PipeTransform {

  constructor(private datePipe: DatePipe) { }

  transform(contarts: Contrat[], searchValue: string): Contrat[] {
    if (!contarts || !searchValue) {
      return contarts;
    }
    return contarts.filter(contrat => {
      return contrat.numContrat.toLowerCase().includes(searchValue.toLowerCase()) ||
        contrat.dateCreated.toString().includes(searchValue.toLowerCase()) ||
        contrat.voiture.marque.toLowerCase().includes(searchValue.toLowerCase()) ||
        contrat.voiture.model.toLowerCase().includes(searchValue.toLowerCase()) ||
        contrat.voiture.matricule.toLowerCase().includes(searchValue.toLowerCase()) ||
        contrat?.driverOne?.nom?.toLowerCase().includes(searchValue.toLowerCase()) ||
        contrat.driverOne.prenom.toLowerCase().includes(searchValue.toLowerCase()) ||
        contrat.dateDepart.toString().includes(searchValue.toLowerCase()) ||
        contrat?.dateRetour?.toString().includes(searchValue.toLowerCase())

    })
  }

}
