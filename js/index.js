document.addEventListener('DOMContentLoaded', () => {
    AOS.init();

    const searchInput = document.getElementById('searchInput');
    const loadingIcon = document.getElementById('loading-icon');
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    let visibleLaunches = 12;
    let allLaunchesLoaded = false;


    loadingIcon.classList.remove('d-none');

    function fetchLaunches() {
        fetch(`https://api.spacexdata.com/v3/launches?limit=${visibleLaunches}`)
            .then(response => response.json())
            .then(data => {
                loadingIcon.classList.add('d-none');
                if (data.length < visibleLaunches) {
                    allLaunchesLoaded = true;
                }
                allLaunches = data;
                console.log(allLaunches.length);
                
                displayLaunches(allLaunches);

                searchInput.addEventListener('input', () => {
                    const searchTerm = searchInput.value.toLowerCase();
                    const filteredLaunches = allLaunches.filter(launch => launch.mission_name.toLowerCase().includes(searchTerm));
                    const sinResultados = document.querySelector('#sin-resultados');
                    if(filteredLaunches.length === 0){
                        sinResultados.style.display = 'block';
                    }else{
                        sinResultados.style.display = 'none';
                        
                    }
                    displayLaunches(filteredLaunches);
                });

                loadMoreBtn.addEventListener('click', () => {
                    const scrollUpBtn = document.querySelector('#scrollUpBtn');
                    scrollUpBtn.style.display = "block";
                    seccionTitulo = document.querySelector('#titulo');
                    const sinResultados = document.querySelector('#sin-resultados');
                    sinResultados.style.display = 'none';
                    scrollUpBtn.addEventListener('click', () => {
                        seccionTitulo.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    });
                    const scrollDownBtn = document.querySelector('#scrollDownBtn');
                    scrollDownBtn.style.display = "block";
                    seccionFin = document.querySelector('#fin');
                    scrollDownBtn.addEventListener('click', () => {
                        seccionFin.scrollIntoView({
                            behavior: 'smooth',
                            start: 'block'
                        });
                    });
                    localStorage.setItem('visibleLaunches', visibleLaunches);
                    visibleLaunches += 12;
                    fetchLaunches();

                    if (allLaunchesLoaded) {
                        loadMoreBtn.style.display = 'none';
                        mostrarMensaje("Se han cargado todos los lanzamientos", "info");
                    }
                    searchInput.value = "";
                    searchInput.placeholder = "Search by Name";
                });
            })
            
            .catch(error => {
                loadingIcon.classList.add('d-none');
                console.error('Error fetching launches:', error);
            });
    }

    fetchLaunches();
});

function displayLaunches(launches) {
    const launchList = document.getElementById('launch-list');
    launchList.innerHTML = '';

    launches.map(launch => {
        const launchCard = document.createElement('div');
        launchCard.classList.add('card', 'launch-card', 'aos-init');
        launchCard.setAttribute('data-aos', 'zoom-in');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body', 'launch-card-body');

        const rowContainer = document.createElement('div');
        rowContainer.classList.add('row', 'align-items-center', 'no-wrap'); 

        const imageColumn = document.createElement('div');
        imageColumn.classList.add('col-md-6', 'text-center');
        imageColumn.innerHTML = `<img src="${launch.links.mission_patch_small}" alt="Mission Patch" class="mission-patch aos-init mx-auto d-block" data-aos="zoom-in">`; // Agregamos las clases 'mx-auto' y 'd-block' para centrar horizontalmente

        const launchSuccess = launch.launch_success === true;

        const infoColumn = document.createElement('div');
        infoColumn.classList.add('col-md-6');
        infoColumn.innerHTML = `
            <h5 class="card-title" title="${launch.mission_name}">${launch.mission_name}</h5>
            <p class="card-text date"><i class="far fa-calendar-alt"></i> ${new Date(launch.launch_date_utc).toLocaleDateString()}</p> <!-- Utilizamos toLocaleDateString para mostrar solo la fecha -->
            <p class="card-text rocket"><i class="fas fa-rocket"></i> ${launch.rocket.rocket_name}</p>
            <p class="card-text location"><i class="fas fa-map-marker-alt"></i> ${launch.launch_site.site_name}</p>
            <p class="card-text rounded badge p-2">${launchSuccess ? '<i class="fas fa-check-circle text-success"></i> Success' : '<i class="fas fa-times-circle text-danger"></i> Failure'}</p>
            <p class="card-text ">
                <a href="${launch.links.video_link}" target="_blank">
                    <i class="fab fa-youtube"></i> Launch Video
                </a> 
            </p>

        `;

        
        rowContainer.appendChild(infoColumn);
        rowContainer.appendChild(imageColumn);

        // Agregar la fila al cuerpo de la tarjeta
        cardBody.appendChild(rowContainer);
        launchCard.appendChild(cardBody);
    
        launchList.appendChild(launchCard);
        
    });
}


function mostrarMensaje(mensaje, tipo) {
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${tipo} alert-dismissible fade show aux`;

    alertElement.innerHTML = `
      ${mensaje}
    `;

    document.body.appendChild(alertElement);

    setTimeout(() => {
      alertElement.remove();
    }, 6000);
  }
