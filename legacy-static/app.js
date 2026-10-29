"use strict";

const products = [
  { id: "portable-bureau-occasion", name: "Portable bureautique — occasion", category: "computers", categoryLabel: "Ordinateur portable", badge: "SECONDE MAIN", description: "Pour documents et navigation web. État, configuration et garantie à vérifier.", price: 180000, art: "computer", mark: "SF", image: "images/portable-bureau-occasion.webp", blendBackground: true },
  { id: "portable-bureau-refurb", name: "Portable bureautique — reconditionné", category: "computers", categoryLabel: "Ordinateur portable", badge: "RECONDITIONNÉ", description: "Pour bureautique et navigation. Configuration et garantie à confirmer.", price: 245000, art: "computer", mark: "R", image: "images/portable-bureau-refurb.webp", blendBackground: true },
  { id: "portable-bureau-neuf", name: "Portable bureautique — neuf", category: "computers", categoryLabel: "Ordinateur portable", badge: "NEUF", description: "Pour bureautique et navigation. Référence et garantie à confirmer.", price: 385000, art: "computer", mark: "N", image: "images/portable-bureau-neuf.webp", blendBackground: true },
  { id: "portable-pro", name: "Portable professionnel", category: "computers", categoryLabel: "Ordinateur portable", badge: "PRO", description: "Pour le travail et le multitâche. Configuration et garantie à confirmer.", price: 465000, art: "computer", mark: "P", image: "images/portable-pro.webp", blendBackground: true },
  { id: "portable-etudiant", name: "Portable étudiant", category: "computers", categoryLabel: "Ordinateur portable", badge: "ÉTUDES", description: "Pour les cours et les recherches. Configuration et garantie à confirmer.", price: 295000, art: "computer", mark: "E", image: "images/portable-etudiant.webp", blendBackground: true },
  { id: "portable-gaming", name: "Portable gaming", category: "computers", categoryLabel: "Ordinateur portable", badge: "GAMING", description: "Pour le jeu sur ordinateur. Carte graphique et garantie à confirmer.", price: 780000, art: "computer", mark: "G", image: "images/portable-gaming.png" },
  { id: "portable-creation", name: "Portable création & graphisme", category: "computers", categoryLabel: "Ordinateur portable", badge: "CRÉATION", description: "Pour création graphique. Écran, configuration et garantie à confirmer.", price: 690000, art: "computer", mark: "C", image: "images/portable-creation.png", blendBackground: true },
  { id: "portable-compact", name: "Portable compact 13 pouces", category: "computers", categoryLabel: "Ordinateur portable", badge: "COMPACT", description: "Écran de 13 pouces pour travailler en déplacement. Configuration et garantie à confirmer.", price: 420000, art: "computer", mark: "13", image: "images/portable-compact.png" },
  { id: "portable-grand-ecran", name: "Portable grand écran 17 pouces", category: "computers", categoryLabel: "Ordinateur portable", badge: "17 POUCES", description: "Écran de 17 pouces pour un usage de bureau. Résolution et garantie à confirmer.", price: 560000, art: "computer", mark: "17", image: "images/portable-grand-ecran.png" },
  { id: "unite-centrale", name: "Unité centrale de bureau", category: "computers", categoryLabel: "Ordinateur de bureau", badge: "BUREAU", description: "Pour un poste informatique fixe. Configuration et garantie à confirmer.", price: 350000, art: "computer", mark: "PC", image: "images/unite-centrale.png" },
  { id: "pc-gaming-fixe", name: "PC fixe pour gaming", category: "computers", categoryLabel: "Ordinateur de bureau", badge: "GAMING", description: "Pour le jeu sur ordinateur. Composants et garantie à confirmer.", price: 850000, art: "computer", mark: "GX", image: "images/pc-gaming-fixe.png" },
  { id: "mini-pc", name: "Mini PC compact", category: "computers", categoryLabel: "Ordinateur de bureau", badge: "COMPACT", description: "Ordinateur de bureau compact pour la maison ou le travail. Configuration à confirmer.", price: 310000, art: "computer", mark: "M", image: "images/mini-pc.png" },
  { id: "tout-en-un", name: "Ordinateur tout-en-un", category: "computers", categoryLabel: "Ordinateur de bureau", badge: "TOUT-EN-UN", description: "Ordinateur et écran réunis. Taille, configuration et garantie à confirmer.", price: 520000, art: "computer", mark: "AIO", image: "images/tout-en-un.png" },
  { id: "ecran-24", name: "Écran externe 24 pouces", category: "displays", categoryLabel: "Écran externe", badge: "FULL HD", description: "Écran de 24 pouces pour ordinateur. Résolution et garantie à confirmer.", price: 95000, art: "display", mark: "24", image: "images/ecran-24.png" },
  { id: "ecran-27", name: "Écran externe 27 pouces", category: "displays", categoryLabel: "Écran externe", badge: "QHD", description: "Écran de 27 pouces pour ordinateur. Résolution et garantie à confirmer.", price: 175000, art: "display", mark: "27", image: "images/ecran-27.png" },
  { id: "ecran-gaming", name: "Écran gaming haute fréquence", category: "displays", categoryLabel: "Écran externe", badge: "GAMING", description: "Écran externe pour jeu. Fréquence, connectique et garantie à vérifier.", price: 230000, art: "display", mark: "GX", image: "images/ecran-gaming.png" },
  { id: "ecran-portable", name: "Écran portable USB-C", category: "displays", categoryLabel: "Écran externe", badge: "MOBILE", description: "Écran d’appoint transportable. Compatibilité USB-C et garantie à confirmer.", price: 145000, art: "display", mark: "USB", image: "images/ecran-portable.png" },
  { id: "clavier", name: "Clavier USB de bureau", category: "accessories", categoryLabel: "Accessoire & setup", badge: "BUREAU", description: "Clavier filaire USB pour ordinateur. Disposition et garantie à confirmer.", price: 12000, art: "accessories", mark: "K", image: "images/clavier.png" },
  { id: "clavier-gaming", name: "Clavier gaming rétroéclairé", category: "accessories", categoryLabel: "Accessoire & setup", badge: "GAMING", description: "Clavier pour jeu sur ordinateur. Disposition et garantie à confirmer.", price: 32000, art: "accessories", mark: "RGB", image: "images/clavier-gaming.png" },
  { id: "souris", name: "Souris sans fil", category: "accessories", categoryLabel: "Accessoire & setup", badge: "SANS FIL", description: "Souris sans fil pour ordinateur. Type de connexion et garantie à confirmer.", price: 9500, art: "accessories", mark: "M", image: "images/souris.png" },
  { id: "souris-gaming", name: "Souris gaming", category: "accessories", categoryLabel: "Accessoire & setup", badge: "GAMING", description: "Souris pour jeu sur ordinateur. Sensibilité et garantie à confirmer.", price: 18500, art: "accessories", mark: "G", image: "images/souris-gaming.png" },
  { id: "casque-audio", name: "Casque audio avec micro", category: "accessories", categoryLabel: "Audio", badge: "AUDIO", description: "Casque avec microphone pour appels et audio. Connexion et garantie à confirmer.", price: 24000, art: "accessories", mark: "H", image: "images/casque-audio.png" },
  { id: "ecouteurs", name: "Écouteurs filaires", category: "accessories", categoryLabel: "Audio", badge: "AUDIO", description: "Écouteurs filaires pour audio mobile ou ordinateur. Connecteur et garantie à vérifier.", price: 6500, art: "accessories", mark: "E", image: "images/ecouteurs.png" },
  { id: "casque-bluetooth", name: "Casque Bluetooth", category: "accessories", categoryLabel: "Audio", badge: "BLUETOOTH", description: "Casque sans fil Bluetooth pour écouter et échanger. Autonomie et garantie à confirmer.", price: 35000, art: "accessories", mark: "BT", image: "images/casque-bluetooth.png" },
  { id: "webcam", name: "Webcam USB", category: "accessories", categoryLabel: "Visioconférence", badge: "USB", description: "Webcam USB pour visioconférence. Résolution et garantie à confirmer.", price: 22000, art: "accessories", mark: "CAM", image: "images/webcam.png" },
  { id: "micro-usb", name: "Microphone USB", category: "accessories", categoryLabel: "Audio & setup", badge: "SETUP", description: "Microphone USB pour appels, cours et enregistrement. Modèle et garantie à confirmer.", price: 38000, art: "accessories", mark: "MIC", image: "images/micro-usb.png" },
  { id: "enceintes", name: "Enceintes pour ordinateur", category: "accessories", categoryLabel: "Audio & setup", badge: "AUDIO", description: "Enceintes pour diffuser le son d’un ordinateur. Alimentation et garantie à confirmer.", price: 19500, art: "accessories", mark: "S", image: "images/enceintes.png" },
  { id: "tapis-souris", name: "Tapis de souris grand format", category: "accessories", categoryLabel: "Accessoire & setup", badge: "SETUP", description: "Surface grand format pour souris et clavier. Dimensions et coloris à confirmer.", price: 10000, art: "accessories", mark: "PAD", image: "images/tapis-souris.png" },
  { id: "support-pc", name: "Support réglable pour ordinateur", category: "accessories", categoryLabel: "Accessoire & setup", badge: "ERGONOMIE", description: "Support pliable pour ordinateur portable. Dimensions et compatibilité à confirmer.", price: 17000, art: "accessories", mark: "ST", image: "images/support-pc.png" },
  { id: "refroidisseur", name: "Support ventilé pour portable", category: "accessories", categoryLabel: "Accessoire & setup", badge: "REFROIDISSEMENT", description: "Support ventilé pour ordinateur portable. Taille, alimentation et garantie à confirmer.", price: 22000, art: "accessories", mark: "FAN", image: "images/refroidisseur.png" },
  { id: "chargeur-portable", name: "Chargeur pour ordinateur portable", category: "accessories", categoryLabel: "Chargeur & alimentation", badge: "CHARGEUR", description: "Chargeur pour ordinateur portable. Tension, puissance, embout et garantie à vérifier.", price: 18000, art: "accessories", mark: "W", image: "images/chargeur-portable.png" },
  { id: "chargeur-usbc", name: "Chargeur USB-C pour ordinateur", category: "accessories", categoryLabel: "Chargeur & alimentation", badge: "USB-C", description: "Chargeur USB-C pour ordinateur compatible. Puissance et garantie à confirmer.", price: 25000, art: "accessories", mark: "C", image: "images/chargeur-usbc.png" },
  { id: "chargeur-universel", name: "Chargeur universel multi-embouts", category: "accessories", categoryLabel: "Chargeur & alimentation", badge: "UNIVERSEL", description: "Chargeur avec embouts interchangeables. Compatibilité et garantie à vérifier.", price: 28000, art: "accessories", mark: "U", image: "images/chargeur-universel.png" },
  { id: "hub-usb", name: "Hub USB multiports", category: "accessories", categoryLabel: "Adaptateur & connectique", badge: "USB", description: "Hub pour ajouter des ports USB à un ordinateur. Nombre de ports et garantie à confirmer.", price: 14000, art: "accessories", mark: "HUB", image: "images/hub-usb-multiports.png" },
  { id: "dock-usbc", name: "Station d’accueil USB-C", category: "accessories", categoryLabel: "Adaptateur & connectique", badge: "DOCK", description: "Station USB-C pour connecter des périphériques. Ports disponibles et garantie à vérifier.", price: 45000, art: "accessories", mark: "DOCK", image: "images/station-accueil-usbc.png" },
  { id: "adaptateur-hdmi", name: "Adaptateur HDMI / USB-C", category: "accessories", categoryLabel: "Adaptateur & connectique", badge: "HDMI", description: "Adaptateur HDMI vers USB-C. Compatibilité avec l’ordinateur à vérifier.", price: 12000, art: "accessories", mark: "HDMI", image: "images/adaptateur-hdmi-usbc.png" },
  { id: "cable-connectique", name: "Câbles USB, HDMI et réseau", category: "accessories", categoryLabel: "Câble & connectique", badge: "CONNECTIQUE", description: "Câbles pour données, affichage ou réseau. Type et longueur à choisir.", price: 5000, art: "accessories", mark: "↔", image: "images/cables-usb-hdmi-reseau.png" },
  { id: "ssd-256", name: "SSD interne 256 Go", category: "storage", categoryLabel: "Stockage interne", badge: "SSD · 256 GO", description: "256 Go pour le stockage interne. Format et garantie à confirmer.", price: 25000, art: "storage", mark: "SSD", image: "images/ssd-256-go.png" },
  { id: "ssd-512", name: "SSD interne 512 Go", category: "storage", categoryLabel: "Stockage interne", badge: "SSD · 512 GO", description: "512 Go pour le stockage interne. Format et garantie à confirmer.", price: 42000, art: "storage", mark: "SSD", image: "images/ssd-512-go.png" },
  { id: "ssd-1to", name: "SSD interne 1 To", category: "storage", categoryLabel: "Stockage interne", badge: "SSD · 1 TO", description: "1 To pour le stockage interne. Format et garantie à confirmer.", price: 72000, art: "storage", mark: "1TB", image: "images/ssd-1-to.png" },
  { id: "hdd-interne", name: "Disque dur interne 1 To", category: "storage", categoryLabel: "Stockage interne", badge: "HDD · 1 TO", description: "1 To de stockage interne HDD. Interface et garantie à confirmer.", price: 45000, art: "storage", mark: "HDD", image: "images/disque-dur-interne-1-to.png" },
  { id: "hdd-externe-1to", name: "Disque dur externe 1 To", category: "storage", categoryLabel: "Stockage externe", badge: "HDD · 1 TO", description: "1 To pour sauvegarder et transporter vos fichiers. Connexion et garantie à confirmer.", price: 55000, art: "storage", mark: "1TB", image: "images/disque-dur-externe-1-to.png" },
  { id: "hdd-externe-2to", name: "Disque dur externe 2 To", category: "storage", categoryLabel: "Stockage externe", badge: "HDD · 2 TO", description: "2 To pour sauvegarder et transporter vos fichiers. Connexion et garantie à confirmer.", price: 78000, art: "storage", mark: "2TB", image: "images/disque-dur-externe-2-to.png" },
  { id: "cle-usb", name: "Clé USB 64 Go", category: "storage", categoryLabel: "Stockage externe", badge: "64 GO", description: "64 Go pour transporter vos fichiers. Format et garantie à confirmer.", price: 7500, art: "storage", mark: "USB", image: "images/cle-usb-64-go.png" },
  { id: "carte-memoire", name: "Carte mémoire SD / microSD", category: "storage", categoryLabel: "Stockage externe", badge: "MÉMOIRE", description: "Carte mémoire pour appareil compatible. Capacité, format et garantie à confirmer.", price: 8500, art: "storage", mark: "SD", image: "images/carte-memoire-sd-microsd.png" },
  { id: "ram-ddr4", name: "Mémoire vive DDR4", category: "storage", categoryLabel: "Composant PC", badge: "RAM · DDR4", description: "Mémoire DDR4 pour ordinateur compatible. Capacité et garantie à confirmer.", price: 22000, art: "storage", mark: "RAM", image: "images/memoire-vive-ddr4.png" },
  { id: "ram-ddr5", name: "Mémoire vive DDR5", category: "storage", categoryLabel: "Composant PC", badge: "RAM · DDR5", description: "Mémoire DDR5 pour ordinateur compatible. Capacité et garantie à confirmer.", price: 38000, art: "storage", mark: "RAM", image: "images/memoire-vive-ddr5.png" },
  { id: "carte-graphique", name: "Carte graphique dédiée", category: "storage", categoryLabel: "Composant PC", badge: "GPU", description: "Carte graphique pour PC fixe. Modèle, alimentation requise et garantie à confirmer.", price: 195000, art: "storage", mark: "GPU", image: "images/carte-graphique.png" },
  { id: "carte-mere", name: "Carte mère pour ordinateur fixe", category: "storage", categoryLabel: "Composant PC", badge: "CARTE MÈRE", description: "Carte mère pour PC fixe. Socket, format et garantie à vérifier.", price: 85000, art: "storage", mark: "MB", image: "images/carte-mere.png" },
  { id: "boitier-pc", name: "Boîtier PC pour setup", category: "accessories", categoryLabel: "Composant PC", badge: "SETUP", description: "Boîtier pour assembler un PC fixe. Format, dimensions et garantie à confirmer.", price: 48000, art: "accessories", mark: "CASE", image: "images/boitier-pc-setup.png" },
  { id: "routeur-wifi", name: "Routeur Wi-Fi", category: "network", categoryLabel: "Réseau", badge: "WI-FI", description: "Routeur pour distribuer une connexion Wi-Fi. Couverture et garantie à confirmer.", price: 30000, art: "network", mark: "WiFi", image: "images/routeur-wifi.png" },
  { id: "adaptateur-wifi", name: "Adaptateur Wi-Fi USB", category: "network", categoryLabel: "Réseau", badge: "USB", description: "Adaptateur USB pour connexion Wi-Fi. Compatibilité et garantie à confirmer.", price: 10000, art: "network", mark: "WiFi", image: "images/adaptateur-wifi-usb.png" },
  { id: "onduleur", name: "Onduleur de protection", category: "network", categoryLabel: "Énergie & protection", badge: "ONDULEUR", description: "Onduleur pour protéger un équipement en cas de coupure. Puissance et autonomie à confirmer.", price: 58000, art: "network", mark: "UPS", image: "images/onduleur-protection.png" },
  { id: "multiprise", name: "Multiprise parafoudre", category: "network", categoryLabel: "Énergie & protection", badge: "PROTECTION", description: "Multiprise avec protection contre les surtensions. Nombre de prises et garantie à vérifier.", price: 14000, art: "network", mark: "⚡", image: "images/multiprise-parafoudre.png" },
  { id: "sac-ordinateur", name: "Sac à dos pour ordinateur", category: "bags", categoryLabel: "Sac & transport", badge: "TRANSPORT", description: "Sac à dos pour transporter un ordinateur portable. Taille et coloris à confirmer.", price: 18000, art: "bag", mark: "B", image: "images/sac-a-dos-ordinateur.png" },
  { id: "housse-ordinateur", name: "Housse de protection pour portable", category: "bags", categoryLabel: "Sac & transport", badge: "PROTECTION", description: "Housse pour protéger un ordinateur portable. Dimensions et matière à confirmer.", price: 10000, art: "bag", mark: "S", image: "images/housse-protection-portable.png" },
  { id: "sacoche-ordinateur", name: "Sacoche professionnelle", category: "bags", categoryLabel: "Sac & transport", badge: "PRO", description: "Sacoche pour transporter un ordinateur et ses accessoires. Dimensions à confirmer.", price: 22000, art: "bag", mark: "P", image: "images/sacoche-professionnelle.png" }
];

