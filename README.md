Sujet : Créateur d'application web de facturation normalisée (Conformité RDC)

Consigne : Agis en tant que développeur web et consultant fiscal. Crée une application web interactive (HTML/CSS/JS) permettant de générer une facture conforme à la législation de la République Démocratique du Congo.

Détails techniques :

Format : Un seul fichier HTML incluant le CSS et le JavaScript.

Design : Professionnel, épuré, optimisé pour l'impression A4.

Fonctionnalité : Calcul automatique de la TVA (16%), de la base imposable et du net à payer.

Champs obligatoires à inclure (RDC) :

Émetteur : Nom/Raison sociale, Adresse, N° RCCM, N° Identification Nationale, N° Impôt (Numéro d'Immatriculation Fiscale).

Client : Nom, Adresse, N° Impôt (si professionnel).

Détails Facture : Numéro de facture (séquentiel), Date d'émission.

Tableau des produits : Désignation, Quantité, Prix Unitaire Hors TVA, Total HT.

Calculs : Sous-total HT, TVA (16%), Total TTC (Net à payer).

Mention légale : Zone pour le code QR (simulé) ou le numéro de série de la machine fiscale (DGI).

Fonctionnalités JS attendues :

Possibilité d'ajouter/supprimer des lignes d'articles dynamiquement.

Mise à jour des totaux en temps réel lors de la saisie des prix.

Bouton "Imprimer" qui lance la fonction window.print() en cachant les boutons de saisie pour n'imprimer que la facture propre.

Quelques conseils pour ton projet "RDC"
Le Numéro d'Impôt (NI) : C'est l'élément central en RDC. Assure-toi que l'application permet de bien le mettre en évidence, car une facture sans le NI du fournisseur n'est pas déductible pour le client.

La TVA à 16% : En RDC, le taux standard est de 16%. Le prompt demande spécifiquement ce calcul à l'IA.

Le Code QR : Actuellement, la DGI tend vers l'usage de dispositifs électroniques fiscaux (E-Fiscale). Pour ton application, tu peux demander à l'IA d'ajouter une bibliothèque comme qrcode.js si tu veux aller plus loin et générer un vrai code de vérification.
