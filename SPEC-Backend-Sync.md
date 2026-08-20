# Spec technique — Backend partagé pour "Portefeuille initiatives IA"

## Objectif
Remplacer le stockage `localStorage` (propre à chaque navigateur) par une API + base de données partagée, pour que les modifications d'un utilisateur soient visibles par tous.

## État actuel (à remplacer)
Tout est dans `data.js`, persisté via `localStorage` sous 3 clés :

| Clé localStorage | Contenu | Fonctions actuelles |
|---|---|---|
| `ia-portfolio-data-v1` | Liste des initiatives | `loadData()`, `saveData(list)` |
| `ia-portfolio-schema-v3` | Schéma du portefeuille (catégories + ordre des initiatives, pour le drag&drop) | `loadPortfolioSchema()`, `savePortfolioSchema(schema)` |
| `ia-portfolio-custom-widgets-v1` | Widgets graphiques personnalisés du dashboard | `loadCustomWidgets()`, `saveCustomWidgets(list)` |

Le composant appelle ces fonctions au chargement (`componentDidMount`) et à chaque modification (édition de fiche, drag&drop, ajout/suppression de légende, etc.).

## Modèle de données — Initiative (objet JS actuel, à répliquer en base)
```json
{
  "id": "ini-xxxxxxx",
  "macroDomain": "DWP - Platforms",
  "subDomain": "string",
  "editor": "string",
  "product": "string",
  "tool": "string",
  "model": "string",
  "status": "Déployé | En test | À tester | Non évalué",
  "souverainete": "Souverain | Non souverain | Interne | À définir",
  "marker": { "symbol": "string", "color": "#hex" },
  "legendTags": ["legend-deployed", "..."],
  "producedInFrance": false,
  "wantsFranceProduction": false,
  "description": {
    "description": "string", "useCase": "string", "businessValue": "string",
    "targetPopulation": "string", "comments": "string"
  },
  "governance": {
    "responsible": "string", "updateDate": "YYYY-MM-DD", "source": "string",
    "dependencies": "string", "prerequisites": "string"
  },
  "prioritization": { "moscow": "Must|Should|Could|Won't|À qualifier", "level": "L1-L4" },
  "risksData": { "level": "Faible|Moyen|Élevé|À évaluer", "blockers": ["string"], "watchPoints": ["string"] },
  "roi": { "inputs": { "U":0,"T":0,"M":0,"S":0,"H":0,"R":0,"L":0,"D":0,"I":0,"C":0,"SUP":0 } | null, "calcDate": "YYYY-MM-DD | null" },
  "documentation": { "items": [] }
}
```

Le schéma de portefeuille (`schema`) est un tableau de catégories :
```json
[{ "id": "cat-id", "title": "DWP - Platforms", "subtitle": "string", "items": ["ini-id-1", "ini-id-2"] }]
```

Et `schemaLegend` (liste de légendes, actuellement en mémoire, à faire persister aussi) :
```json
[{ "id": "legend-deployed", "title": "Déployées", "symbol": "line-solid", "color": "#2454C7" }]
```

## Endpoints à créer

| Méthode | Route | Usage |
|---|---|---|
| GET | `/api/initiatives` | Charger toutes les initiatives |
| POST | `/api/initiatives` | Créer une initiative |
| PUT | `/api/initiatives/:id` | Mettre à jour une initiative (statut, ROI, légendes assignées, etc.) |
| DELETE | `/api/initiatives/:id` | Supprimer une initiative |
| GET | `/api/schema` | Charger le schéma du portefeuille (catégories + ordre) |
| PUT | `/api/schema` | Sauvegarder le schéma complet (après drag&drop) |
| GET | `/api/legend` | Charger la liste des légendes |
| PUT | `/api/legend` | Sauvegarder la liste des légendes (ajout/suppression/édition) |
| GET | `/api/widgets` | Charger les widgets personnalisés du dashboard |
| PUT | `/api/widgets` | Sauvegarder les widgets personnalisés |

Toutes les routes `PUT`/`POST`/`DELETE` doivent renvoyer l'objet ou la liste à jour, pour que le front resynchronise son état local.

## Rafraîchissement multi-utilisateurs
Deux options, par complexité croissante :
1. **Polling simple** (recommandé pour démarrer) : le front recharge `/api/initiatives`, `/api/schema`, `/api/legend` toutes les 5-10 secondes via `setInterval`, et fusionne avec l'état local.
2. **Temps réel** : ajouter un WebSocket (ou Server-Sent Events) qui pousse un événement `updated` à tous les clients connectés dès qu'une route d'écriture est appelée ; le front réagit en rechargeant les données concernées.

## Changements côté front (`data.js`)
Remplacer chaque paire `load*`/`save*` par des équivalents `fetch()` :
```js
export async function loadData() {
  const res = await fetch('/api/initiatives');
  return res.json();
}
export async function saveData(initiatives) {
  // à remplacer par des PUT/POST/DELETE unitaires par initiative modifiée,
  // plutôt qu'un renvoi de la liste complète, pour éviter les écrasements concurrents
}
```
Point d'attention : le code actuel appelle `saveData(fullList)` à chaque modification (renvoi de la liste entière). En passant à une API partagée, il vaut mieux passer à des appels unitaires (`PUT /api/initiatives/:id` avec uniquement le patch) pour éviter qu'un utilisateur n'écrase les changements d'un autre survenus entre temps.

## Déploiement GitLab interne
- Repo front (ce fichier) : GitLab Pages, build statique.
- Repo backend : API + connexion DB, déployé sur un serveur interne (CI/CD GitLab classique : build → test → deploy).
- Configurer CORS sur l'API pour autoriser l'origine du front (URL GitLab Pages).
