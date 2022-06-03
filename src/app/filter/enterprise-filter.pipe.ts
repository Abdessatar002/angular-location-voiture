import { Pipe, PipeTransform } from '@angular/core';
import { Entreprise } from '../model/entreprise';

@Pipe({
  name: 'enterpriseFilter'
})
export class EnterpriseFilterPipe implements PipeTransform {

  transform(enterprise: Entreprise[], searchValue: string): Entreprise[] {
    if (!enterprise || !searchValue) {
      return enterprise
    }
    return enterprise.filter(client => {
      return client?.prenom?.toLowerCase().includes(searchValue.toLowerCase()) ||
        client?.tel?.toLowerCase().includes(searchValue.toLowerCase()) ||
        client?.address?.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
        client?.ice?.toLowerCase().includes(searchValue.toLowerCase())
    })
  }

}
