# ATLAS NATIONS V4

Simulation de gestion présidentielle en français, pensée pour une publication GitHub Pages. L'interface utilise un style institutionnel sombre, sans images générées ; les données politiques et économiques sont simulées pour le jeu.

## Fichiers

- `index.html` : structure de l'application et chargement des dépendances.
- `styles.css` : interface responsive.
- `app.js` : logique du jeu, simulation, actions et sauvegardes.
- `assets/favicon.svg` : icône.
- `.nojekyll` : publication GitHub Pages.

## Déploiement sur GitHub Pages

1. Décompressez l'archive.
2. Dans le dépôt GitHub du jeu, remplacez `index.html`, `styles.css`, `app.js`, `.nojekyll` et le dossier `assets/` par ceux de cette archive.
3. Dans **Settings → Pages**, choisissez la branche `main` et le dossier `/ (root)`.
4. Attendez que le déploiement Pages soit terminé, puis rechargez le site. Sur iPhone, fermez l'onglet puis rouvrez le site si l'ancienne version reste en cache.

## Fonctions incluses

- Création de partie avec pays, dirigeant, parti, difficulté et scénario.
- Tableau de bord avec PIB, solde budgétaire, dette, trésorerie, popularité et indicateurs sociaux.
- Budget ministériel modifiable, fiscalité configurable, emprunts et remboursement anticipé.
- Rédaction, dépôt, inscription au vote, vote et promulgation de projets de loi.
- Parlement, négociation de coalition, question de confiance et motion de censure simulées.
- Gestion des ministres, remaniement, projets nationaux avec progression et marchés publics.
- Diplomatie, actions bilatérales, accords commerciaux et registre des échanges.
- Carte interactive OpenStreetMap, unités de jeu sélectionnables, ordres de déplacement et progression mensuelle.
- Journal national, sauvegarde automatique locale, sauvegardes nommées, import/export JSON.

## Notes importantes

- La simulation fonctionne dans le navigateur, sans serveur ni compte. Les sauvegardes automatiques sont propres à l'appareil et au navigateur ; exportez un JSON pour transférer une campagne.
- La carte utilise Leaflet et les tuiles OpenStreetMap via Internet. Sans connexion, les modules de gestion continuent de fonctionner, mais la carte peut ne pas se charger.
- Les pays, indicateurs, relations commerciales, procédures, événements et résultats sont simplifiés et servent uniquement au jeu. Ce n'est pas une source officielle ou en temps réel.
- Les données de départ et les mécaniques peuvent nécessiter des ajustements d'équilibrage au fil des tests.
