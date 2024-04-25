fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
    .then(response => response.json())
    .then(data => {
        const ulElement = document.createElement('ul');
        ulElement.classList.add('estados-lista');

        data.forEach(state => {
            const liElement = document.createElement('li');

            const anchorElement = document.createElement('a');
            anchorElement.href = `./municipios/index.html?estado=${state.sigla}`;
            anchorElement.textContent = state.nome;
            anchorElement.classList.add('state-link');

            anchorElement.addEventListener('click', (event) => {
                event.preventDefault();
                const estado = event.target.textContent;
                const url = `./municipios/index.html?estado=${state.sigla}&timestamp=${Date.now()}`; // Add cache-busting parameter
                window.history.pushState({ estado }, '', url);
                fetchMunicipios(estado);
            });

            liElement.appendChild(anchorElement);

            ulElement.appendChild(liElement);
        });

        const mainElement = document.querySelector('main');
        mainElement.appendChild(ulElement);
    })
    .catch(error => {
        console.error('Error:', error);
    });

function fetchMunicipios(estado) {
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios?timestamp=${Date.now()}`) // Add cache-busting parameter
        .then(response => response.json())
        .then(data => {
            const municipiosElement = document.createElement('ul');
            municipiosElement.classList.add('municipios-lista');

            data.forEach(municipio => {
                const liElement = document.createElement('li');
                liElement.textContent = municipio.nome;

                municipiosElement.appendChild(liElement);
            });

            const mainElement = document.querySelector('main');
            mainElement.innerHTML = '';
            mainElement.appendChild(municipiosElement);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

window.addEventListener('popstate', (event) => {
    if (event.state && event.state.estado) {
        fetchMunicipios(event.state.estado);
    }
    
});