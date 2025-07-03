# HoneyHTTP

Honeypot HTTP haute interaction. Le backend FastAPI expose des routes trompeuses et le frontend React s'y connecte pour simuler une interface d'administration.

## Langages Utilisés : 
- Python FastAPI 
- Base de donnée SQL 
- HTML/CSS/JS 
- 


## Fonctionnalités : 
- **Un système de journalisation**
- **Analyse d'attaques potentielles (par exemple : Injection SQL, XSS, )**
- **Capture des Attaques et Analyse**
L'objectif est d'enregistrer toutes les attaques et détecter des patterns malveillants.
- 📌 Journaliser toutes les requêtes suspectes
- 📌 Détecter des payloads courants et déclencher une alerte

- **Piéger les Hackers avec de Faux Fichiers Sensibles**
    - Ajout de fichiers factices
    📌robots.txt qui donne de faux endpoints Disallow: /admin
    📌wp-config.php avec de fausses clés API
    📌database.sql avec de faux utilisateurs/mots de passe

- **Conversation fictive entre administrateurs**
    - Discussion sur un serveur SSH exposé
    - Exemple : Alexandre UZAN demande à Julien Khalifa l'adresse IP et le port (10.0.0.42:2222, clé ed25519 factice)

- **Capture et Relecture des Attaques**
L'Objectif est d'enregistrer toutes les sessions et pouvoir les rejouer.
    - 📌 Enregistrement des requêtes HTTP en base de données
    - 📌 Création d’un mode de relecture (playback)

**Intégrer un Keylogger Web**
📌 Objectif : Capturer les entrées utilisateur côté frontend.

**Piéger les Uploads de Fichiers**
📌 Objectif : Capturer les fichiers malveillants envoyés par les attaquants.

- Attirer Plus d’Attaques

    - 📌 Exposer ton serveur à Internet
    - 📌 Créer des comptes factices sur des forums hackers avec ton IP
    - 📌 Attirer les scanners avec Shodan, Censys