async function fetchData(sheetId, sheetName) {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;
    const response = await fetch(url);
    const text = await response.text();
    const json = JSON.parse(text.substring(47, text.length - 2));
    return json.table.rows;
}

function renderTable(rows, sheetName) {
    const table = document.getElementById("resultsTable");
    table.innerHTML = "";
    
    let headers = ["Rnk", "Bib", "Last name", "First name", "Country", "Time 200 m", "100 m", "Avg. Speed km/h"];
    if (sheetName.includes("Omnium")) {
        headers.push("Total Points", "Race 1", "Race 2", "Race 3", "Race 4");
    }
    
    let thead = document.createElement("thead");
    let headerRow = document.createElement("tr");
    headers.forEach(header => {
        let th = document.createElement("th");
        th.innerText = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    let tbody = document.createElement("tbody");
    rows.forEach(row => {
        let tr = document.createElement("tr");
        row.c.forEach((cell, index) => {
            let td = document.createElement("td");
            if (index === 4) {
                td.innerHTML = `<img src='https://flagcdn.com/w40/${cell.v.toLowerCase()}.png' alt='${cell.v}' width='30'>`;
            } else {
                td.innerText = cell?.v || "";
            }
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
}

async function loadResults() {
    const sheetId = "1ZwAdWz1Q9_34cw5cR3YkgIpVDlVagKzYGrwAdvmGn6g";
    const sheetName = document.getElementById("disciplineSelect").value;
    const data = await fetchData(sheetId, sheetName);
    renderTable(data, sheetName);
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("loadButton").addEventListener("click", loadResults);
});
