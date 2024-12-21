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

// Initial Load
document.addEventListener("DOMContentLoaded", () => {
	loadFarmers();
	loadPackagingData();
	loadInventory();
	loadAllPurchases(); // Load all sales records on page load
	const selectedFarmerId = localStorage.getItem("selectedFarmerId");
	if (selectedFarmerId) {
		loadSales(selectedFarmerId);
	}
});

// Initial Raw Inventory and Packages Data
if (!localStorage.getItem("rawInventory")) {
	localStorage.setItem(
		"rawInventory",
		JSON.stringify({ id: 1, category: "Raw Blueberries", quantity: 0 })
	);
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
        <td>${pkg.threshold}</td>
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
			<td>${item.category ? item.quantity + "kg" : item.quantity + "pcs"}</td>
			<td>${item.threshold || " "}</td>
			<td>${item.lastUpdate || "N/A"}</td>
		`;
		tableBody.appendChild(row);
	});
}

// Toggle custom weight input field
function toggleCustomWeightInput() {
	const packageType = document.getElementById("packageType").value;
	const customWeightContainer = document.getElementById(
		"customWeightContainer"
	);
	if (packageType === "custom") {
		customWeightContainer.style.display = "block";
	} else {
		customWeightContainer.style.display = "none";
	}
}

// Add Package to Inventory
function addPackage() {
	const numPackages = parseFloat(document.getElementById("rawAmount").value);
	const type = document.getElementById("packageType").value;
	const price = parseFloat(document.getElementById("packagePrice").value);
	const threshold = parseFloat(document.getElementById("stockThreshold").value);

	if (
		isNaN(numPackages) ||
		isNaN(price) ||
		isNaN(threshold) ||
		numPackages <= 0 ||
		price <= 0 ||
		threshold < 0
	) {
		alert("Please enter valid number of packages, price, and threshold.");
		return;
	}

	const packageWeights = {
		"Small (100g)": 0.1,
		"Medium (200g)": 0.2,
		"Large (500g)": 0.5,
		"Extra Large (1kg)": 1,
		"Family pack (2kg)": 2,
		"Bulk pack (5kg)": 5,
		custom: 0, // Custom weight will be handled separately
	};

	let weightPerPackage = packageWeights[type];
	let displayType = type;
	if (type === "custom") {
		const customWeight = parseFloat(
			document.getElementById("customWeight").value
		);
		weightPerPackage = customWeight / 1000;
		displayType = `${customWeight}g`;
		if (isNaN(weightPerPackage) || weightPerPackage <= 0) {
			alert("Please enter a valid custom package weight.");
			return;
		}
	}

	const totalWeight = numPackages * weightPerPackage;

	const rawInventory = JSON.parse(localStorage.getItem("rawInventory"));
	if (totalWeight > rawInventory.quantity) {
		alert("Not enough raw inventory available.");
		return;
	}

	// Update raw inventory
	rawInventory.quantity -= totalWeight;
	rawInventory.lastUpdate = new Date().toLocaleString();
	localStorage.setItem("rawInventory", JSON.stringify(rawInventory));

	// Update packages
	const packages = JSON.parse(localStorage.getItem("packages"));
	const existingPackageIndex = packages.findIndex(
		(pkg) => pkg.type === displayType
	);

	if (existingPackageIndex >= 0) {
		// Update existing package
		packages[existingPackageIndex].quantity += numPackages;
		packages[existingPackageIndex].price = price; // Update price
		packages[existingPackageIndex].threshold = threshold; // Update threshold
		packages[existingPackageIndex].lastUpdate = new Date().toLocaleString();
	} else {
		// Add new package
		packages.push({
			id: packages.length + 2,
			type: displayType,
			quantity: numPackages,
			price,
			threshold,
			lastUpdate: new Date().toLocaleString(),
		});
	}

	localStorage.setItem("packages", JSON.stringify(packages));
	loadPackagingData();
	loadInventory();
	checkStockAlerts();
}

// Edit Package
function editPackage(index) {
	const packages = JSON.parse(localStorage.getItem("packages"));
	const pkg = packages[index];

	const newPrice = parseFloat(prompt("Enter new price:", pkg.price));
	const newThreshold = parseFloat(
		prompt("Enter new stock alert threshold:", pkg.threshold)
	);
	if (
		isNaN(newPrice) ||
		newPrice <= 0 ||
		isNaN(newThreshold) ||
		newThreshold < 0
	) {
		alert("Invalid price or threshold entered.");
		return;
	}

	pkg.price = newPrice;
	pkg.threshold = newThreshold;
	pkg.lastUpdate = new Date().toLocaleString();
	localStorage.setItem("packages", JSON.stringify(packages));
	loadPackagingData();
	loadInventory();
	checkStockAlerts();
}

// Check stock alerts
function checkStockAlerts() {
	const packages = JSON.parse(localStorage.getItem("packages"));
	packages.forEach((pkg) => {
		if (pkg.quantity < pkg.threshold) {
			alert(
				`Stock alert: ${pkg.type} is below the threshold of ${pkg.threshold}`
			);
		}
	});
}

// Delete Package
function deletePackage(index) {
	const packages = JSON.parse(localStorage.getItem("packages"));
	const rawInventory = JSON.parse(localStorage.getItem("rawInventory"));

	// Add the deleted package quantity back to raw inventory
	const updatedRawInventory = rawInventory.quantity + packages[index].quantity;
	rawInventory.quantity = updatedRawInventory;
	rawInventory.lastUpdate = new Date().toLocaleString();
	localStorage.setItem("rawInventory", JSON.stringify(rawInventory));

	packages.splice(index, 1);
	localStorage.setItem("packages", JSON.stringify(packages));
	loadPackagingData();
	loadInventory();
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

// Sort sales by selected criteria
function sortSales() {
	const sortBy = document.getElementById("sortSales").value;
	const purchases = JSON.parse(localStorage.getItem("purchases")) || [];
	purchases.sort((a, b) => {
		if (sortBy === "date") {
			return new Date(a.date) - new Date(b.date);
		} else if (sortBy === "quantity") {
			return a.quantity - b.quantity;
		} else if (sortBy === "price") {
			return a.pricePerKg - b.pricePerKg;
		} else if (sortBy === "totalCost") {
			return a.totalCost - b.totalCost;
		}
	});
	displayPurchases(purchases);
}

function displayPurchases(purchases) {
	const tableBody = document.querySelector("#allSalesTable tbody");
	tableBody.innerHTML = ""; // Clear existing rows

	purchases.forEach((purchase) => {
		const row = document.createElement("tr");
		row.innerHTML = `
			<td>${purchase.id}</td>
			<td>${purchase.farmerName}</td>
			<td>${purchase.farmerId}</td>
			<td>${purchase.date}</td>
			<td>${purchase.quantity}</td>
			<td>${purchase.pricePerKg}</td>
			<td>${purchase.totalCost}</td>
		`;
		tableBody.appendChild(row);
	});
}

// Load all sales data and display in the table
function loadAllPurchases() {
	const purchases = JSON.parse(localStorage.getItem("purchases")) || [];
	displayPurchases(purchases);
}

// Load all sales data and display in the table
function loadAllPurchases() {
	const purchases = JSON.parse(localStorage.getItem("purchases")) || [];
	const tableBody = document.querySelector("#allSalesTable tbody");
	tableBody.innerHTML = ""; // Clear existing rows

	purchases.forEach((purchase) => {
		const row = document.createElement("tr");
		row.innerHTML = `
			<td>${purchase.id}</td>
			<td>${purchase.farmerName}</td>
			<td>${purchase.farmerId}</td>
			<td>${purchase.date}</td>
			<td>${purchase.quantity}</td>
			<td>${purchase.pricePerKg}</td>
			<td>${purchase.totalCost}</td>
		`;
		tableBody.appendChild(row);
	});
}

// Initial Load
document.addEventListener("DOMContentLoaded", () => {
	loadFarmers();
	loadPackagingData();
	loadInventory();
	loadAllPurchases(); // Load all sales records on page load
	const selectedFarmerId = localStorage.getItem("selectedFarmerId");
	if (selectedFarmerId) {
		loadSales(selectedFarmerId);
	}
});

// Load Orders Data from localStorage
function loadOrders() {
	const orders = JSON.parse(localStorage.getItem("orders"));
	displayOrders(orders);
	updateRevenueTracking(); // Update revenue tracking after loading orders
}

// Load product cards for order creation
function loadProductCards() {
	const packages = JSON.parse(localStorage.getItem("packages"));
	const productCardsContainer = document.getElementById("productCards");
	productCardsContainer.innerHTML = ""; // Clear existing cards

	packages.forEach((pkg) => {
		const card = document.createElement("div");
		card.className = "product-card";
		card.innerHTML = `
			<h4>${pkg.type}</h4>
			<p>Price: $${pkg.price}</p>
			<p>Available: ${pkg.quantity} pcs</p>
			<label for="quantity-${pkg.id}">Quantity:</label>
			<input type="number" id="quantity-${pkg.id}" class="productQuantity" min="1" max="${pkg.quantity}" />
		`;
		productCardsContainer.appendChild(card);
	});
}

// Add a new order
function showAddOrderModal() {
	document.getElementById("addOrderModal").style.display = "block";
	loadProductCards(); // Load product cards when the modal is shown
}

function closeAddOrderModal() {
	document.getElementById("addOrderModal").style.display = "none";
}

document
	.getElementById("addOrderForm")
	.addEventListener("submit", function (e) {
		e.preventDefault();
		const customerName = document.getElementById("customerName").value;
		const address = document.getElementById("address").value;
		const products = getSelectedProducts();
		const totalCost = calculateTotalCost(products);
		const date = new Date().toLocaleString();

		const orders = JSON.parse(localStorage.getItem("orders")) || [];
		const newId = orders.length ? orders[orders.length - 1].id + 1 : 1; // Auto-generate Order ID
		const newOrder = {
			id: newId,
			customerName,
			address,
			products,
			totalCost,
			date,
		};

		orders.push(newOrder);
		localStorage.setItem("orders", JSON.stringify(orders));

		updateInventoryAfterOrder(products); // Update inventory after order
		closeAddOrderModal();
		loadOrders();
		checkStockAlerts(); // Check stock alerts after updating inventory
		updateRevenueTracking(); // Update revenue tracking after adding order
	});

// Edit an existing order
function editOrder(id) {
	const orders = JSON.parse(localStorage.getItem("orders"));
	const order = orders.find((o) => o.id === id);

	const newCustomerName = prompt(
		"Enter new customer name:",
		order.customerName
	);
	const newAddress = prompt("Enter new address:", order.address);
	const newProducts = getSelectedProducts();
	const newTotalCost = calculateTotalCost(newProducts);

	if (newCustomerName && newAddress) {
		order.customerName = newCustomerName;
		order.address = newAddress;
		order.products = newProducts;
		order.totalCost = newTotalCost;

		localStorage.setItem("orders", JSON.stringify(orders));
		loadOrders();
		updateRevenueTracking(); // Update revenue tracking after editing order
	}
}

// Delete an order
function deleteOrder(id) {
	const orders = JSON.parse(localStorage.getItem("orders"));
	const updatedOrders = orders.filter((o) => o.id !== id);

	localStorage.setItem("orders", JSON.stringify(updatedOrders));
	loadOrders();
	updateRevenueTracking(); // Update revenue tracking after deleting order
}

// Get selected products from the form
function getSelectedProducts() {
	const products = [];
	const productElements = document.querySelectorAll(".product-card");
	productElements.forEach((productElement) => {
		const name = productElement.querySelector("h4").textContent;
		const quantity = parseFloat(
			productElement.querySelector(".productQuantity").value
		);
		if (name && !isNaN(quantity) && quantity > 0) {
			products.push({ name, quantity });
		}
	});
	return products;
}

// Calculate total cost for the order
function calculateTotalCost(products) {
	return products.reduce(
		(total, product) =>
			total + product.quantity * getProductPrice(product.name),
		0
	);
}

// Get product price from inventory
function getProductPrice(productName) {
	const packages = JSON.parse(localStorage.getItem("packages"));
	const product = packages.find((pkg) => pkg.type === productName);
	return product ? product.price : 0;
}

// Update inventory after order
function updateInventoryAfterOrder(products) {
	const packages = JSON.parse(localStorage.getItem("packages"));
	products.forEach((product) => {
		const pkg = packages.find((p) => p.type === product.name);
		if (pkg) {
			pkg.quantity -= product.quantity;
		}
	});
	localStorage.setItem("packages", JSON.stringify(packages));
	loadInventory();
}

// Calculate and display revenue tracking
function updateRevenueTracking() {
	const orders = JSON.parse(localStorage.getItem("orders")) || [];
	const packages = JSON.parse(localStorage.getItem("packages")) || [];
	const purchases = JSON.parse(localStorage.getItem("purchases")) || [];

	// Calculate average raw blueberry cost
	const totalPurchaseCost = purchases.reduce(
		(total, purchase) => total + purchase.totalCost,
		0
	);
	const totalPurchaseQuantity = purchases.reduce(
		(total, purchase) => total + purchase.quantity,
		0
	);
	const avgRawCost = totalPurchaseQuantity
		? totalPurchaseCost / totalPurchaseQuantity
		: 0;

	// Calculate total revenue
	const totalRevenue = orders.reduce((total, order) => {
		const orderRevenue =
			order.totalCost -
			order.products.reduce(
				(productTotal, product) =>
					productTotal +
					product.quantity * (avgRawCost * getProductWeight(product.name)),
				0
			);
		return total + orderRevenue;
	}, 0);
	document.getElementById("totalRevenue").textContent = totalRevenue.toFixed(2);

	// Calculate revenue by product category
	const revenueByCategory = {};
	const unitsSoldPerCategory = {};
	orders.forEach((order) => {
		order.products.forEach((product) => {
			const productRevenue = product.quantity * getProductPrice(product.name);
			const productCost =
				product.quantity * (avgRawCost * getProductWeight(product.name));
			const netRevenue = productRevenue - productCost;
			if (!revenueByCategory[product.name]) {
				revenueByCategory[product.name] = 0;
			}
			revenueByCategory[product.name] += netRevenue;

			if (!unitsSoldPerCategory[product.name]) {
				unitsSoldPerCategory[product.name] = 0;
			}
			unitsSoldPerCategory[product.name] += product.quantity;
		});
	});

	const revenueByCategoryList = document.getElementById("revenueByCategory");
	revenueByCategoryList.innerHTML = "";
	for (const [category, revenue] of Object.entries(revenueByCategory)) {
		const listItem = document.createElement("li");
		listItem.textContent = `${category}: $${revenue.toFixed(2)}`;
		revenueByCategoryList.appendChild(listItem);
	}

	const unitsSoldPerCategoryList = document.getElementById(
		"unitsSoldPerCategory"
	);
	unitsSoldPerCategoryList.innerHTML = "";
	for (const [category, units] of Object.entries(unitsSoldPerCategory)) {
		const listItem = document.createElement("li");
		listItem.textContent = `${category}: ${units} pcs`;
		unitsSoldPerCategoryList.appendChild(listItem);
	}

	// Calculate revenue per order
	const revenuePerOrderList = document.getElementById("revenuePerOrder");
	revenuePerOrderList.innerHTML = "";
	orders.forEach((order) => {
		const orderRevenue =
			order.totalCost -
			order.products.reduce(
				(total, product) =>
					total +
					product.quantity * (avgRawCost * getProductWeight(product.name)),
				0
			);
		const listItem = document.createElement("li");
		listItem.textContent = `Order ${order.id}: $${orderRevenue.toFixed(2)}`;
		revenuePerOrderList.appendChild(listItem);
	});
}

// Get product weight from inventory
function getProductWeight(productName) {
	const packageWeights = {
		"Small (100g)": 0.1,
		"Medium (200g)": 0.2,
		"Large (500g)": 0.5,
		"Extra Large (1kg)": 1,
		"Family pack (2kg)": 2,
		"Bulk pack (5kg)": 5,
		custom: 0, // Custom weight will be handled separately
	};
	return packageWeights[productName] || 0;
}

// Search and filter orders
function searchOrders() {
	const query = document.getElementById("searchOrders").value.toLowerCase();
	const orders = JSON.parse(localStorage.getItem("orders"));
	const filteredOrders = orders.filter(
		(order) =>
			order.customerName.toLowerCase().includes(query) ||
			order.products.some((product) =>
				product.name.toLowerCase().includes(query)
			) ||
			order.date.toLowerCase().includes(query)
	);

	const tableBody = document.querySelector("#ordersTable tbody");
	tableBody.innerHTML = ""; // Clear existing rows

	filteredOrders.forEach((order) => {
		const row = document.createElement("tr");
		row.innerHTML = `
        <td>${order.id}</td>
        <td>${order.customerName}</td>
        <td>${order.address}</td>
        <td>${order.products
					.map((p) => `${p.name} (${p.quantity})`)
					.join(", ")}</td>
        <td>${order.totalCost}</td>
        <td>${order.date}</td>
        <td>
          <button onclick="editOrder(${order.id})">Edit</button>
          <button onclick="deleteOrder(${order.id})">Delete</button>
        </td>
      `;
		tableBody.appendChild(row);
	});
}

// Calculate and display financial analysis
function updateFinancialAnalysis() {
	const orders = JSON.parse(localStorage.getItem("orders")) || [];
	const purchases = JSON.parse(localStorage.getItem("purchases")) || [];
	const taxRate = 0.1; // Define a tax rate of 10%

	// Calculate income (sum of all sales revenue)
	const income = orders.reduce((total, order) => total + order.totalCost, 0);
	document.getElementById("income").textContent = income.toFixed(2);
	document.getElementById(
		"incomeCalculation"
	).textContent = `Total Income = ${orders
		.map((order) => order.totalCost)
		.join("$ + ")}$ = ${income.toFixed(2)}$`;

	// Calculate expenses (total cost of all blueberry purchases)
	const expenses = purchases.reduce(
		(total, purchase) => total + purchase.totalCost,
		0
	);
	document.getElementById("expenses").textContent = expenses.toFixed(2);
	document.getElementById(
		"expensesCalculation"
	).textContent = `Expenses = ${purchases
		.map((purchase) => purchase.totalCost)
		.join("$ + ")}$ = ${expenses.toFixed(2)}$`;

	// Calculate taxes
	const taxes = income * taxRate;
	document.getElementById("taxes").textContent = taxes.toFixed(2);
	document.getElementById(
		"taxesCalculation"
	).textContent = `Taxes = Income x Tax Rate (10%) = ${income.toFixed(
		2
	)}$ x 0.1 = ${taxes.toFixed(2)}$`;

	// Calculate net profit (income - expenses - taxes)
	const netProfit = income - expenses - taxes;
	document.getElementById("netProfit").textContent = netProfit.toFixed(2);
	document.getElementById(
		"netProfitCalculation"
	).textContent = `Net Profit = Income - Expenses - Taxes = ${income.toFixed(
		2
	)}$ - ${expenses.toFixed(2)}$ - ${taxes.toFixed(2)}$ = ${netProfit.toFixed(
		2
	)}$`;
}

// Generate Comprehensive Report
function generateComprehensiveReport() {
	const orders = JSON.parse(localStorage.getItem("orders")) || [];
	const purchases = JSON.parse(localStorage.getItem("purchases")) || [];
	const packages = JSON.parse(localStorage.getItem("packages")) || [];
	const rawInventory = JSON.parse(localStorage.getItem("rawInventory")) || {};
	const taxRate = 0.1; // Define a tax rate of 10%

	// Calculate total income from sales
	const totalIncome = orders.reduce(
		(total, order) => total + order.totalCost,
		0
	);
	document.getElementById("reportIncome").textContent = totalIncome.toFixed(2);

	// Calculate total expenses from purchases
	const totalExpenses = purchases.reduce(
		(total, purchase) => total + purchase.totalCost,
		0
	);
	document.getElementById("reportExpenses").textContent =
		totalExpenses.toFixed(2);

	// Calculate tax applied
	const totalTaxes = totalIncome * taxRate;
	document.getElementById("reportTaxes").textContent = totalTaxes.toFixed(2);

	// Calculate net profit
	const netProfit = totalIncome - totalExpenses - totalTaxes;
	document.getElementById("reportNetProfit").textContent = netProfit.toFixed(2);

	// Calculate number of products sold per category
	const productsSoldPerCategory = {};
	orders.forEach((order) => {
		order.products.forEach((product) => {
			if (!productsSoldPerCategory[product.name]) {
				productsSoldPerCategory[product.name] = 0;
			}
			productsSoldPerCategory[product.name] += product.quantity;
		});
	});

	const productsSoldPerCategoryList = document.getElementById(
		"productsSoldPerCategory"
	);
	productsSoldPerCategoryList.innerHTML = "";
	for (const [category, quantity] of Object.entries(productsSoldPerCategory)) {
		const listItem = document.createElement("li");
		listItem.textContent = `${category}: ${quantity} pcs`;
		productsSoldPerCategoryList.appendChild(listItem);
	}

	// Calculate remaining stock per category
	const remainingStockPerCategory = {};
	remainingStockPerCategory["Raw Blueberries"] = rawInventory.quantity || 0;
	packages.forEach((pkg) => {
		remainingStockPerCategory[pkg.type] = pkg.quantity;
	});

	const remainingStockPerCategoryList = document.getElementById(
		"remainingStockPerCategory"
	);
	remainingStockPerCategoryList.innerHTML = "";
	for (const [category, quantity] of Object.entries(
		remainingStockPerCategory
	)) {
		const listItem = document.createElement("li");
		listItem.textContent = `${category}: ${
			category === "Raw Blueberries" ? `${quantity} kg` : `${quantity} pcs`
		}`;
		remainingStockPerCategoryList.appendChild(listItem);
	}
}

// Sort orders by selected criteria
function sortOrders() {
	const sortBy = document.getElementById("sortOrders").value;
	const orders = JSON.parse(localStorage.getItem("orders")) || [];
	orders.sort((a, b) => {
		if (sortBy === "date") {
			return new Date(a.date) - new Date(b.date);
		} else if (sortBy === "totalCost") {
			return a.totalCost - b.totalCost;
		} else if (sortBy === "id") {
			return a.id - b.id;
		}
	});
	displayOrders(orders);
}

function displayOrders(orders) {
	const tableBody = document.querySelector("#ordersTable tbody");
	tableBody.innerHTML = ""; // Clear existing rows

	orders.forEach((order) => {
		const row = document.createElement("tr");
		row.innerHTML = `
			<td>${order.id}</td>
			<td>${order.customerName}</td>
			<td>${order.address}</td>
			<td>${order.products.map((p) => `${p.name} (${p.quantity})`).join(", ")}</td>
			<td>${order.totalCost}</td>
			<td>${order.date}</td>
		`;
		tableBody.appendChild(row);
	});
}

// Initial Load
document.addEventListener("DOMContentLoaded", () => {
	loadFarmers();
	loadPackagingData();
	loadInventory();
	loadOrders(); // Load all orders on page load
	loadAllPurchases(); // Load all sales records on page load
	updateFinancialAnalysis(); // Update financial analysis on page load
	generateComprehensiveReport(); // Generate comprehensive report on page load
	const selectedFarmerId = localStorage.getItem("selectedFarmerId");
	if (selectedFarmerId) {
		loadSales(selectedFarmerId);
	}
});
