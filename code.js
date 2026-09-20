const hotspots = [
    {
        id: "cafe",
        x: 65,
        y: 72,
        iconUrl: "image/v.png",
        titleImg: "image/1.png",
        title: "{{img}}В парке существует 37 видов рыб.",
        url: "https://ru.wikipedia.org/wiki/%D0%A0%D1%8B%D0%B1%D1%8B",
    },
    {
        id: "hall",
        x: 18.0,
        y: 36.0,
        iconUrl: "image/v.png",
        titleImg: "image/.png",
        title: "Фауна парка включает246 видов птиц.",
        url: "https://ru.wikipedia.org/wiki/%D0%9F%D1%82%D0%B8%D1%86%D1%8B",
    },
    {
        id: "exit",
        x: 50.0,
        y: 43.0,
        iconUrl: "image/v.png",
        titleImg: "image/fish.png",
        title: "Парк включает 51 вид млекопитающих.",
        url: "https://ru.wikipedia.org/wiki/%D0%9C%D0%BB%D0%B5%D0%BA%D0%BE%D0%BF%D0%B8%D1%82%D0%B0%D1%8E%D1%89%D0%B8%D0%B5",
    },
    {
        id: "ss",
        x: 13,
        y: 56,
        iconUrl: "image/v.png",
        titleImg: "image/fish.png",
        title: "Флора включает более 950 видов сосудистых растений.",
        url: "https://ru.wikipedia.org/wiki/%D0%A1%D0%BE%D1%81%D1%83%D0%B4%D0%B8%D1%81%D1%82%D1%8B%D0%B5_%D1%80%D0%B0%D1%81%D1%82%D0%B5%D0%BD%D0%B8%D1%8F",
    },
    {
        id: "as",
        x: 13,
        y: 50,
        iconUrl: "image/v.png",
        titleImg: "image/fish.png",
        title: "В парке есть 196 видов мхов.",
        url: "https://ru.wikipedia.org/wiki/%D0%9C%D1%85%D0%B8",
    },
    {
        id: "gs",
        x: 33,
        y: 46,
        iconUrl: "image/v.png",
        titleImg: "image/fish.png",
        title: "В парке обитают 11 видов земноводных.",
        url: "https://ru.wikipedia.org/wiki/%D0%97%D0%B5%D0%BC%D0%BD%D0%BE%D0%B2%D0%BE%D0%B4%D0%BD%D1%8B%D0%B5",
    },
];

const layer = document.querySelector(".hotspot-layer");
const popup = document.querySelector(".map-popup");
const overlay = document.querySelector(".popup-overlay");
const popupTitle = document.querySelector(".popup-title");
const popupText = document.querySelector(".popup-text");
const popupClose = document.querySelector(".popup-close");


let activeId = null;

function renderMarkers() {
    layer.innerHTML = "";
    hotspots.forEach((spot) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "marker";
        btn.dataset.id = spot.id;
        btn.setAttribute("aria-label", spot.title);
        btn.style.left = spot.x + "%";
        btn.style.top = spot.y + "%";

        const icon = document.createElement("img");
        icon.src = spot.iconUrl;
        icon.alt = "";
        btn.appendChild(icon);

        btn.addEventListener("click", (event) => {
            event.stopPropagation();
            openPopup(spot.id);
        });

        layer.appendChild(btn);
    });
}

function getSpot(id) {
    return hotspots.find((spot) => spot.id === id);
}

function openPopup(id) {
    const spot = getSpot(id);
    if (!spot) return;

    if (activeId === id) {
        closePopup();
        return;
    }

    activeId = id;

    const icon = spot.titleImg
        ? '<img class="popup-inline" src="' + spot.titleImg + '" alt="">'
        : "";

    if (spot.title.includes("{{img}}") && icon) {
        popupTitle.innerHTML = spot.title.replace("{{img}}", icon);
    } else {
        popupTitle.textContent = spot.title.replace("{{img}}", "");
    }

    if (spot.title.includes("{{img}}")) {
        popupTitle.innerHTML = spot.title.replace("{{img}}", icon);
    } else {
        popupTitle.textContent = spot.title;
    }



    if (spot.url) {
        popupTitle.href = spot.url;
        popupTitle.style.cursor = "pointer";
    } else {
        popupTitle.removeAttribute("href");
        popupTitle.style.cursor = "default";
    }

    popup.hidden = false;
    overlay.hidden = false;

    placePopupNearMarker(id);
    highlightActiveMarker();
}

function placePopupNearMarker(id) {
    const isMobile = window.innerWidth < 700;

    if (isMobile) {
        popup.style.left = "12px";
        popup.style.right = "12px";
        popup.style.top = "auto";
        popup.style.bottom = "12px";
        popup.style.width = "auto";
        return;
    }

    popup.style.right = "auto";
    popup.style.bottom = "auto";
    popup.style.width = "";

    const marker = layer.querySelector('.marker[data-id="' + id + '"]');
    const r = marker.getBoundingClientRect();
    const gap = 12;

    let left = r.right + gap;
    let top = r.top + r.height / 2 - popup.offsetHeight / 2;

    if (left + popup.offsetWidth > window.innerWidth - 8) {
        left = r.left - gap - popup.offsetWidth;
    }
    if (top + popup.offsetHeight > window.innerHeight - 8) {
        top = window.innerHeight - popup.offsetHeight - 8;
    }
    if (top < 8) top = 8;

    popup.style.left = left + "px";
    popup.style.top = top + "px";
}

function closePopup() {
    activeId = null;
    popup.hidden = true;
    overlay.hidden = true;
    highlightActiveMarker();
}

function highlightActiveMarker() {
    layer.querySelectorAll(".marker").forEach((btn) => {
        const isActive = btn.dataset.id === activeId;
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-expanded", String(isActive));
    });
}


popupClose.addEventListener("click", (event) => {
    event.stopPropagation();
    closePopup();
});

overlay.addEventListener("click", closePopup);

popup.addEventListener("click", (event) => {
    event.stopPropagation();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closePopup();
});
renderMarkers();