const productPitches = {
  "portable-bureau-occasion": "Faites plus avec votre budget : votre prochain allié pour les cours et le quotidien vous attend chez Saïd.",
  "portable-bureau-refurb": "Envie d’un PC prêt à reprendre du service ? Venez découvrir une option reconditionnée adaptée à vos besoins.",
  "portable-bureau-neuf": "Le plaisir d’un nouveau départ numérique. Passez chez Saïd trouver le portable qui vous ressemble.",
  "portable-pro": "Vos projets méritent un vrai poste de pilotage. Trouvons ensemble le portable qui accompagne vos journées.",
  "portable-etudiant": "Cours, recherches, projets : équipez-vous pour avancer et réussir votre année.",
  "portable-gaming": "Entrez dans le jeu avec un portable pensé pour votre setup. Venez choisir la configuration qui vous convient.",
  "portable-creation": "Vos idées méritent un grand écran et le bon outil. Parlons du portable adapté à vos créations.",
  "portable-compact": "Un ordinateur qui vous suit partout ? Découvrez un format compact pour travailler en mouvement.",
  "portable-grand-ecran": "Plus d’espace pour vos fenêtres, vos films et vos projets : trouvez votre grand écran chez Saïd.",
  "unite-centrale": "Bâtissez un espace de travail à votre image. Choisissez votre ordinateur fixe avec les conseils de Saïd.",
  "pc-gaming-fixe": "Le setup gaming commence par le bon PC. Passez composer votre prochaine machine avec Saïd.",
  "mini-pc": "Petit format, grand gain de place : découvrez une solution discrète pour votre bureau ou votre maison.",
  "tout-en-un": "Moins de câbles, plus de place pour vos idées : explorez le confort d’un ordinateur tout-en-un.",
  "ecran-24": "Donnez de l’air à votre bureau : un écran externe pour mieux organiser vos tâches et votre setup.",
  "ecran-27": "Voyez vos projets en grand. Découvrez l’écran qui peut transformer votre espace de travail.",
  "ecran-gaming": "Votre setup mérite un écran à la hauteur de vos sessions. Venez comparer les options chez Saïd.",
  "ecran-portable": "Un deuxième écran, même en déplacement : ajoutez de l’espace à votre façon de travailler.",
  "clavier": "Chaque bonne idée commence quelque part. Trouvez le clavier qui vous donne envie de vous installer.",
  "clavier-gaming": "Du style sur le bureau, du répondant sous les doigts : faites évoluer votre setup gaming.",
  "souris": "Un geste plus simple, un bureau plus libre : choisissez votre prochaine souris sans fil.",
  "souris-gaming": "Ajustez votre setup à votre façon de jouer avec une souris conçue pour garder le contrôle.",
  "casque-audio": "Concentrez-vous, échangez, jouez : trouvez le casque avec micro qui vous accompagne partout.",
  "ecouteurs": "Vos appels et votre musique toujours à portée de main. Demandez le connecteur compatible avec votre appareil.",
  "casque-bluetooth": "Libérez vos mouvements et installez-vous dans votre son. Découvrez nos options Bluetooth.",
  "webcam": "Pour vos réunions et vos appels, équipez votre ordinateur d’une webcam USB.",
  "micro-usb": "Faites entendre vos idées clairement : découvrez le micro USB pour vos appels et créations.",
  "enceintes": "Faites sortir le son de votre écran. Ajoutez une touche audio à votre espace de travail.",
  "tapis-souris": "Un bureau plus net, une souris toujours à sa place : donnez la touche finale à votre setup.",
  "support-pc": "Rehaussez votre ordinateur et libérez votre espace de travail. Trouvez le support adapté à votre bureau.",
  "refroidisseur": "Quand l’ordinateur travaille, votre espace aussi mérite d’être bien équipé. Découvrez le support ventilé.",
  "chargeur-portable": "Votre chargeur est perdu ou fatigué ? Venez avec la référence de votre PC pour trouver le bon embout.",
  "chargeur-usbc": "Un seul câble pour repartir ? Vérifions ensemble la puissance USB-C compatible avec votre ordinateur.",
  "chargeur-universel": "Plusieurs embouts, une solution à choisir avec soin : apportez le modèle de votre PC pour vérifier.",
  "hub-usb": "Il vous manque toujours un port ? Ajoutez les connexions dont votre setup a besoin.",
  "dock-usbc": "Branchez votre univers de travail en un geste : explorez les stations d’accueil USB-C.",
  "adaptateur-hdmi": "Reliez votre ordinateur à un écran ou un projecteur. Vérifions la bonne connectique ensemble.",
  "cable-connectique": "Le bon câble fait toute la différence. Trouvez la longueur et le connecteur qu’il vous faut.",
  "ssd-256": "Donnez une nouvelle option de stockage à votre PC. Vérifions le format compatible avant de choisir.",
  "ssd-512": "Plus d’espace pour vos fichiers et vos projets : demandez le SSD adapté à votre ordinateur.",
  "ssd-1to": "Besoin de voir plus grand ? Découvrez une option SSD 1 To, à vérifier selon votre configuration.",
  "hdd-interne": "Ajoutez de l’espace à votre ordinateur fixe. Venez vérifier la compatibilité de votre disque interne.",
  "hdd-externe-1to": "Emportez vos documents où vous voulez avec un disque externe. Le bon stockage commence par le bon choix.",
  "hdd-externe-2to": "Vos fichiers prennent de la place ? Explorez une option de stockage externe 2 To.",
  "cle-usb": "Vos documents à portée de main, d’un ordinateur à l’autre. Choisissez la clé USB qui vous convient.",
  "carte-memoire": "Pour vos appareils et vos fichiers, trouvez le format de carte mémoire qu’il vous faut.",
  "ram-ddr4": "Votre PC peut-il accueillir plus de mémoire ? Vérifions le format et la capacité compatibles.",
  "ram-ddr5": "Envie de faire évoluer votre configuration ? Parlons de la mémoire DDR5 compatible avec votre machine.",
  "carte-graphique": "Pour le jeu ou la création, la bonne carte graphique dépend de votre configuration. Faisons le point.",
  "carte-mere": "Une pièce essentielle à remplacer ? Apportez la référence de votre PC pour trouver une carte mère compatible.",
  "routeur-wifi": "Un Wi-Fi mieux adapté à votre espace commence par le bon équipement. Parlons de vos besoins.",
  "adaptateur-wifi": "Ajoutez une connexion sans fil à votre ordinateur avec un adaptateur à vérifier selon votre système.",
  "onduleur": "Protégez votre installation des coupures avec un onduleur choisi selon vos appareils.",
  "multiprise": "Alimentez et organisez votre coin informatique avec une multiprise adaptée à votre installation.",
  "sac-ordinateur": "Emportez votre ordinateur et vos essentiels avec vous. Choisissez le sac adapté à votre format.",
  "housse-ordinateur": "Un peu plus de protection dans vos déplacements : vérifiez la taille de housse qui convient à votre PC.",
  "sacoche-ordinateur": "Pour le bureau, les rendez-vous et les trajets : trouvez une sacoche à la mesure de votre quotidien."
};

