# ATLAS NATIONS — Simulation gouvernementale

**Version 3.0.0 · Application web statique · Langue : français**

ATLAS NATIONS est un jeu de stratégie et de gestion de l'État centré sur la présidence, les finances publiques, la procédure législative, les élections, la diplomatie, les investissements et une carte interactive des unités de simulation.

## Fonctionnalités incluses

- Tableau de bord : PIB simulé, recettes, dépenses, solde, dette, trésorerie, popularité et stabilité.
- Pays jouables : France, Allemagne, États-Unis, Canada, Japon et Brésil.
- Finances : budget détaillé par ministère, modification des crédits, emprunts souverains, charge d'intérêt, remboursements, journal du Trésor et export CSV.
- Fiscalité : modification de l'impôt sur le revenu, de l'impôt sur les sociétés, de la TVA et des accises, avec recalcul des recettes.
- Lois : rédaction, modification, dépôt, première lecture, seconde lecture, promulgation et prise en compte de coûts/recettes annuels.
- Parlement : groupes, sièges modifiables, seuil de majorité et vote de confiance.
- Élections : sondages, campagne, actions de campagne, budget de campagne et simulation d'un scrutin.
- Gouvernement : nomination, modification et révocation des ministres.
- Grands projets : création, budgets, échéances simulées, progression, suspension et reprise.
- Achats & marchés : catalogue d’approvisionnement, fournisseurs, commandes, coûts, délais de livraison, stock, annulation et export des commandes.
- Diplomatie et commerce : relations bilatérales, accords en négociation, signature, droits de douane et exportations/importations simulées.
- Défense : unités personnalisables sur carte, effectifs, disponibilité, destination, lignes de déplacement et suivi à l'avancement des jours.
- Société : indicateurs nationaux modifiables et effets de simulation.
- Sauvegarde locale, import/export JSON et exports CSV.

## Lancer en local

1. Décompressez le dossier.
2. Ouvrez `index.html` avec un navigateur récent.
3. Pour une expérience plus fiable, utilisez un serveur local dans ce dossier :

   ```bash
   python -m http.server 8000
   ```

   Ouvrez ensuite `http://localhost:8000`.

La simulation ne nécessite ni compte, ni serveur applicatif, ni clé API, ni étape de compilation.

## Publication sur GitHub Pages

1. Dans votre dépôt GitHub, téléversez **tous** les fichiers du dossier à la racine (`index.html`, `styles.css`, `app.js`, `README.md`, `assets/`).
2. Faites un commit sur la branche `main`.
3. Dans **Settings → Pages**, sélectionnez **Deploy from a branch**, branche `main`, dossier `/(root)`, puis enregistrez.
4. Attendez le déploiement GitHub Pages, ouvrez l'URL publiée puis faites `Ctrl + F5` pour ignorer le cache.

Aucune compilation n'est nécessaire.

## Carte et connexion

La carte interactive utilise **Leaflet** et les tuiles cartographiques d'**OpenStreetMap**. Une connexion Internet est donc nécessaire pour charger les fonds de carte et les fichiers CDN. Le reste de la simulation est local. En mode hors ligne, les données et les autres pages restent disponibles, mais la carte peut ne pas se charger.

## Sauvegarde et confidentialité

La partie est conservée dans le stockage local du navigateur sur l'appareil utilisé. Elle n'est pas synchronisée entre plusieurs appareils. Utilisez **Sauvegarde & options → Télécharger la sauvegarde JSON** pour conserver ou transférer une partie.

## Limites de conception

Les comptes, votes, sondages, événements, relations diplomatiques, coûts, unités et effets macroéconomiques sont des règles de jeu simplifiées. Ils ne constituent pas des données officielles, des prévisions économiques ou un système d'information gouvernemental réel. Les positions et trajectoires sur la carte sont des marqueurs fictifs contrôlés par le joueur ; les mouvements sont abstraits, et ne correspondent pas à des flux opérationnels en direct.

## Arborescence

```text
atlas-nations/
├── index.html       # structure de l'application
├── styles.css       # interface institutionnelle responsive
├── app.js           # données, règles du jeu, interactions et sauvegarde
├── README.md        # documentation et déploiement
├── LICENSE          # licence MIT
└── assets/
    └── favicon.svg  # symbole vectoriel conçu pour le jeu
```

## Modifier le jeu

- Les pays et leurs valeurs initiales se trouvent dans `COUNTRIES` au début de `app.js`.
- Les budgets initiaux par mission se trouvent dans `MINISTRIES_DEFAULT`.
- Les unités de départ se trouvent dans `UNIT_TEMPLATES`.
- Les pages sont rendues par les fonctions `pageOverview()`, `pageFinance()`, `pageTaxes()`, `pageBills()`, `pageParliament()`, `pageElections()`, `pageProcurement()`, `pageDefense()`, etc.
- Les formulaires sont traités dans le gestionnaire `submit` de `app.js`.
- L'apparence générale, les couleurs et le responsive sont dans `styles.css`.

Licence : MIT. Consultez `LICENSE`.
