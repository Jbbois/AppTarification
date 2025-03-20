document.addEventListener('DOMContentLoaded', function() {
  const categorieSelect = document.getElementById('categorie');
  const sectionBois = document.getElementById('section-bois');
  const sectionGranules = document.getElementById('section-granules');
  const sectionPiquets = document.getElementById('section-piquets');
  
  // Afficher la section correspondant à la catégorie sélectionnée
  categorieSelect.addEventListener('change', function() {
    sectionBois.style.display = 'none';
    sectionGranules.style.display = 'none';
    sectionPiquets.style.display = 'none';
    
    if (this.value === 'bois') {
      sectionBois.style.display = 'block';
    } else if (this.value === 'granules') {
      sectionGranules.style.display = 'block';
    } else if (this.value === 'piquets') {
      sectionPiquets.style.display = 'block';
    }
  });
  
  /* ----- Partie Bois de chauffage ----- */
  // Données simulées pour la partie bois (à remplacer par une source réelle par la suite)
  const boisData = [
    { postal: "40800", "25": 90, "30": 87, "40": 86, "50": 84 },
    { postal: "40320", "25": 92, "30": 88, "40": 85, "50": 79 },
  ];
  
  document.getElementById('calculer-bois').addEventListener('click', function() {
    const longueur = document.getElementById('bois-longueur').value;
    const postal = document.getElementById('bois-ville').value;
    const quantite = parseFloat(document.getElementById('bois-quantite').value);
    
    if (!longueur || !postal || !quantite) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    
    const data = boisData.find(item => item.postal === postal);
    if (!data) {
      alert("Aucune donnée trouvée pour ce code postal.");
      return;
    }
    const prixUnitaire = data[longueur];
    if (!prixUnitaire) {
      alert("Aucune donnée pour cette longueur.");
      return;
    }
    const sommeTotale = prixUnitaire * quantite;
    
    document.getElementById('bois-prix-unitaire').textContent = prixUnitaire.toFixed(2);
    document.getElementById('bois-somme-totale').textContent = sommeTotale.toFixed(2);
  });
  
  /* ----- Partie Granulés ----- */
  // Données simulées pour la partie granulés
// Supposons que tes données sont déjà récupérées depuis Google Sheets et stockées dans des variables
// Par exemple, granulesData est un tableau d'objets pour l'onglet "Granulés" et
// livraisonGranulesData est un tableau d'objets pour l'onglet "LivraisonGranules".

// Exemple de données simulées :
const granulesData = [
  { marque: "Marque A", prixSac: 10, prixPalette: 190, sacsParPalette: 20 },
  { marque: "Marque B", prixSac: 11, prixPalette: 200, sacsParPalette: 18 },
  { marque: "Marque C", prixSac: 9,  prixPalette: 180, sacsParPalette: 22 },
];

const livraisonGranulesData = [
  { postal: "40800", ville: "Aire-sur-l’Adour", frais: 50 },
  { postal: "40320", ville: "Arboucave", frais: 55 },
  // ... autres entrées
];

document.getElementById('calculer-granules').addEventListener('click', function() {
  const type = document.getElementById('granules-type').value;
  const quantite = parseFloat(document.getElementById('granules-quantite').value);
  const marqueChoisie = document.getElementById('granules-marque').value;
  
  if (!type || !quantite || !marqueChoisie) {
    alert("Veuillez remplir tous les champs.");
    return;
  }
  
  // Récupérer les données de la marque sélectionnée
  const dataMarque = granulesData.find(item => item.marque === marqueChoisie);
  if (!dataMarque) {
    alert("Données de la marque non trouvées.");
    return;
  }
  
  let total = 0, moyen = 0;
  
  if (type === 'sacs') {
    // Vente au sac sans livraison
    total = quantite * dataMarque.prixSac;
    document.getElementById('granules-total').textContent = total.toFixed(2);
  } else if (type === 'palette-sans') {
    // Vente à la palette en retrait
    total = quantite * dataMarque.prixPalette;
    document.getElementById('granules-total').textContent = total.toFixed(2);
  } else if (type === 'palette-avec') {
    // Vente à la palette avec livraison
    // Ici, la livraison est forfaitaire et dépend de la ville (ou code postal)
    const postal = document.getElementById('granules-ville').value;
    if (!postal) {
      alert("Veuillez saisir le code postal ou la ville pour la livraison.");
      return;
    }
    // Récupérer les frais de livraison pour le code postal saisi
    const livraisonInfo = livraisonGranulesData.find(item => item.postal === postal);
    if (!livraisonInfo) {
      alert("Aucune donnée de livraison trouvée pour ce code postal.");
      return;
    }
    total = (quantite * dataMarque.prixPalette) + livraisonInfo.frais;
    moyen = total / quantite;
    document.getElementById('granules-total').textContent = total.toFixed(2);
    document.getElementById('granules-moyen').textContent = moyen.toFixed(2);
  } else {
    alert("Veuillez choisir une option de commande.");
  }
});

  
  // Affichage conditionnel de l'input pour la ville si l'option "palette-avec" est choisie
  const granulesType = document.getElementById('granules-type');
  granulesType.addEventListener('change', function() {
    if (this.value === 'palette-avec') {
      document.getElementById('granules-ville-section').style.display = 'block';
      document.getElementById('granules-moyen-section').style.display = 'block';
    } else {
      document.getElementById('granules-ville-section').style.display = 'none';
      document.getElementById('granules-moyen-section').style.display = 'none';
    }
  });
  
  document.getElementById('calculer-granules').addEventListener('click', function() {
    const type = document.getElementById('granules-type').value;
    const quantite = parseFloat(document.getElementById('granules-quantite').value);
    
    if (!type || !quantite) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    
    let total = 0, moyen = 0;
    if (type === 'sacs') {
      total = quantite * granulesData.sacs.price;
      document.getElementById('granules-total').textContent = total.toFixed(2);
    } else if (type === 'palette-sans') {
      total = quantite * granulesData.palette.sans;
      document.getElementById('granules-total').textContent = total.toFixed(2);
    } else if (type === 'palette-avec') {
      // Pour les palettes avec livraison, le frais de livraison est ajouté une seule fois
      total = (quantite * granulesData.palette.avec.price) + granulesData.palette.avec.livraison;
      moyen = total / quantite;
      document.getElementById('granules-total').textContent = total.toFixed(2);
      document.getElementById('granules-moyen').textContent = moyen.toFixed(2);
    } else {
      alert("Veuillez choisir une option de commande.");
    }
  });
  
  /* ----- Partie Piquets ----- */
  // Données simulées pour la partie piquets
  const piquetsData = [
    { longueur: "1.5", min: 1, max: 49, ht: 3.5, tva: 20, ttc: 4.2 },
    { longueur: "1.5", min: 50, max: 99, ht: 3.2, tva: 20, ttc: 3.84 },
    { longueur: "1.5", min: 100, max: Infinity, ht: 3.0, tva: 20, ttc: 3.6 },
    { longueur: "2", min: 1, max: 49, ht: 4.0, tva: 20, ttc: 4.8 },
    { longueur: "2", min: 50, max: 99, ht: 3.7, tva: 20, ttc: 4.44 },
    { longueur: "2", min: 100, max: Infinity, ht: 3.5, tva: 20, ttc: 4.2 },
  ];
  
  document.getElementById('calculer-piquets').addEventListener('click', function() {
    const longueur = document.getElementById('piquets-longueur').value;
    const quantite = parseFloat(document.getElementById('piquets-quantite').value);
    
    if (!longueur || !quantite) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    
    const tier = piquetsData.find(item => item.longueur === longueur && quantite >= item.min && quantite <= item.max);
    if (!tier) {
      alert("Aucun tarif trouvé pour cette combinaison.");
      return;
    }
    const totalHT = tier.ht * quantite;
    const totalTTC = tier.ttc * quantite;
    
    document.getElementById('piquets-total-ht').textContent = totalHT.toFixed(2);
    document.getElementById('piquets-total-ttc').textContent = totalTTC.toFixed(2);
  });
});
