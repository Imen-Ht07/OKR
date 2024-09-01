export class Manager {
    _id!: any;
    photo?: string;
    cin!: string;
    nom!: string;
    prenom!: string;
    tel!: number;
    email!: string;
    dateEmbauche!: string;
    departement!: 'Développement Produit' | 'Commercial et Marketing' | 'Support et Service Client' |
        'Implémentation et Projets' | 'Ressources Humaines' | 'Finance et Administration' | 'International et Expansion';
    password!: string;
    role!: string;
}
