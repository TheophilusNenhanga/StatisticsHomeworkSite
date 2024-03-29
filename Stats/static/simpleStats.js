if (window.location.href.includes("simple")) {
    document.addEventListener("DOMContentLoaded", function () {
        let dataset = JSON.parse(localStorage.getItem("dataset")) ?? [];
        let dataGrid = document.getElementById("data-grid");
        let valueInput = document.getElementById("value");
        let rounding;

        async function checkDataSet() {
            if (dataset) {
                let loadDataset = confirm("Previous Dataset found\nWould you want to load your previous dataset?");
                if (loadDataset) {
                    await updateUI();
                } else {
                    dataset = [];
                }
            }
        }

        async function updateUI() {
            if (dataset.length !== 0) {
                dataGrid.innerHTML = "";
                dataGrid.style.display = "grid";
                dataset.forEach((value, index) => {
                    const pElement = document.createElement("p");
                    pElement.className = "data-value center";
                    pElement.id = `value-${index}`;
                    pElement.textContent = value;
                    pElement.addEventListener("dblclick", function () {
                        dataGrid.removeChild(pElement);
                        let myIndex = dataset.indexOf(value);
                        dataset.splice(myIndex, 1);
                        updateUI();
                    });
                    dataGrid.appendChild(pElement);
                });
                await sendForCalculation(dataset);
                localStorage.setItem("dataset", JSON.stringify(dataset))
                valueInput.focus();
            } else {
                dataGrid.innerHTML = "";
                dataGrid.style.display = "block";
                let emptyP = document.createElement("p");
                emptyP.textContent = "The data set is empty";
                dataGrid.appendChild(emptyP);
                await sendForCalculation(dataset);
                valueInput.focus();
            }
        }

        function sendForCalculation(dataset) {
            fetch("/simple/calculate", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({dataset: dataset})
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error. Status: ${response.status}`);
                }
                return response.json();
            })
                .then((data) => {
                    if (data.message === "error") throw new Error(`Internal Server Error. Error: ${data.error}`);
                    updateResults(data.result);
                }).catch((error) => {
                console.error(error);
            })
        }

        function updateResults(results) {
            document.getElementById("mean").textContent = `= ${roundNumber(results.mean, rounding)}`;
            document.getElementById("mode").textContent = `= ${roundNumber(results.mode, rounding)}`;
            document.getElementById("median").textContent = `= ${roundNumber(results.median, rounding)}`;
            document.getElementById("range").textContent = `= ${roundNumber(results.range, rounding)}`;
            document.getElementById("variance").textContent = `= ${roundNumber(results.variance, rounding)}`;
            document.getElementById("std-deviation").textContent = `= ${roundNumber(results.standard_deviation, rounding)}`;
            document.getElementById("mean-deviation").textContent = `= ${roundNumber(results.mean_deviation, rounding)}`;
            document.getElementById("lower-quartile").textContent = `= ${roundNumber(results.lower_quartile, rounding)}`;
            document.getElementById("upper-quartile").textContent = `= ${roundNumber(results.upper_quartile, rounding)}`;
            document.getElementById("iqr").textContent = `= ${roundNumber(results.inter_quartile, rounding)}`;
            document.getElementById("lower-fence").textContent = `= ${roundNumber(results.lower_fence, rounding)}`;
            document.getElementById("upper-fence").textContent = `= ${roundNumber(results.upper_fence, rounding)}`;
        }

        let simpleForm = document.getElementById("simple-submission");
        simpleForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            let formData = new FormData(simpleForm)
            rounding = formData.get("rounding");
            let value = formData.get("value");
            dataset.push(Number(value));
            await updateUI();
        });

        let ascending = document.getElementById("ascending-button");
        let descending = document.getElementById("descending-button");
        let reset = document.getElementById("reset-data");
        let roundingDropdown = document.getElementById("rounding");

        // selecting precision
        roundingDropdown.addEventListener("change", async function () {
            rounding = roundingDropdown.options[roundingDropdown.selectedIndex].text;
            await updateUI();
        });

        // sort in ascending order
        ascending.addEventListener("click", async function () {
            dataset.sort((a, b) => a - b);
            await updateUI();
        });

        // sort in descending order
        descending.addEventListener("click", async function () {
            dataset.sort((a, b) => b - a);
            await updateUI();
        });

        reset.addEventListener("click", async function () {
            dataset = [];
            localStorage.setItem("dataset", JSON.stringify(dataset));
            await updateUI();
        });

        checkDataSet();

    });

    function roundNumber(number, digits) {
        let multiple = Math.pow(10, digits);
        return Math.round(number * multiple) / multiple;
    }
    valueInput.focus();
}
