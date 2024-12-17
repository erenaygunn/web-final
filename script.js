function switchTab(tabId) {
	const tabs = document.querySelectorAll(".tab");
	tabs.forEach((tab) => tab.classList.remove("active"));

	document.getElementById(tabId).classList.add("active");

	const links = document.querySelectorAll(".navbar a");
	links.forEach((link) => link.classList.remove("active"));
	document.querySelector(`a[href="#${tabId}"]`).classList.add("active");
}

// Initialize farmers data in localStorage if it doesn't exist
if (!localStorage.getItem("farmers")) {
	localStorage.setItem("farmers", JSON.stringify([])); // Empty farmers array
}

// Load Farmer Data from localStorage
function loadFarmers() {
	const farmers = JSON.parse(localStorage.getItem("farmers"));
	const tableBody = document.querySelector("#farmersTable tbody");
	tableBody.innerHTML = ""; // Clear existing rows

	farmers.forEach((farmer) => {
		const row = document.createElement("tr");
		row.innerHTML = `
        <td>${farmer.id}</td>
        <td><a href="purchase.html?farmerId=${farmer.id}">${farmer.name}</a></td>
        <td>${farmer.contact}</td>
        <td>${farmer.location}</td>
        <td>
          <button onclick="deleteFarmer(${farmer.id})">Delete</button>
        </td>
      `;
		tableBody.appendChild(row);
	});
}

// Add a new farmer
function showAddFarmerModal() {
	document.getElementById("addFarmerModal").style.display = "block";
}

function closeAddFarmerModal() {
	document.getElementById("addFarmerModal").style.display = "none";
}

document
	.getElementById("addFarmerForm")
	.addEventListener("submit", function (e) {
		e.preventDefault();
		const name = document.getElementById("farmerName").value;
		const contact = document.getElementById("farmerContact").value;
		const location = document.getElementById("farmerLocation").value;

		const farmers = JSON.parse(localStorage.getItem("farmers"));
		const newId = farmers.length ? farmers[farmers.length - 1].id + 1 : 1; // Auto-generate Farmer ID
		const newFarmer = { id: newId, name, contact, location };

		farmers.push(newFarmer);
		localStorage.setItem("farmers", JSON.stringify(farmers));

		closeAddFarmerModal();
		loadFarmers();
	});

// Edit an existing farmer
function editFarmer(id) {
	const farmers = JSON.parse(localStorage.getItem("farmers"));
	const farmer = farmers.find((f) => f.id === id);

	const newName = prompt("Enter new name:", farmer.name);
	const newContact = prompt("Enter new contact:", farmer.contact);
	const newLocation = prompt("Enter new location:", farmer.location);

	if (newName && newContact && newLocation) {
		farmer.name = newName;
		farmer.contact = newContact;
		farmer.location = newLocation;

		localStorage.setItem("farmers", JSON.stringify(farmers));
		loadFarmers();
	}
}

// Show Edit Farmer Modal
function showEditFarmerModal() {
	const farmers = JSON.parse(localStorage.getItem("farmers"));
	const selectFarmer = document.getElementById("selectFarmer");
	selectFarmer.innerHTML = ""; // Clear existing options

	farmers.forEach((farmer) => {
		const option = document.createElement("option");
		option.value = farmer.id;
		option.textContent = farmer.name;
		selectFarmer.appendChild(option);
	});

	document.getElementById("editFarmerModal").style.display = "block";
	populateFarmerDetails(); // Populate details for the first farmer in the list
}

// Close Edit Farmer Modal
function closeEditFarmerModal() {
	document.getElementById("editFarmerModal").style.display = "none";
}

// Populate Farmer Details in Edit Modal
function populateFarmerDetails() {
	const farmers = JSON.parse(localStorage.getItem("farmers"));
	const selectedId = parseInt(document.getElementById("selectFarmer").value);
	const farmer = farmers.find((f) => f.id === selectedId);

	document.getElementById("editFarmerName").value = farmer.name;
	document.getElementById("editFarmerContact").value = farmer.contact;
	document.getElementById("editFarmerLocation").value = farmer.location;
}

// Save Edited Farmer Details
document
	.getElementById("editFarmerForm")
	.addEventListener("submit", function (e) {
		e.preventDefault();

		const selectedId = parseInt(document.getElementById("selectFarmer").value);
		const name = document.getElementById("editFarmerName").value;
		const contact = document.getElementById("editFarmerContact").value;
		const location = document.getElementById("editFarmerLocation").value;

		const farmers = JSON.parse(localStorage.getItem("farmers"));
		const farmer = farmers.find((f) => f.id === selectedId);

		farmer.name = name;
		farmer.contact = contact;
		farmer.location = location;

		localStorage.setItem("farmers", JSON.stringify(farmers));

		closeEditFarmerModal();
		loadFarmers();
	});

