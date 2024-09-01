export class Resultat {
    _id:any;
    titre!: string;
    description!: string;
    avancement!: number;
    etat_avancement!: 'Non commencé'|  'En cours'|  'Terminé';
    objectifID! :string;
}

