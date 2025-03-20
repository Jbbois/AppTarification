let produitsData = [];
let livraisonData = [];

// Fonction pour charger le fichier Excel
document.getElementById('loadExcel').addEventListener('click', function() {
  const fileInput = document.getElementById('fileInput');
  if (!fileInput.files.length) {
    alert("Veuillez sélectionner un fichier Excel.");
    return;
  }
  
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, {type: 'array'});
    
    // Lecture de la feuille 'Produits'
    const produitsSheet = workbook.Sheets['Produits'];
    if(produitsSheet) {
      produitsData = XLSX.utils.sheet_to_json(produitsSheet);
      populateProduits();
    } else {
      alert("La feuille 'Produits' est introuvable dans le fichier Excel.");
    }
    
    // Lecture de la feuille 'Livraison'
    const livraisonSheet = workbook.Sheets['Livraison'];
    if(livraisonSheet) {
      livraisonData = XLSX.utils.sheet_to_json(livraisonSheet);
      populateVilles();
    } else {
      alert("La feuille 'Livraison' est introuvable dans le fichier Excel.");
    }
  };
  reader.readAsArrayBuffer(file);
});

function populateProduits() {
  const categorieSelect = document.getElementById('categorie');
  const produitSelect = document.getElementById('produit');
  
  // Lorsqu'une catégorie est sélectionnée, on met à jour la liste des produits
  categorieSelect.addEventListener('change', function() {
    produitSelect.innerHTML = '<option value="">Sélectionnez un produit</option>';
    const selectedCat = this.value;
    const filtered = produitsData.filter(p => p.Catégorie === selectedCat);
    filtered.forEach(p => {
      const option = document.createElement('option');
      option.value = p.Produit;
      option.textContent = `${p.Produit} (${p.Caractéristiques})`;
      option.dataset.prix = p["Prix Unitaire (€)"];
      produitSelect.appendChild(option);
    });
  });
}

function populateVilles() {
  const villeSelect = document.getElementById('ville');
  villeSelect.innerHTML = '<option value="">Sélectionnez une ville</option>';
  livraisonData.forEach(v => {
    const option = document.createElement('option');
    option.value = v.Ville;
    option.textContent = `${v.Ville} - ${v["Distance (km)"]} km`;
    option.dataset.frais = v["Prix de la livraison (€)"];
    villeSelect.appendChild(option);
  });
}

document.getElementById('calcForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const produitOption = document.getElementById('produit').selectedOptions[0];
  const prixUnitaire = parseFloat(produitOption.dataset.prix);
  const quantite = parseFloat(document.getElementById('quantite').value);
  
  const villeOption = document.getElementById('ville').selectedOptions[0];
  const fraisLivraison = parseFloat(villeOption.dataset.frais);
  
  // Calcul des tarifs
  const montantTotal = (prixUnitaire * quantite) + fraisLivraison;
  const coutUnitaire = montantTotal / quantite;
  
  // Affichage des résultats
  document.getElementById('prixUnitaire').textContent = prixUnitaire.toFixed(2);
  document.getElementById('fraisLivraison').textContent = fraisLivraison.toFixed(2);
  document.getElementById('montantTotal').textContent = montantTotal.toFixed(2);
  document.getElementById('coutUnitaire').textContent = coutUnitaire.toFixed(2);
});
