# Projet Transversal : Eco+

Début projet - 01/03/2024

## Dépendances

Pour travailler sur le projet, il est nécessaire d'installer plusieurs éléments en amont.

### Node.js / npm :

Pour installer Node.js et npm sur macOS/linux :
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 20
```
Sur Windows :
```
choco install nodejs-lts --version="20.12.2"
```
Pour vérifier que tout est bien installé :
```
node -v
npm -v
```

## Pour lancer le projet en local :

### Client

En se positionnant dans le répertoire `client/` :
```
npm install
```
Pour configurer les variables d'environnements utilisées par le client :
```
cp .env.example .env
```
Le fichier `.env` contient l'URL utilisée par le serveur du projet en local. Il est possible de la changer si le port 9001 est déjà occupé. Il ne faudra donc pas oublié de modifier aussi le port dans le fichier `backend/server.js`.
Pour lancer le client :
```
npm start
```
Cette commande ouvrira une fenêtre sur le navigueur vers l'URL [http://localhost:3000](http://localhost:3000).

### Base de données

Pour travailler en local, il est nécessaire de configurer une base de données gérée en Postgres. Une fois la base de données créée, il faudra lui donner le [script SQL](https://forge.univ-lyon1.fr/mif10_grp3/eco_plus/-/wikis/Architecture#script-de-création-de-tables-et-associations) qui contient la création des différentes tables nécessaires au projet.

### Serveur

En se positionnant dans le répertoire `backend/` :
```
npm install
```
Pour configurer les variables d'environnements utilisées par le serveur :
```
cp .env.example .env
```
Le fichier `.env` contient les informations nécessaires pour connecter le serveur à la base de données en local. Il est important de modifier les éléments de ce fichier afin de le faire correspondre à vos informations de base de données (nom d'utilisateur, mot de passe, port...).
Pour lancer le serveur :
```
npm run start
```
Attention, si des modifications sont effectuées côté serveur, il faudra arrêter le serveur et relancer la commande.
Pour éviter d'avoir à relancer le serveur plusieurs fois, vous pouvez installer nodemon :
```
npm install -g nodemon
```
et lancer la commande suivante :
```
npm run dev
```
Maintenant, plus besoin de relancer le serveur à chaque modification.