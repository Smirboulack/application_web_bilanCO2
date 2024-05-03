# Aide routes API

## Routes pour les calculs

### Alimentation

`GET /alimentation/categories/:idCat` : pour récupérer un ensemble.
Les différentes catégories présentes dans la base de données sont les suivants :
| idCat | Type en BD |
|-----------|-----------|
| 0      | "Produit céréaliers"         |
| 1      | "Entrées et plats composés"  |
| 2      | "Matières grasses"           |
| 3      | "Produits laitiers"          |
| 4      | "Viandes, oeufs, poissons"   |
| 5      | "Glace et sorbets"           |
| 6      | "Fruits"                     |
| 7      | "Aides culinaires"           |
| 8      | "Légumes"                    |
| 9      | "Boissons"                   |

`GET /alimentation/:id` : pour récupérer un tuple particulier.

`PUT /alimentation/:id` : pour modifier un tuple.
Corps de la requête :
```
{
    total_co2 : nouvelleValeur (float)
}
```

### Numérique

`GET /numerique/` : pour récupérer tous les tuples de la table *numérique*.
`GET /numerique/:id` : pour récupérer un tuple via son id.
`PUT /numerique/:id` : pour modifier un tuple.
Corps de la requête :
```
{
    co2_construction : nouvelleValeur (float)
    co2_utilisation : nouvelleValeur (float)
    total_co2 : nouvelleValeur (float)
}
```
`total_co2`doit être égal à `co2_utilisation` + `co2_construction`.

### Transport

`GET /transport/` : pour récupérer tous les tuples de la table *transport*.
`GET /transport/:id` : pour récupérer un tuple via son id.
`PUT /transport/:id` : pour modifier un tuple.
Corps de la requête :
```
{
    co2_construction : nouvelleValeur (float)
    co2_utilisation : nouvelleValeur (float)
    total_co2 : nouvelleValeur (float)
}
```
`total_co2`doit être égal à `co2_utilisation` + `co2_construction`.