const cartStorageKey = "said-freres-cart-v1";
// Sécurité : garde-fous sur le panier stocké dans le navigateur (donnée non fiable).
const MAX_CART_ITEMS = 999;
const MAX_STORED_CART_LENGTH = 20000;
const productGrid = document.querySelector("#product-grid");
const headerSearchInput = document.querySelector("#header-search-input");
const emptyState = document.querySelector("#empty-state");
const cartDialog = document.querySelector("#cart-dialog");
const checkoutDialog = document.querySelector("#checkout-dialog");
const productDialog = document.querySelector("#product-dialog");
const toast = document.querySelector("#toast");
const loadMoreButton = document.querySelector("#load-more");
const hero = document.querySelector("#accueil");
const heroWaterRipple = document.querySelector(".hero-water-ripple");
let selectedCategory = "all";
const pageSize = 12;
let visibleProductCount = pageSize;
let cart = loadCart();
let toastTimeout;
let revealObserver;
let lastWaterRipple = 0;

function initializeHeroWaterEffect() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches
    || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  hero.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    const bounds = hero.getBoundingClientRect();
    hero.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
    hero.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
    hero.classList.add("pointer-active");

    const now = performance.now();
    if (lastWaterRipple && now - lastWaterRipple < 180) return;
    lastWaterRipple = now;
    heroWaterRipple.classList.remove("is-rippling");
    void heroWaterRipple.offsetWidth;
    heroWaterRipple.classList.add("is-rippling");
  });

  hero.addEventListener("pointerleave", () => {
    hero.classList.remove("pointer-active");
    heroWaterRipple.classList.remove("is-rippling");
  });
}

