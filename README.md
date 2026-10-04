# Élan

App perso de Jules : séance de sport quotidienne (~20 min, poids du corps, sans course ni saut) avec minuteur, routine de renforcement du genou, objectifs avec deadlines et rappels.

C'est une web app installable (PWA) : on l'ouvre dans Safari sur l'iPhone puis Partager → « Sur l'écran d'accueil ». Les données restent sur le téléphone.

## Modifier l'app
- Tout le code est dans `src/app.html` (chaque partie est un module : Aujourd'hui, Sport, Organisation, Réglages).
- Après une modification : `node build.mjs` régénère `index.html` et les icônes, puis incrémenter `VERSION` dans `sw.js` pour que l'iPhone récupère la nouvelle version.
