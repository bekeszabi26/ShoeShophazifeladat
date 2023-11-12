function renderCipok() {
    let cipokHTML = "";
    let cipokLista = document.getElementById("cipok-lista");
    let xhr = new XMLHttpRequest();
    console.log(xhr);

    xhr.open('GET', 'http://localhost:3000/cipok', true);

    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log(xhr.responseText);
            let cipok = JSON.parse(xhr.responseText);
            console.log(cipok);
            cipok.forEach(function (cipok) {
                console.log(cipok.id);
                console.log(cipok.nev);
                cipokHTML += `
                    <div class="col">
                        <div class="${cipok.raktaron ? "bg-success" : "bg-danger"} m-2 p-2">
                            <h2>${cipok.nev}</h2>
                            <p>A termék ára: ${cipok.ara} Ft</p>
                            <button class="btn btn-danger" onclick="torles(${cipok.id})">Törlés</button>
                            <button class="btn btn-primary" onclick="modositas(${cipok.id})">Módosítás</button>
                        </div>
                    </div>
                `;
            });
            cipokLista.innerHTML = cipokHTML;
        } else {
            console.error('Hiba történt az adatok betöltésekor:', xhr.status, xhr.statusText);
        }
    };
    xhr.send();
}
//Új termék felvitele
document.getElementById('ujtermek').onclick = function() {

    let newFormHTML = `
        <h4>Áru hozzáadása:</h4>
        <form id="uj-cipok" class="p-5">
            <label class="w-100">
                <h5>Termék neve:</h5>
                <input class="form-control" type="text" name="nev">
            </label>
            <label class="w-100">
                <h5>Termék ára:</h5>
                <input class="form-control" type="number" name="ara">
            </label>
            <label>
                <h5>Van raktáron?</h5> 
                <input type="checkbox" name="raktaron">
            </label>
            <br>
            <button class="btn btn-success" type="submit">Küldés</button>
        </form>
    `;

    let ujElem = document.getElementById('uj');
    ujElem.innerHTML = newFormHTML;
    document.getElementById('ujtermek').style.display = 'none';

    let ujCipokForm = document.getElementById("uj-cipok");
    ujCipokForm.onsubmit = function (event) {
        event.preventDefault();
        let nev = event.target.elements.nev.value;
        let ara = event.target.elements.ara.value;
        let raktaron = event.target.elements.raktaron.checked;

        let xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3000/cipok', true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.onload = function () {
            if (xhr.status === 201) {
                renderCipok();
                ujElem.innerHTML = '';
                document.getElementById('ujtermek').style.display = 'block';
            } else {
                console.error('Hiba történt az adatok létrehozása során:', xhr.status, xhr.statusText);
            }
        };

        xhr.send(JSON.stringify({
            nev: nev,
            ara: ara,
            raktaron: raktaron
        }));
    };
};

//Törlés
function torles(id) {
    console.log("Törlendő elem id:", id)
    let xhr = new XMLHttpRequest();
    xhr.open('DELETE', 'http://localhost:3000/cipok/' + id, true);

    xhr.onload = function () {
        if (xhr.status === 200 || xhr.status === 204) {
            renderCipok();
            console.log(xhr.status);
        } else {
            console.error('Hiba történt a törlés során:', xhr.status, xhr.statusText);
        }
    };

    xhr.send();
}

//Módosítás
function modositas(id) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:3000/cipok/' + id, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            let cipok = JSON.parse(xhr.responseText);
            let modositasFormHTML = `
                <h4>Termék módosítása:</h4>
                <form id="modositas-cipok" class="p-5">
                    <label class="w-100">
                        <h5>Termék neve:</h5>
                        <input class="form-control" type="text" name="nev" value="${cipok.nev}">
                    </label>
                    <label class="w-100">
                        <h5>Termék ára:</h5>
                        <input class="form-control" type="number" name="ara" value="${cipok.ara}">
                    </label>
                    <label>
                        <h5>Van raktáron?</h5> 
                        <input type="checkbox" name="raktaron" ${cipok.raktaron ? 'checked' : ''}>
                    </label>
                    <br>
                    <button class="btn btn-primary" type="submit">Mentés</button>
                </form>
            `;

            let szerkesztesElem = document.getElementById('szerkesztes');
            szerkesztesElem.innerHTML = modositasFormHTML;
            document.getElementById('ujtermek').style.display = 'none';

            let modositasCipokForm = document.getElementById("modositas-cipok");
            modositasCipokForm.onsubmit = function (event) {
                event.preventDefault();
                let nev = event.target.elements.nev.value;
                let ara = event.target.elements.ara.value;
                let raktaron = event.target.elements.raktaron.checked;

                let xhr = new XMLHttpRequest();
                xhr.open('PUT', 'http://localhost:3000/cipok/' + id, true);
                xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

                xhr.onload = function () {
                    if (xhr.status === 200) {
                        renderCipok();
                        szerkesztesElem.innerHTML = '';
                        document.getElementById('ujtermek').style.display = 'block';
                    } else {
                        console.error('Hiba történt az adatok módosítása során:', xhr.status, xhr.statusText);
                    }
                };

                xhr.send(JSON.stringify({
                    nev: nev,
                    ara: ara,
                    raktaron: raktaron
                }));
            }
        } else {
            console.error('Hiba történt a módosítás során:', xhr.status, xhr.statusText);
        }
    };

    xhr.send();
}

window.onload = renderCipok;