function loadCart() {
  try {
    const raw = localStorage.getItem(cartStorageKey);
    if (!raw || raw.length > MAX_STORED_CART_LENGTH) return Object.create(null);

    const stored = JSON.parse(raw);
    if (!stored || typeof stored !== "object" || Array.isArray(stored)) return Object.create(null);

    // Seuls des identifiants du catalogue et des quantités entières bornées sont conservés.
    // Aucun prix ne provient du navigateur : il est toujours relu depuis le catalogue.
    const cart = Object.create(null);
    let totalItems = 0;
    for (const [id, quantity] of Object.entries(stored)) {
      const isKnownProduct = products.some((product) => product.id === id && product.price !== null);
      if (!isKnownProduct || !Number.isSafeInteger(quantity) || quantity <= 0 || quantity > 99) continue;
      if (totalItems + quantity > MAX_CART_ITEMS) break;
      cart[id] = quantity;
      totalItems += quantity;
    }
    return cart;
  } catch (error) {
    console.warn("Le panier enregistré n’a pas pu être lu.", error);
    return Object.create(null);
  }
}

function saveCart() {
  try {
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  } catch (error) {
    console.error("Le panier n’a pas pu être enregistré dans ce navigateur.", error);
    showToast("Le navigateur n’a pas pu enregistrer votre panier.");
  }
}

