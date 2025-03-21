document.addEventListener('DOMContentLoaded', function() {
  // Variables globales pour stocker la liste des villes
  let citiesList = [];

  // Remplacez cette URL par l'URL de publication CSV de votre Google Sheet (contenant les villes)
  const citiesCSVUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT1J8m0EAC4kU8eckohcwXyO_NvYOa28ZQ1ORKAHTkr9ajBaPbAH8QombALoYdDJ9NOJAhV0b1X2Ywe/pub?gid=2042850115&single=true&output=csv";

  // Fonction pour charger et parser le CSV depuis Google Sheets
  async function loadCities() {
    try {
      const response = await fetch(citiesCSVUrl);
      const csvText = await response.text();
      const lines = csvText.split("\n");
      citiesList = [];
      // Supposons que la première ligne est l'en-tête, et que le CSV a au moins 2 colonnes : Code postal et Ville
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = line.split(",");
        if (parts.length >= 2) {
          const code = parts[0].trim();
          const ville = parts[1].trim();
          citiesList.push(`${code} - ${ville}`);
        }
      }
      console.log("Liste des villes chargée :", citiesList);
    } catch (error) {
      console.error("Erreur lors du chargement des villes :", error);
    }
  }

  // Charger la liste des villes dès le chargement de la page
  loadCities();

  // Fonction générique pour configurer l'autocomplétion sur un champ d'entrée
  function setupAutocomplete(inputElement, suggestionsContainer) {
    inputElement.addEventListener('input', function() {
      const query = this.value.toLowerCase();
      suggestionsContainer.innerHTML = ""; // Efface les suggestions précédentes

      if (query.length === 0) return;

      // Filtrer la liste des villes par rapport à la saisie
      const filteredCities = citiesList.filter(city => city.toLowerCase().includes(query));
      filteredCities.forEach(city => {
        const suggestionItem = document.createElement('div');
        suggestionItem.textContent = city;
        suggestionItem.className = "suggestion-item";
        suggestionItem.addEventListener('click', function() {
          inputElement.value = city;  // Remplit le champ avec la suggestion
          suggestionsContainer.innerHTML = ""; // Efface les suggestions
        });
        suggestionsContainer.appendChild(suggestionItem);
      });
    });
  }

  // Configurer l'autocomplétion pour les champs de ville
  const boisVilleInput = document.getElementById('bois-ville');
  const boisSuggestions = document.getElementById('bois-suggestions');
  setupAutocomplete(boisVilleInput, boisSuggestions);

  const granulesVilleInput = document.getElementById('granules-ville');
  const granulesSuggestions = document.getElementById('granules-suggestions');
  setupAutocomplete(granulesVilleInput, granulesSuggestions);

  /* ----- Gestion des sections de l'application ----- */
  const categorieSelect = document.getElementById('categorie');
  const sectionBois = document.getElementById('section-bois');
  const sectionGranules = document.getElementById('section-granules');
  const sectionPiquets = document.getElementById('section-piquets');
  const sectionAutres = document.getElementById('section-autres');
  
  categorieSelect.addEventListener('change', function() {
    sectionBois.style.display = 'none';
    sectionGranules.style.display = 'none';
    sectionPiquets.style.display = 'none';
    sectionAutres.style.display = 'none';
    
    if (this.value === 'bois') {
      sectionBois.style.display = 'block';
    } else if (this.value === 'granules') {
      sectionGranules.style.display = 'block';
    } else if (this.value === 'piquets') {
      sectionPiquets.style.display = 'block';
    } else if (this.value === 'autres') {
      sectionAutres.style.display = 'block';
      displayAutres();
    }
  });
  
  /* ----- Section Bois de chauffage ----- */
  const boisData = [
    { postal: "40800", "25": 90, "30": 87, "40": 86, "50": 84 },
    { postal: "40320", "25": 92, "30": 88, "40": 85, "50": 79 }
  ];
  
  document.getElementById('calculer-bois').addEventListener('click', function() {
    const longueur = document.getElementById('bois-longueur').value;
    const postal = document.getElementById('bois-ville').value;
    const quantite = parseFloat(document.getElementById('bois-quantite').value);
    
    if (!longueur || !postal || !quantite) {
      alert("Veuillez remplir tous les champs pour le bois.");
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
  
  /* ----- Section Granulés ----- */
  const granulesData = [
    { marque: "Marque A", prixSac: 10, prixPalette: 190, sacsParPalette: 20 },
    { marque: "Marque B", prixSac: 11, prixPalette: 200, sacsParPalette: 18 },
    { marque: "Marque C", prixSac: 9,  prixPalette: 180, sacsParPalette: 22 }
  ];
  
  const livraisonGranulesData = [
    { postal: "40800", ville: "Aire-sur-l’Adour", frais: 50 },
    { postal: "40320", ville: "Arboucave", frais: 55 }
  ];
  
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
    const marqueChoisie = document.getElementById('granules-marque').value;
    
    if (!type || !quantite || !marqueChoisie) {
      alert("Veuillez remplir tous les champs pour les granulés.");
      return;
    }
    
    const dataMarque = granulesData.find(item => item.marque === marqueChoisie);
    if (!dataMarque) {
      alert("Données de la marque non trouvées.");
      return;
    }
    
    let total = 0, moyen = 0;
    if (type === 'sacs') {
      total = quantite * dataMarque.prixSac;
      document.getElementById('granules-total').textContent = total.toFixed(2);
    } else if (type === 'palette-sans') {
      total = quantite * dataMarque.prixPalette;
      document.getElementById('granules-total').textContent = total.toFixed(2);
    } else if (type === 'palette-avec') {
      const postal = document.getElementById('granules-ville').value;
      if (!postal) {
        alert("Veuillez saisir le code postal pour la livraison.");
        return;
      }
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
      alert("Veuillez choisir une option de commande pour les granulés.");
    }
  });
  
  /* ----- Section Piquets ----- */
  const piquetsData = [
    { longueur: "1.5", min: 1, max: 49, ht: 3.5, tva: 20, ttc: 4.2 },
    { longueur: "1.5", min: 50, max: 99, ht: 3.2, tva: 20, ttc: 3.84 },
    { longueur: "1.5", min: 100, max: Infinity, ht: 3.0, tva: 20, ttc: 3.6 },
    { longueur: "2", min: 1, max: 49, ht: 4.0, tva: 20, ttc: 4.8 },
    { longueur: "2", min: 50, max: 99, ht: 3.7, tva: 20, ttc: 4.44 },
    { longueur: "2", min: 100, max: Infinity, ht: 3.5, tva: 20, ttc: 4.2 }
  ];
  
  document.getElementById('calculer-piquets').addEventListener('click', function() {
    const longueur = document.getElementById('piquets-longueur').value;
    const quantite = parseFloat(document.getElementById('piquets-quantite').value);
    
    if (!longueur || !quantite) {
      alert("Veuillez remplir tous les champs pour les piquets.");
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
  
  /* ----- Section Autres ----- */
  const autresData = [
    { produit: "Produit X", prix: 25 },
    { produit: "Produit Y", prix: 30 },
    { produit: "Produit Z", prix: 15 }
  ];
  
  function displayAutres() {
    const tableBody = document.getElementById('autres-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = "";
    autresData.forEach(item => {
      const row = document.createElement('tr');
      const cellProduit = document.createElement('td');
      cellProduit.textContent = item.produit;
      const cellPrix = document.createElement('td');
      cellPrix.textContent = item.prix.toFixed(2);
      row.appendChild(cellProduit);
      row.appendChild(cellPrix);
      tableBody.appendChild(row);
    });
  }
});
