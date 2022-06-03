import { Pipe, PipeTransform } from '@angular/core';
import { Client } from '../model/client';

@Pipe({
  name: 'clientFilter'
})
export class ClientFilterPipe implements PipeTransform {

  transform(clients: Client[], searchValue: string): Client[] {
    if (!clients || !searchValue) {
      return clients
    }
    return clients.filter(client => {
      return client?.nom?.toLowerCase().includes(searchValue.toLowerCase()) ||
        client?.prenom?.toLowerCase().includes(searchValue.toLowerCase()) ||
        client?.tel?.toLowerCase().includes(searchValue.toLowerCase()) ||
        client?.address?.toLowerCase().includes(searchValue.toLowerCase()) ||
        client?.cin?.cinId?.toLowerCase().includes(searchValue.toLowerCase()) ||
        client?.permis?.permisId?.toLowerCase().includes(searchValue.toLowerCase())
    })
  }

}