function formatPrice(price) {
  return `${new Intl.NumberFormat("fr-FR").format(price)} F CFA`;
}

// Les données produit pourront venir d’une API : on échappe systématiquement les valeurs
// insérées dans du HTML (défense en profondeur contre le XSS, en plus de la CSP).
const HTML_ENTITIES = Object.freeze({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "`": "&#96;"
});

function escapeHtml(value) {
  return String(value).replace(/[&<>"'`]/g, (character) => HTML_ENTITIES[character]);
}

function renderProducts() {
  const query = headerSearchInput.value.trim().toLocaleLowerCase("fr");
  const matchingProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const pitch = productPitches[product.id] || product.description;
    const searchable = `${product.name} ${product.categoryLabel} ${pitch} ${product.badge}`.toLocaleLowerCase("fr");
    return matchesCategory && searchable.includes(query);
  });
  const visibleProducts = matchingProducts.slice(0, visibleProductCount);

  productGrid.innerHTML = visibleProducts.map((product) => {
    const name = escapeHtml(product.name);
    const id = escapeHtml(product.id);
    const image = escapeHtml(getProductImage(product));
    const badge = escapeHtml(product.badge);
    const description = escapeHtml(product.description);
    const blendedClass = product.blendBackground ? " product-image-blended" : "";
    const addButton = product.price === null
      ? ""
      : `<button class="add-button" type="button" data-add="${id}" aria-label="Ajouter ${name} au panier">+</button>`;
    return `
    <article class="product-card reveal" tabindex="0" aria-label="Afficher les détails de ${name}" aria-haspopup="dialog" data-product-card="${id}">
      <div class="product-art">
        <span class="product-badge">${badge}</span>
        <img class="product-image${blendedClass}" data-product-image src="${image}" alt="${name}" height="120">
      </div>
      <div class="product-details">
        <h3>${name}</h3>
        <p class="product-description">${description}</p>
        <div class="product-bottom">
          <div>
            <div class="product-price">${product.price === null ? "Sur devis" : formatPrice(product.price)}</div>
            <div class="product-condition">${product.price === null ? "Prix à confirmer" : "Prix de démonstration"}</div>
          </div>
          <div class="product-actions">
            ${addButton}
          </div>
        </div>
      </div>
    </article>`;
  }).join("");
  setProductImageFallback(productGrid);
  document.querySelector("#results-count").textContent = matchingProducts.length
    ? `Affichage de ${visibleProducts.length} article${visibleProducts.length > 1 ? "s" : ""} sur ${matchingProducts.length}`
    : "0 article trouvé";
  emptyState.hidden = matchingProducts.length > 0;
  loadMoreButton.hidden = visibleProducts.length >= matchingProducts.length;
  if (revealObserver) {
    productGrid.querySelectorAll(".reveal").forEach((card, index) => {
      card.style.transitionDelay = `${Math.min(index % pageSize, 5) * 55}ms`;
      revealObserver.observe(card);
    });
  } else {
    productGrid.querySelectorAll(".reveal").forEach((card) => card.classList.add("is-visible"));
  }
}