// Delete a farmer
function deleteFarmer(id) {
	const farmers = JSON.parse(localStorage.getItem("farmers"));
	const updatedFarmers = farmers.filter((f) => f.id !== id);

	localStorage.setItem("farmers", JSON.stringify(updatedFarmers));
	loadFarmers();
}

// Search for farmers by name or location
function searchFarmers() {
	const query = document.getElementById("searchFarmers").value.toLowerCase();
	const farmers = JSON.parse(localStorage.getItem("farmers"));
	const filteredFarmers = farmers.filter(
		(farmer) =>
			farmer.name.toLowerCase().includes(query) ||
			farmer.location.toLowerCase().includes(query)
	);

	const tableBody = document.querySelector("#farmersTable tbody");
	tableBody.innerHTML = ""; // Clear existing rows

	filteredFarmers.forEach((farmer) => {
		const row = document.createElement("tr");
		row.innerHTML = `
        <td>${farmer.id}</td>
        <td>${farmer.name}</td>
        <td>${farmer.contact}</td>
        <td>${farmer.location}</td>
        <td>
          <button onclick="editFarmer(${farmer.id})">Edit</button>
          <button onclick="deleteFarmer(${farmer.id})">Delete</button>
        </td>
      `;
		tableBody.appendChild(row);
	});
}

// Initial Load
document.addEventListener("DOMContentLoaded", () => {
	loadFarmers();
	loadPackagingData();
	loadInventory();
	const selectedFarmerId = localStorage.getItem("selectedFarmerId");
	if (selectedFarmerId) {
		loadSales(selectedFarmerId);
	}
});

// Initial Raw Inventory and Packages Data
if (!localStorage.getItem("rawInventory")) {
	localStorage.setItem(
		"rawInventory",
		JSON.stringify({ id: 1, category: "Raw Blueberries", quantity: 1000 })
	); // Default 1000kg
}

if (!localStorage.getItem("packages")) {
	localStorage.setItem("packages", JSON.stringify([])); // Empty packages
}

// Load Packaging Data
function loadPackagingData() {
	const rawInventory = JSON.parse(localStorage.getItem("rawInventory"));
	document.getElementById(
		"rawInventoryStatus"
	).textContent = `Remaining raw inventory: ${rawInventory.quantity}kg`;

	const packages = JSON.parse(localStorage.getItem("packages"));
	const tableBody = document.querySelector("#packageTable tbody");
	tableBody.innerHTML = "";

	packages.forEach((pkg, index) => {
		const row = document.createElement("tr");
		row.innerHTML = `
        <td>${pkg.type}</td>
        <td>${pkg.quantity}</td>
        <td>${pkg.price}</td>
        <td>
          <button onclick="editPackage(${index})">Edit</button>
          <button onclick="deletePackage(${index})">Delete</button>
        </td>
      `;
		tableBody.appendChild(row);
	});
}

// Load Inventory Data
function loadInventory() {
	const rawInventory = JSON.parse(localStorage.getItem("rawInventory"));
	const packages = JSON.parse(localStorage.getItem("packages"));
	const inventory = [rawInventory, ...packages];

	const tableBody = document.querySelector("#inventoryTable tbody");
	tableBody.innerHTML = ""; // Clear existing rows

	inventory.forEach((item) => {
		const row = document.createElement("tr");
		row.innerHTML = `
			<td>${item.id}</td>
			<td>${item.category || item.type}</td>
			<td>${item.quantity}kg</td>
		`;
		tableBody.appendChild(row);
	});
}

// Add Package to Inventory
function addPackage() {
	const amount = parseFloat(document.getElementById("rawAmount").value);
	const type = document.getElementById("packageType").value;
	const price = parseFloat(document.getElementById("packagePrice").value);

	if (isNaN(amount) || isNaN(price) || amount <= 0 || price <= 0) {
		alert("Please enter valid amount and price.");
		return;
	}

	const rawInventory = JSON.parse(localStorage.getItem("rawInventory"));
	if (amount > rawInventory.quantity) {
		alert("Not enough raw inventory available.");
		return;
	}

	// Update raw inventory
	rawInventory.quantity -= amount;
	localStorage.setItem("rawInventory", JSON.stringify(rawInventory));

	// Update packages
	const packages = JSON.parse(localStorage.getItem("packages"));
	const existingPackageIndex = packages.findIndex(
		(pkg) => pkg.category === type
	);

	if (existingPackageIndex >= 0) {
		// Update existing package
		packages[existingPackageIndex].quantity += amount;
		packages[existingPackageIndex].price = price; // Update price
	} else {
		// Add new package
		packages.push({
			id: packages.length + 2,
			category: type,
			quantity: amount,
			price,
		});
	}

	localStorage.setItem("packages", JSON.stringify(packages));
	loadPackagingData();
	loadInventory();
}

// Edit Package
function editPackage(index) {
	const packages = JSON.parse(localStorage.getItem("packages"));
	const pkg = packages[index];

	const newPrice = parseFloat(prompt("Enter new price:", pkg.price));
	if (isNaN(newPrice) || newPrice <= 0) {
		alert("Invalid price entered.");
		return;
	}

	pkg.price = newPrice;
	localStorage.setItem("packages", JSON.stringify(packages));
	loadPackagingData();
}

