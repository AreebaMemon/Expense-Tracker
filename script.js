let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

const form = document.getElementById("expense-form");
const list = document.getElementById("expense-list");
const totalEl = document.getElementById("total");
const chartCtx = document.getElementById("category-chart").getContext("2d");

let chart;

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const newExpense = {
    id: Date.now(),
    title: form.title.value,
    amount: parseFloat(form.amount.value),
    category: form.category.value,
    date: form.date.value,
    notes: form.notes.value
  };

  if (newExpense.amount <= 0 || !newExpense.title || !newExpense.category || !newExpense.date) {
    alert("Please fill all required fields correctly!");
    return;
  }

  expenses.push(newExpense);
  localStorage.setItem("expenses", JSON.stringify(expenses));

  form.reset();
  renderExpenses();
  renderChart();
});

function renderExpenses() {
  list.innerHTML = "";
  const sorted = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

  sorted.forEach((exp) => {
    const div = document.createElement("div");
    div.className = "border p-3 rounded bg-gray-50 flex justify-between items-center";

    div.innerHTML = `
      <div>
        <h3 class="font-bold">${exp.title}</h3>
        <p>Rs ${exp.amount} | ${exp.category} | ${exp.date}</p>
        <p class="text-sm text-gray-600">${exp.notes}</p>
      </div>
      <div class="space-x-2">
        <button onclick="editExpense(${exp.id})" class="text-blue-600 hover:underline">Edit</button>
        <button onclick="deleteExpense(${exp.id})" class="text-red-600 hover:underline">Delete</button>
      </div>
    `;

    list.appendChild(div);
  });

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  totalEl.textContent = total;
}

function deleteExpense(id) {
  if (confirm("Delete this expense?")) {
    expenses = expenses.filter(e => e.id !== id);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    renderExpenses();
    renderChart();
  }
}

function editExpense(id) {
  const exp = expenses.find(e => e.id === id);
  form.title.value = exp.title;
  form.amount.value = exp.amount;
  form.category.value = exp.category;
  form.date.value = exp.date;
  form.notes.value = exp.notes;

  expenses = expenses.filter(e => e.id !== id);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  renderExpenses();
  renderChart();
}

function renderChart() {
  const categoryTotals = {};

  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  if (chart) chart.destroy(); 

  chart = new Chart(chartCtx, {
    type: "pie",
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ["#f87171", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa"]
      }]
    }
  });
}


renderExpenses();
renderChart();