function setProductImageFallback(container) {
  container.querySelectorAll("img[data-product-image]").forEach((image) => {
    const showPlaceholder = () => {
      if (image.dataset.fallbackApplied) return;
      image.dataset.fallbackApplied = "true";
      image.src = "images/product-placeholder.svg";
    };
    image.addEventListener("error", showPlaceholder);
    if (image.complete && !image.naturalWidth) showPlaceholder();
  });
}

function getProductImage(product) {
  const fallback = "images/product-placeholder.svg";
  const candidate = product && typeof product.image === "string" && product.image
    ? product.image
    : `images/${String((product && product.id) || "product")}.jpg`;
  // Seules des images locales du dossier images/ sont acceptées : si les données venaient
  // un jour d’une API, une source javascript: ou http(s): serait rejetée.
  return /^images\/[a-z0-9-]+\.(?:png|jpe?g|webp|svg)$/i.test(candidate) ? candidate : fallback;
}

function cartEntries() {
  return Object.entries(cart)
    .map(([id, quantity]) => ({ product: products.find((item) => item.id === id), quantity }))
    .filter((entry) => entry.product && entry.product.price !== null);
}

function updateCartView() {
  const entries = cartEntries();
  const count = entries.reduce((sum, entry) => sum + entry.quantity, 0);
  const total = entries.reduce((sum, entry) => sum + entry.product.price * entry.quantity, 0);

  document.querySelector("#cart-count").textContent = String(count);
  document.querySelector("#dialog-cart-count").textContent = `(${count})`;
  document.querySelector("#cart-lines").innerHTML = entries.map(({ product, quantity }) => {
    const name = escapeHtml(product.name);
    const id = escapeHtml(product.id);
    const unitPrice = formatPrice(product.price);
    const linePrice = formatPrice(product.price * quantity);
    return `
    <article class="cart-line">
      <div><h3>${name}</h3><span>${unitPrice} · prix indicatif</span></div>
      <div class="cart-line-right">
        <strong>${linePrice}</strong>
        <div class="quantity-controls" aria-label="Quantité de ${name}">
          <button type="button" data-quantity="${id}" data-change="-1" aria-label="Retirer un ${name}">−</button>
          <span>${quantity}</span>
          <button type="button" data-quantity="${id}" data-change="1" aria-label="Ajouter un ${name}">+</button>
          <button class="remove-item" type="button" data-remove="${id}" aria-label="Supprimer ${name} du panier"><span aria-hidden="true">×</span> Supprimer</button>
        </div>
      </div>
    </article>`;
  }).join("");
  document.querySelector("#cart-total").textContent = formatPrice(total);
  document.querySelector("#cart-empty").hidden = count > 0;
  document.querySelector("#cart-summary").hidden = count === 0;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("visible"), 2600);
}