// Delete Package
function deletePackage(index) {
	const packages = JSON.parse(localStorage.getItem("packages"));
	const rawInventory = JSON.parse(localStorage.getItem("rawInventory"));

	// Add the deleted package quantity back to raw inventory
	const updatedRawInventory = rawInventory.quantity + packages[index].quantity;
	rawInventory.quantity = updatedRawInventory;
	localStorage.setItem("rawInventory", JSON.stringify(rawInventory));

	packages.splice(index, 1);
	localStorage.setItem("packages", JSON.stringify(packages));
	loadPackagingData();
}

// Initial Load
document.addEventListener("DOMContentLoaded", () => {
	loadPackagingData();
	loadInventory();
});

// Initialize sales data in localStorage if it doesn't exist
if (!localStorage.getItem("sales")) {
	localStorage.setItem("sales", JSON.stringify([])); // Empty sales array
}

// Load Sales Data from localStorage
function loadSales(farmerId) {
	const sales = JSON.parse(localStorage.getItem("sales"));
	const farmerSales = sales.filter((sale) => sale.farmerId === farmerId);
	const tableBody = document.querySelector("#salesTable tbody");
	tableBody.innerHTML = ""; // Clear existing rows

	farmerSales.forEach((sale) => {
		const row = document.createElement("tr");
		row.innerHTML = `
        <td>${sale.id}</td>
        <td>${sale.date}</td>
        <td>${sale.quantity}</td>
        <td>${sale.pricePerKg}</td>
        <td>${sale.totalCost}</td>
        <td>
          <button onclick="editSale(${sale.id})">Edit</button>
          <button onclick="deleteSale(${sale.id})">Delete</button>
        </td>
      `;
		tableBody.appendChild(row);
	});
}

// Add a new sale
function showAddSaleModal() {
	document.getElementById("addSaleModal").style.display = "block";
}

function closeAddSaleModal() {
	document.getElementById("addSaleModal").style.display = "none";
}

document.getElementById("addSaleForm").addEventListener("submit", function (e) {
	e.preventDefault();

	const farmerId = parseInt(localStorage.getItem("selectedFarmerId"));
	const quantity = parseFloat(document.getElementById("saleQuantity").value);
	const pricePerKg = parseFloat(document.getElementById("salePrice").value);
	const totalCost = quantity * pricePerKg;
	const date = new Date().toLocaleString();

	const sales = JSON.parse(localStorage.getItem("sales"));
	const newId = sales.length ? sales[sales.length - 1].id + 1 : 1; // Auto-generate Sale ID
	const newSale = {
		id: newId,
		farmerId: farmerId,
		date: date,
		quantity: quantity,
		pricePerKg: pricePerKg,
		totalCost: totalCost,
	};

	sales.push(newSale);
	localStorage.setItem("sales", JSON.stringify(sales));

	updateInventory(quantity); // Update inventory based on sale quantity
	closeAddSaleModal();
	loadSales(farmerId);
});

// Edit an existing sale
function editSale(id) {
	const sales = JSON.parse(localStorage.getItem("sales"));
	const sale = sales.find((s) => s.id === id);

	const newQuantity = prompt("Enter new quantity (kg):", sale.quantity);
	const newPricePerKg = prompt("Enter new price per kg:", sale.pricePerKg);

	if (newQuantity && newPricePerKg) {
		sale.quantity = parseFloat(newQuantity);
		sale.pricePerKg = parseFloat(newPricePerKg);
		sale.totalCost = sale.quantity * sale.pricePerKg;

		localStorage.setItem("sales", JSON.stringify(sales));
		loadSales(sale.farmerId);
	}
}

// Delete a sale
function deleteSale(id) {
	const sales = JSON.parse(localStorage.getItem("sales"));
	const updatedSales = sales.filter((s) => s.id !== id);

	localStorage.setItem("sales", JSON.stringify(updatedSales));
	loadSales(getCurrentFarmerId());
}

// Update inventory after sale
function updateInventory(quantity) {
	let inventory = JSON.parse(localStorage.getItem("inventory"));
	inventory.totalBlueberries -= quantity;
	localStorage.setItem("inventory", JSON.stringify(inventory));
}

// Get current farmer ID (this should be set when a farmer is clicked in the Farmers module)
function getCurrentFarmerId() {
	return parseInt(localStorage.getItem("selectedFarmerId"));
}

// Set the selected farmer ID when a farmer is clicked in the Farmers module
function selectFarmer(farmerId) {
	localStorage.setItem("selectedFarmerId", farmerId);
	loadSales(farmerId);
}

// Initial Load
document.addEventListener("DOMContentLoaded", () => {
	const selectedFarmerId = localStorage.getItem("selectedFarmerId");
	if (selectedFarmerId) {
		loadSales(selectedFarmerId);
	}
});
