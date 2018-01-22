# Présentation

**Cette application Desktop à pour but de vous faciliter la vie, en vous permettant la création des branches en un seul clique à savoir dans les repos suivant :**

- `Intranet`
- `People`
- `Club business`
- `Core`
- `Css`
- `Dashboard`
- `Transaction`

en un clique elle crée la branche désirée dans l'ensemble de ses repos, et modifie le package.json de chaque repo pour pointer vers la bonne branche

de plus vous pouvez modifier la version si vous le souhaitez

il faut noter que les 3 premier input sont obligatoire :
Input 1 : chemin vers votre repertoire intranet (cliquer sur l'icône qui ressemble à un fichier pour choisir le path)
Input 2 : Nom de la branche source qui existe déja, à partir de la quelle vous souhaitez tirez la votre (par exemple master ou develop .. etc)
Input 3: Nom de la branche destination, celle que vous souhaitez créer
Input 4 : si vous souhaitez garder la meme version des package.json de la branche source dans votre branche destination laisser ce champ décoché, si vous le cocher, un autre input réappaitra pour vos demander un numéro de version, ainsi vous aurez un numéro différent de celle que vous avez dans la branche source

# Utilisation

- `git clone` pour récupérer le projet
- `npm i` pour installer les dépendences
- `npm start` pour lancer l'application

# TODO
- Ajouter la fonctionnalité : supprimer une branche de tout les repos
- git checkout dans tout les repos
- lancement de certaines commandes comme celle de translation
- pour d'autres idées je suis preneur :D

# Captures d'écran
![Capture d'écran 1](https://i.imgur.com/wBuL8eP.png)
![Capture d'écran 2](https://i.imgur.com/AkNSrjy.png)
![Capture d'écran 3](https://i.imgur.com/dKTd6TW.png)
