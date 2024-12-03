let currentPokemonId = 1;

document.addEventListener("DOMContentLoaded", () => {
    const pokemonID = new URLSearchParams(window.location.search).get("id");
    const id = parseInt(pokemonID, 10);
    if (id < 1 || id > 151) {
        return (window.location.href = "./index.html");
    }

    currentPokemonId = id;
    loadPokemon(id);
});


async function loadPokemon(id) {
    try {

        const [pokemon, pokemonSpecies] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json()),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => res.json()),
        ]);
        updateUI(pokemon, pokemonSpecies); 
    } catch (error) {
        console.error("Ocorreu um erro ao acessar as informações: " + error);
    }
}

function updateUI(pokemon, pokemonSpecies) {
    const elements = getElements();

    const primaryType = pokemon.types[0].type.name;
    updateProgressBarStyles(primaryType);

    elements.namePokemon.innerText = pokemon.name;
    elements.main.className = "";
    elements.main.classList.add(`${pokemon.types[0].type.name}`);
    elements.main.style.transition = "background-color 0.3s ease";

    elements.photoPoke.innerHTML = `<img src="${pokemon.sprites.other.dream_world.front_default}" alt="">`;
    elements.weight.innerText = pokemon.weight;
    elements.height.innerText = pokemon.height;
    elements.move.innerText = pokemon.abilities.map(ability => ability.ability.name).join(" ");

    const flavorTextRaw = pokemonSpecies.flavor_text_entries.find(entry => entry.language.name === "en")?.flavor_text || "Description not available in English.";
    elements.about.innerText = flavorTextRaw.replace(/(\n|<br>)/g, " ");

    elements.aboutType.innerHTML = pokemon.types.map(type => `<li class="type ${type.type.name}">${type.type.name}</li>`).join('');
    elements.progressHp.value = pokemon.stats.find(stat => stat.stat.name === "hp").base_stat;
    elements.progressAtk.value = pokemon.stats.find(stat => stat.stat.name === "attack").base_stat;
    elements.progressDef.value = pokemon.stats.find(stat => stat.stat.name === "defense").base_stat;
    elements.progressSatk.value = pokemon.stats.find(stat => stat.stat.name === "special-attack").base_stat;
    elements.pokeNumber.innerText = `#${String(pokemon.id).padStart(3, '0')}`;
}


function getElements() {
    return {
        namePokemon: document.querySelector(".namePoke"),
        photoPoke: document.querySelector(".photoPoke"),
        weight: document.querySelector(".weight"),
        height: document.querySelector(".height"),
        move: document.querySelector(".move"),
        about: document.querySelector(".aboutDescription"),
        progressHp: document.querySelector(".hp"),
        progressAtk: document.querySelector(".atk"),
        progressDef: document.querySelector(".def"),
        progressSatk: document.querySelector(".satk"),
        aboutType: document.querySelector(".aboutType"),
        pokeNumber: document.querySelector(".pokeNumber"),
        main: document.getElementsByTagName("main")[0],
        progress: document.querySelector(".colorProgress")
    };
}


function updateProgressBarStyles(type) {
    const typeColors = {
        normal: "#a6a877",
        grass: "#77c850",
        fire: "#ee7f30",
        water: "#678fee",
        electric: "#f7cf2e",
        ice: "#98d5d7",
        ground: "#dfbf69",
        flying: "#a98ff0",
        poison: "#a040a0",
        fighting: "#bf3029",
        psychic: "#f65687",
        dark: "#725847",
        rock: "#b8a137",
        bug: "#a8b720",
        ghost: "#6e5896",
        steel: "#b9b7cf",
        dragon: "#6f38f6",
        fairy: "#f9aec7",
    };

    const color = typeColors[type] || "#fff"; 
    const aboutH2 = document.querySelector(".aboutH2");
    const baseStatsName = document.querySelector(".baseStatsName");

    let styleElement = document.getElementById("dynamicProgressStyle");
    if (styleElement) {
        styleElement.remove();
    }

    styleElement = document.createElement("style");
    styleElement.id = "dynamicProgressStyle";
    styleElement.innerHTML = `
        progress::-webkit-progress-value {
            background-color: ${color};
        }

        progress::-moz-progress-bar {
            background-color: ${color};
        }
    `;
    document.head.appendChild(styleElement);

    aboutH2.style.color = color;
    baseStatsName.style.color = color;
}

const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('click', (event) => {
        const action = event.target.dataset.action;

        if ((action === "left" && currentPokemonId <= 1) ||
            (action === "right" && currentPokemonId >= 151)) {
            return (window.location.href = "./index.html");
        }

        if (action === "left") {
            currentPokemonId -= 1;
        } else if (action === "right") {
            currentPokemonId += 1;
        }

        window.history.pushState({}, "", `./detail.html?${currentPokemonId}`);
        loadPokemon(currentPokemonId);
    });
});