function addProductToCart(product) {
  if (!product || product.price === null) return;
  const totalItems = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  if (totalItems >= MAX_CART_ITEMS) {
    showToast("Votre panier a atteint sa limite. Contactez la boutique pour une commande importante.");
    return;
  }
  cart[product.id] = Math.min((cart[product.id] || 0) + 1, 99);
  saveCart();
  updateCartView();
  showToast(`${product.name} ajouté au panier.`);
}

function openProductDetails(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  const content = document.querySelector("#product-dialog-content");
  const name = escapeHtml(product.name);
  const badge = escapeHtml(product.badge);
  const image = escapeHtml(getProductImage(product));
  const categoryLabel = escapeHtml(product.categoryLabel);
  const pitch = escapeHtml(product.description);
  const blendedClass = product.blendBackground ? " product-image-blended" : "";
  const dialogAction = product.price === null
    ? '<p class="product-dialog-unavailable">Décrivez votre besoin dans la rubrique maintenance pour préparer une demande de diagnostic.</p><a class="primary-button" href="maintenance.html#diagnostic" data-close-product>Décrire mon problème <span aria-hidden="true">→</span></a>'
    : `<button class="primary-button" type="button" data-dialog-add="${escapeHtml(product.id)}">Ajouter au panier <span aria-hidden="true">+</span></button>`;
  content.innerHTML = `
    <div class="product-dialog-art product-art">
      <span class="product-badge">${badge}</span>
      <img class="product-image${blendedClass}" data-product-image src="${image}" alt="${name}" height="300">
    </div>
    <div class="product-dialog-info">
      <p class="product-category">${categoryLabel}</p>
      <h2 id="product-dialog-title">${name}</h2>
      <p>${pitch}</p>
      <p>Les références exactes et les caractéristiques sont à confirmer auprès de Saïd selon le stock disponible.</p>
      <div class="product-dialog-price">${product.price === null ? "Sur devis" : formatPrice(product.price)}</div>
      <p class="product-dialog-note">${product.price === null ? "Le tarif dépend du diagnostic et de la prestation." : "Prix de démonstration uniquement — à confirmer en boutique."}</p>
      ${dialogAction}
    </div>`;
  setProductImageFallback(content);
  productDialog.showModal();
}

