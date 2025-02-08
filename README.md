
# Backend Facebook

Ce projet est une implémentation de serveur backend pour une application de type Facebook, construite avec **NestJS**, **TypeScript** et **Prisma** pour la gestion de la base de données.

## Fonctionnalités

- Authentification et autorisation des utilisateurs
- Gestion des publications (création, lecture, mise à jour, suppression)
- Gestion des demandes d'amis
- Notifications en temps réel

## Installation

Clonez le répertoire :

```bash
git clone https://github.com/SylnavyVcode/back-end-facebook.git
cd back-end-facebook
```

Installez les dépendances :

```bash
npm install
```

## Scripts disponibles

- **Mode Développement :**  
  ```bash
  npm run start:dev
  ```

- **Mode Production :**  
  ```bash
  npm run start:prod
  ```

- **Tests Unitaires :**  
  ```bash
  npm run test
  ```

- **Tests End-to-End :**  
  ```bash
  npm run test:e2e
  ```

## Configuration de la base de données

1. Créez un fichier `.env` avec les informations de connexion à votre base de données.
2. Exécutez les migrations avec Prisma :

```bash
npx prisma migrate deploy
```

## Déploiement

Pour le déploiement, vous pouvez utiliser des plateformes comme **Heroku**, **AWS** ou **DigitalOcean**. Consultez la [documentation de NestJS](https://docs.nestjs.com) pour plus de détails sur le déploiement.

## License

Ce projet est sous la licence **MIT**.
```

N'hésitez pas à ajouter ou modifier des informations spécifiques à votre projet dans cette base !
