# Winess - Votre Application de Sport Personnalisée

Winess est une application sportive complète conçue pour aider les utilisateurs à atteindre leurs objectifs de fitness. Avec des métriques personnalisées, des plans alimentaires et des programmes d'entraînement, Winess fournit tous les outils nécessaires pour améliorer votre santé et rester motivé.

## Fonctionnalités

- **Gestion des utilisateurs** : Inscription et authentification sécurisées.
- **Suivi des métriques** : Suivez des données clés comme le poids, la taille, l'IMC et l'âge.
- **Plans alimentaires** : Programmes alimentaires personnalisés avec des recettes détaillées.
- **Programmes d'entraînement** : Plans d'entraînement adaptés avec des ressources visuelles optionnelles.

## Structure de la Base de Données

L'application utilise une base de données MySQL avec les tables principales suivantes :
- `users` : Contient les informations des utilisateurs comme le nom d'utilisateur, l'email et le mot de passe.
- `user_metrics` : Suit les métriques de santé des utilisateurs comme l'IMC, le poids et la taille.
- `user_diets` : Contient les plans alimentaires personnalisés et les recettes.
- `user_programs` : Stocke les programmes d'entraînement et les ressources associées.

## Démarrage

1. Clonez le dépôt sur votre machine locale.
2. Configurez la base de données MySQL en utilisant le fichier `script.sql` fourni.
3. Configurez le backend et démarrez le serveur.
4. Accédez à l'application via l'interface frontend.

## Technologies Utilisées

- **Backend** : MySQL pour la gestion de la base de données.
- **Frontend** : À intégrer (par exemple, React, Angular, etc.).
- **Autres outils** : JSON pour stocker les recettes et les détails des programmes.

## Contribution

N'hésitez pas à contribuer au projet en soumettant des pull requests ou en signalant des problèmes. Ensemble, nous pouvons améliorer Winess !

## Licence

Ce projet est sous licence MIT.
