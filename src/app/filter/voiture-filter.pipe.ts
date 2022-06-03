import { Pipe, PipeTransform } from '@angular/core';
import { Voiture } from '../model/voiture';

@Pipe({
  name: 'voitureFilter'
})
export class VoitureFilterPipe implements PipeTransform {

  transform(voitures: Voiture[], searchValue: string): Voiture[] {
    if (!voitures || !searchValue) {
      return voitures;
    }

    return voitures.filter(voiture => {
      return voiture?.matricule?.toLowerCase().includes(searchValue.toLowerCase()) ||
        voiture?.marque?.toLowerCase().includes(searchValue.toLowerCase()) ||
        voiture?.model?.toLowerCase().includes(searchValue.toLowerCase()) ||
        voiture?.carburant?.toLowerCase().includes(searchValue.toLowerCase()) ||
        voiture?.couleur?.toLowerCase().includes(searchValue.toLowerCase())

    })
  }

}
