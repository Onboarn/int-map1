const hotspots = [
    {
        id: "cafe",
        x: 72.5,
        y: 71.0,
        iconUrl: "image/1.png",
        title: "Кафе",
        text: "Открыто с 9 до 18. Первый этаж, рядом с входом.",
    },
    {
        id: "hall",
        x: 18.0,
        y: 40.0,
        iconUrl: "image/2.png",
        title: "Зал",
        text: "Основной зал. Вместимость 200 человек.",
    },
    {
        id: "exit",
        x: 80.0,
        y: 22.0,
        iconUrl: "image/3.png",
        title: "Выход",
        text: "Запасной выход во двор.",
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
    popupTitle.textContent = spot.title;
    popupText.textContent = spot.text;
    popup.hidden = false;
    overlay.hidden = false;

    placePopupNearMarker(id);
    highlightActiveMarker();
}

function placePopupNearMarker(id) {
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