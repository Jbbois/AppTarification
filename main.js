document.addEventListener('DOMContentLoaded', async function() {
  // Variables globales pour stocker les données
  let citiesData = [];
  let boisData = [];
  let granulesData = [];
  let livraisonGranulesData = [];
  let piquetsData = [];
  let autresData = [];

  // Remplacez les URLs ci-dessous par celles obtenues après publication de chaque onglet en CSV
  const citiesCSVUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT1J8m0EAC4kU8eckohcwXyO_NvYOa28ZQ1ORKAHTkr9ajBaPbAH8QombALoYdDJ9NOJAhV0b1X2Ywe/pub?gid=2042850115&single=true&output=csv";
  const boisCSVUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT1J8m0EAC4kU8eckohcwXyO_NvYOa28ZQ1ORKAHTkr9ajBaPbAH8QombALoYdDJ9NOJAhV0b1X2Ywe/pub?gid=0&single=true&output=csv";
  const granulesCSVUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT1J8m0EAC4kU8eckohcwXyO_NvYOa28ZQ1ORKAHTkr9ajBaPbAH8QombALoYdDJ9NOJAhV0b1X2Ywe/pub?gid=1472631647&single=true&output=csv";
  const livraisonGranulesCSVUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT1J8m0EAC4kU8eckohcwXyO_NvYOa28ZQ1ORKAHTkr9ajBaPbAH8QombALoYdDJ9NOJAhV0b1X2Ywe/pub?gid=1356481895&single=true&output=csv";
  const piquetsCSVUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT1J8m0EAC4kU8eckohcwXyO_NvYOa28ZQ1ORKAHTkr9ajBaPbAH8QombALoYdDJ9NOJAhV0b1X2Ywe/pub?gid=437218056&single=true&output=csv";
  const autresCSVUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT1J8m0EAC4kU8eckohcwXyO_NvYOa28ZQ1ORKAHTkr9ajBaPbAH8QombALoYdDJ9NOJAhV0b1X2Ywe/pub?gid=1506881123&single=true&output=csv";

  // Fonction pour récupérer et parser un CSV
  async function fetchCSV(url) {
    const response = await fetch(url);
    const csvText = await response.text();
    return parseCSV(csvText);
  }

  // Fonction simple de parsing CSV (suppose que les données ne contiennent pas de virgules internes)
  function parseCSV(csvText) {
    const lines = csvText.trim().split("\n");
    const result = [];
    const headers = lines[0].split(",").map(h => h.trim());
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",");
      let obj = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] ? values[index].trim() : "";
      });
      result.push(obj);
    }
    return result;
  }

  // Charger toutes les données
  async function loadAllData() {
    try {
      citiesData = await fetchCSV(citiesCSVUrl);
      boisData = await fetchCSV(boisCSVUrl);
      granulesData = await fetchCSV(granulesCSVUrl);
      livraisonGranulesData = await fetchCSV(livraisonGranulesCSVUrl);
      piquetsData = await fetchCSV(piquetsCSVUrl);
      autresData = await fetchCSV(autresCSVUrl);
      console.log("Toutes les données sont chargées");
    } catch (error) {
      console.error("Erreur lors du chargement des données :", error);
    }
  }
  await loadAllData();

  // Autocomplétion dynamique basée sur citiesData
  function setupAutocomplete(inputElement, suggestionsContainer) {
    inputElement.addEventListener('input', function() {
      const query = this.value.toLowerCase();
      suggestionsContainer.innerHTML = "";
      if (query.length === 0) return;
      const filtered = citiesData.filter(cityObj =>
        cityObj["Ville"].toLowerCase().includes(query)
      );
      filtered.forEach(cityObj => {
        const suggestionItem = document.createElement('div');
        suggestionItem.textContent = cityObj["Ville"];
        suggestionItem.className = "suggestion-item";
        suggestionItem.addEventListener('click', function() {
          inputElement.value = cityObj["Ville"];
          suggestionsContainer.innerHTML = "";
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

  /* Gestion des sections */
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

  /* ----- Section Bois ----- */
  document.getElementById('calculer-bois').addEventListener('click', function() {
    const longueur = document.getElementById('bois-longueur').value;
    const postal = document.getElementById('bois-ville').value;
    const quantite = parseFloat(document.getElementById('bois-quantite').value);
    if (!longueur || !postal || !quantite) {
      alert("Veuillez remplir tous les champs pour le bois.");
      return;
    }
    const data = boisData.find(item => 
      item["Code postal"] === postal || item["Ville"].toLowerCase() === postal.toLowerCase()
    );
    if (!data) {
      alert("Aucune donnée trouvée pour ce code postal ou cette ville.");
      return;
    }
    const prixUnitaire = data[longueur];
    if (!prixUnitaire) {
      alert("Aucune donnée pour cette longueur.");
      return;
    }
    const sommeTotale = parseFloat(prixUnitaire) * quantite;
    document.getElementById('bois-prix-unitaire').textContent = parseFloat(prixUnitaire).toFixed(2);
    document.getElementById('bois-somme-totale').textContent = sommeTotale.toFixed(2);
  });

  /* ----- Section Granulés ----- */
  // Remplir le menu déroulant des marques à partir des données granulesData (supposant que la colonne "Marque" existe)
  const granulesMarqueSelect = document.getElementById('granules-marque');
  granulesMarqueSelect.innerHTML = `<option value="">Choisir une marque</option>`;
  granulesData.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item["Marque"];
    opt.textContent = item["Marque"];
    granulesMarqueSelect.appendChild(opt);
  });

  // Affichage conditionnel de la section ville pour livraison
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
    const dataMarque = granulesData.find(item => item["Marque"] === marqueChoisie);
    if (!dataMarque) {
      alert("Données de la marque non trouvées.");
      return;
    }
    let total = 0, moyen = 0;
    if (type === 'sacs') {
      total = quantite * parseFloat(dataMarque["Prix Sac"]);
      document.getElementById('granules-total').textContent = total.toFixed(2);
    } else if (type === 'palette-sans') {
      total = quantite * parseFloat(dataMarque["Prix Palette"]);
      document.getElementById('granules-total').textContent = total.toFixed(2);
    } else if (type === 'palette-avec') {
      const postal = document.getElementById('granules-ville').value;
      if (!postal) {
        alert("Veuillez saisir le code postal pour la livraison.");
        return;
      }
      const livraisonInfo = livraisonGranulesData.find(item => 
        item["Code postal"] === postal || item["Ville"].toLowerCase() === postal.toLowerCase()
      );
      if (!livraisonInfo) {
        alert("Aucune donnée de livraison trouvée pour ce code postal ou cette ville.");
        return;
      }
      total = (quantite * parseFloat(dataMarque["Prix Palette"])) + parseFloat(livraisonInfo["Frais"]);
      moyen = total / quantite;
      document.getElementById('granules-total').textContent = total.toFixed(2);
      document.getElementById('granules-moyen').textContent = moyen.toFixed(2);
    } else {
      alert("Veuillez choisir une option de commande pour les granulés.");
    }
  });

  /* ----- Section Piquets ----- */
  document.getElementById('calculer-piquets').addEventListener('click', function() {
    const longueur = document.getElementById('piquets-longueur').value;
    const quantite = parseFloat(document.getElementById('piquets-quantite').value);
    if (!longueur || !quantite) {
      alert("Veuillez remplir tous les champs pour les piquets.");
      return;
    }
    const tier = piquetsData.find(item => 
      item["Longueur"] === longueur && 
      quantite >= parseFloat(item["Quantité Min"]) && 
      quantite <= parseFloat(item["Quantité Max"])
    );
    if (!tier) {
      alert("Aucun tarif trouvé pour cette combinaison.");
      return;
    }
    const totalHT = parseFloat(tier["Prix HT"]) * quantite;
    const totalTTC = parseFloat(tier["Prix TTC"]) * quantite;
    document.getElementById('piquets-total-ht').textContent = totalHT.toFixed(2);
    document.getElementById('piquets-total-ttc').textContent = totalTTC.toFixed(2);
  });
  
  /* ----- Section Autres ----- */
  function displayAutres() {
    const tableBody = document.getElementById('autres-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = "";
    autresData.forEach(item => {
      const row = document.createElement('tr');
      const cellProduit = document.createElement('td');
      cellProduit.textContent = item["Produit"];
      const cellPrix = document.createElement('td');
      cellPrix.textContent = parseFloat(item["Prix"]).toFixed(2);
      row.appendChild(cellProduit);
      row.appendChild(cellPrix);
      tableBody.appendChild(row);
    });
  }
});