function initializeRevealAnimations() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  document.body.classList.add("js-ready");
  revealObserver = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.12 });
  document.querySelectorAll(".hero-copy, .hero-visual, .section-top, .service-symbol, .promise-section > *")
    .forEach((element) => {
      element.classList.add("reveal");
      revealObserver.observe(element);
    });
}

headerSearchInput.addEventListener("input", () => {
  visibleProductCount = pageSize;
  renderProducts();
});

document.querySelector("#header-search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  renderProducts();
  document.querySelector("#boutique").scrollIntoView({ behavior: "smooth" });
});

document.querySelector(".category-nav").addEventListener("click", (event) => {
  const link = event.target.closest("[data-header-category]");
  if (!link) return;
  event.preventDefault();
  selectedCategory = link.dataset.headerCategory;
  visibleProductCount = pageSize;
  document.querySelectorAll("[data-header-category]").forEach((item) => {
    if (item === link) item.setAttribute("aria-current", "true");
    else item.removeAttribute("aria-current");
  });
  renderProducts();
  document.querySelector("#boutique").scrollIntoView({ behavior: "smooth" });
});

loadMoreButton.addEventListener("click", () => {
  visibleProductCount += pageSize;
  renderProducts();
});

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (button) {
    addProductToCart(products.find((item) => item.id === button.dataset.add));
    return;
  }
  if (event.target.closest("button, a, input, select, textarea")) return;
  const card = event.target.closest("[data-product-card]");
  if (card) openProductDetails(card.dataset.productCard);
});

productGrid.addEventListener("keydown", (event) => {
  const card = event.target.closest("[data-product-card]");
  if (!card || event.target !== card || (event.key !== "Enter" && event.key !== " ")) return;
  event.preventDefault();
  openProductDetails(card.dataset.productCard);
});

document.querySelector("#open-cart").addEventListener("click", () => cartDialog.showModal());
document.querySelector("#close-cart").addEventListener("click", () => cartDialog.close());
document.querySelector("#close-checkout").addEventListener("click", () => checkoutDialog.close());
document.querySelector("#close-product").addEventListener("click", () => productDialog.close());
productDialog.addEventListener("click", (event) => {
  if (event.target === productDialog) productDialog.close();
  const addButton = event.target.closest("[data-dialog-add]");
  if (addButton) addProductToCart(products.find((item) => item.id === addButton.dataset.dialogAdd));
  if (event.target.closest("[data-close-product]")) productDialog.close();
});
document.querySelector("#open-checkout").addEventListener("click", () => {
  cartDialog.close();
  checkoutDialog.showModal();
});

document.querySelector("#continue-shopping").addEventListener("click", () => cartDialog.close());

document.querySelector("#cart-lines").addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");
  if (quantityButton) {
    const { quantity } = quantityButton.dataset;
    const next = (cart[quantity] || 0) + Number(quantityButton.dataset.change);
    if (next <= 0) delete cart[quantity];
    else cart[quantity] = Math.min(next, 99);
    saveCart();
    updateCartView();
  } else if (removeButton) {
    delete cart[removeButton.dataset.remove];
    saveCart();
    updateCartView();
  }
});

for (const dialog of [cartDialog, checkoutDialog, productDialog]) {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}

initializeHeroWaterEffect();
initializeRevealAnimations();
renderProducts();
updateCartView();
