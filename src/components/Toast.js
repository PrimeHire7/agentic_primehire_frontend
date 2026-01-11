export const toast = (msg) => {
    const div = document.createElement("div");
    div.className = "simple-toast";
    div.innerText = msg;
    document.body.appendChild(div);

    setTimeout(() => {
        div.classList.add("fade");
        setTimeout(() => div.remove(), 500);
    }, 2000);
};
