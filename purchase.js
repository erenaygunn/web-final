document.addEventListener("DOMContentLoaded", () => {
	const urlParams = new URLSearchParams(window.location.search);
	const farmerId = urlParams.get("farmerId");
	document.getElementById("farmerId").value = farmerId;
	document.getElementById("purchaseDate").value = new Date().toLocaleString();

	loadPurchases(farmerId);

	document
		.getElementById("purchaseForm")
		.addEventListener("submit", function (e) {
			e.preventDefault();

			const quantity = parseFloat(document.getElementById("quantity").value);
			const pricePerKg = parseFloat(
				document.getElementById("pricePerKg").value
			);
			const totalCost = quantity * pricePerKg;
			const date = new Date().toLocaleString();

			const purchases = JSON.parse(localStorage.getItem("purchases")) || [];
			const newId = purchases.length
				? purchases[purchases.length - 1].id + 1
				: 1; // Auto-generate Purchase ID
			const newPurchase = {
				id: newId,
				farmerId: farmerId,
				date: date,
				quantity: quantity,
				pricePerKg: pricePerKg,
				totalCost: totalCost,
			};

			purchases.push(newPurchase);
			localStorage.setItem("purchases", JSON.stringify(purchases));

			updateRawInventory(quantity);
			loadPurchases(farmerId);
			document.getElementById("purchaseForm").reset();
			document.getElementById("purchaseDate").value =
				new Date().toLocaleString();
		});

	document
		.getElementById("quantity")
		.addEventListener("input", calculateTotalCost);
	document
		.getElementById("pricePerKg")
		.addEventListener("input", calculateTotalCost);
});

function calculateTotalCost() {
	const quantity = parseFloat(document.getElementById("quantity").value);
	const pricePerKg = parseFloat(document.getElementById("pricePerKg").value);
	const totalCost = quantity * pricePerKg;
	document.getElementById("totalCost").value = isNaN(totalCost)
		? ""
		: totalCost.toFixed(2);
}

function loadPurchases(farmerId) {
	const purchases = JSON.parse(localStorage.getItem("purchases")) || [];
	const farmerPurchases = purchases.filter(
		(purchase) => purchase.farmerId === farmerId
	);
	const tableBody = document.querySelector("#purchaseTable tbody");
	tableBody.innerHTML = ""; // Clear existing rows

	farmerPurchases.forEach((purchase) => {
		const row = document.createElement("tr");
		row.innerHTML = `
			<td>${purchase.id}</td>
			<td>${purchase.date}</td>
			<td>${purchase.quantity}</td>
			<td>${purchase.pricePerKg}</td>
			<td>${purchase.totalCost}</td>
		`;
		tableBody.appendChild(row);
	});
}

function updateRawInventory(quantity) {
	const rawInventory = JSON.parse(localStorage.getItem("rawInventory"));
	rawInventory.quantity += quantity;
	localStorage.setItem("rawInventory", JSON.stringify(rawInventory));
}
