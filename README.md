# Élan

App perso de Jules : séance quotidienne de calisthénie façon militaire (3 grades : Recrue, Soldat, Commando ; poids du corps, sans course, saut ni pivot) avec minuteur, routine de renforcement du genou, objectifs avec deadlines et rappels, et une progression façon jeu (XP, niveau, quêtes du jour, série, Hard Mode).

C'est une web app installable (PWA) : on l'ouvre dans Safari sur l'iPhone puis Partager → « Sur l'écran d'accueil ». Les données restent sur le téléphone.

## Modifier l'app
- Tout le code est dans `src/app.html` (chaque partie est un module : Aujourd'hui, Sport, Organisation, Progression, Réglages).
- Après une modification : `node build.mjs` régénère `index.html` et les icônes, puis incrémenter `VERSION` dans `sw.js` pour que l'iPhone récupère la nouvelle version.
