document.addEventListener("DOMContentLoaded", () => {
    const options = {
        middleName: true,
        oddHair: true,
        oddEye: true
    };

    const toggleMiddleNameBtn = document.getElementById("toggleMiddleName");
    const toggleOddHairBtn = document.getElementById("toggleOddHair");
    const toggleOddEyeBtn = document.getElementById("toggleOddEye");
    const generateBtn = document.getElementById("generateBtn");
    const copyBtn = document.getElementById("copyBtn");
    const toggleAllBtn = document.getElementById("toggleAllBtn");
    const fieldTags = document.querySelectorAll(".field-tag");
    const toast = document.getElementById("toast");

    function getRandomItem(array) {
        if (!array || array.length === 0) return "-";
        return array[Math.floor(Math.random() * array.length)];
    }

    function getRandomItems(array, count) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    function getRandomColor() {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function toggleChip(btn, key) {
        options[key] = !options[key];
        btn.classList.toggle("active", options[key]);
        generateProfile();
    }

    if (toggleMiddleNameBtn)
        toggleMiddleNameBtn.addEventListener("click", () => toggleChip(toggleMiddleNameBtn, "middleName"));
    if (toggleOddHairBtn) toggleOddHairBtn.addEventListener("click", () => toggleChip(toggleOddHairBtn, "oddHair"));
    if (toggleOddEyeBtn) toggleOddEyeBtn.addEventListener("click", () => toggleChip(toggleOddEyeBtn, "oddEye"));

    fieldTags.forEach((tag) => {
        tag.addEventListener("click", () => {
            tag.classList.toggle("active");
            const targetId = tag.getAttribute("data-target");
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                targetEl.classList.toggle("is-hidden", !tag.classList.contains("active"));
            }
            updateBlocksVisibility();
        });
    });

    if (toggleAllBtn) {
        toggleAllBtn.addEventListener("click", () => {
            const allActive = Array.from(fieldTags).every((tag) => tag.classList.contains("active"));
            fieldTags.forEach((tag) => {
                const targetId = tag.getAttribute("data-target");
                const targetEl = document.getElementById(targetId);
                if (allActive) {
                    tag.classList.remove("active");
                    if (targetEl) targetEl.classList.add("is-hidden");
                } else {
                    tag.classList.add("active");
                    if (targetEl) targetEl.classList.remove("is-hidden");
                }
            });
            updateBlocksVisibility();
        });
    }

    function updateBlocksVisibility() {
        const hairColorEl = document.getElementById("field-hairColor");
        const hairStyleEl = document.getElementById("field-hairStyle");
        const hairColorHidden = hairColorEl ? hairColorEl.classList.contains("is-hidden") : true;
        const hairStyleHidden = hairStyleEl ? hairStyleEl.classList.contains("is-hidden") : true;
        const hairDivider = document.getElementById("hairDivider");
        const hairBlock = document.getElementById("hairBlock");

        if (hairBlock) {
            if (hairColorHidden && hairStyleHidden) {
                hairBlock.classList.add("is-hidden");
            } else {
                hairBlock.classList.remove("is-hidden");
                if (hairDivider) {
                    hairDivider.classList.toggle("is-hidden", hairColorHidden || hairStyleHidden);
                }
            }
        }

        const eyeColorEl = document.getElementById("field-eyeColor");
        const eyeShapeEl = document.getElementById("field-eyeShape");
        const eyeColorHidden = eyeColorEl ? eyeColorEl.classList.contains("is-hidden") : true;
        const eyeShapeHidden = eyeShapeEl ? eyeShapeEl.classList.contains("is-hidden") : true;
        const eyeDivider = document.getElementById("eyeDivider");
        const eyeBlock = document.getElementById("eyeBlock");

        if (eyeBlock) {
            if (eyeColorHidden && eyeShapeHidden) {
                eyeBlock.classList.add("is-hidden");
            } else {
                eyeBlock.classList.remove("is-hidden");
                if (eyeDivider) {
                    eyeDivider.classList.toggle("is-hidden", eyeColorHidden || eyeShapeHidden);
                }
            }
        }

        const appearanceRow = document.getElementById("appearanceRow");
        if (appearanceRow && hairBlock && eyeBlock) {
            if (hairBlock.classList.contains("is-hidden") && eyeBlock.classList.contains("is-hidden")) {
                appearanceRow.classList.add("is-hidden");
            } else {
                appearanceRow.classList.remove("is-hidden");
            }
        }
    }

    function generateProfile() {
        const mainColor = getRandomColor();
        const mainDot = document.getElementById("mainColorDot");
        const mainCode = document.getElementById("mainColorCode");
        if (mainDot) mainDot.style.backgroundColor = mainColor;
        if (mainCode) {
            mainCode.textContent = mainColor;
            mainCode.style.color = mainColor;
            mainCode.style.fontWeight = "600";
        }

        const selectedNameType = document.getElementById("nameTypeSelect")?.value || "all";
        const nameType = selectedNameType === "all" ? getRandomItem(["korean", "japanese", "western"]) : selectedNameType;
        let fullName = "";
        const nameData = characterData.names[nameType];

        if (nameType === "western") {
            const first = getRandomItem(nameData.first);
            const last = getRandomItem(nameData.last);
            if (options.middleName) {
                const middle = getRandomItem(nameData.middle);
                fullName = `${first} ${middle} ${last}`;
            } else {
                fullName = `${first} ${last}`;
            }
        } else if (nameType === "korean") {
            const last = getRandomItem(nameData.last);
            const first = getRandomItem(nameData.first);
            fullName = `${last}${first}`;
        } else {
            const last = getRandomItem(nameData.last);
            const first = getRandomItem(nameData.first);
            fullName = `${last} ${first}`;
        }
        setVal("val-name", fullName);

        // 나이 범위 계산
        const minAge = parseInt(document.getElementById("ageMin")?.value) || 15;
        const maxAge = parseInt(document.getElementById("ageMax")?.value) || 50;
        const calcAge = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;
        const isSpecialAge = Math.random() < 0.05;
        const ageVal = isSpecialAge && characterData.ageSpecial
            ? getRandomItem(characterData.ageSpecial)
            : `${calcAge}세`;

        // 키 범위 계산
        const minHeight = parseInt(document.getElementById("heightMin")?.value) || 150;
        const maxHeight = parseInt(document.getElementById("heightMax")?.value) || 195;
        const calcHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

        setVal("val-birthday", `${Math.floor(Math.random() * 12) + 1}월 ${Math.floor(Math.random() * 28) + 1}일`);
        setVal("val-gender", getRandomItem(characterData.gender));
        setVal("val-age", ageVal);
        setVal("val-nationality", getRandomItem(characterData.nationality));
        setVal("val-height", `${calcHeight}cm`);
        setVal("val-bodyType", getRandomItem(characterData.bodyType));
        setVal("val-job", getRandomItem(characterData.job));

        const hairColorSubItem = document.getElementById("field-hairColor");
        if (hairColorSubItem) {
            hairColorSubItem.innerHTML = "";
            hairColorSubItem.style.alignItems = "center";
            hairColorSubItem.style.gap = "6px";
            const hairToneCount = options.oddHair ? Math.floor(Math.random() * 2) + 1 : 1;
            const hairColors = [];

            const dotsSpan = document.createElement("span");
            dotsSpan.className = "dot-group";
            dotsSpan.style.display = "inline-flex";
            dotsSpan.style.gap = "3px";
            dotsSpan.style.alignItems = "center";

            for (let i = 0; i < hairToneCount; i++) {
                const c = getRandomColor();
                hairColors.push(c);

                const dot = document.createElement("span");
                dot.className = "dot";
                dot.style.backgroundColor = c;
                dot.style.display = "inline-block";
                dotsSpan.appendChild(dot);
            }

            const textSpan = document.createElement("span");
            textSpan.id = "val-hairColorText";
            textSpan.style.marginLeft = "5px";

            hairColors.forEach((hex, idx) => {
                const colorCodeSpan = document.createElement("span");
                colorCodeSpan.textContent = hex;
                colorCodeSpan.style.color = hex;
                colorCodeSpan.style.fontWeight = "600";
                textSpan.appendChild(colorCodeSpan);

                if (idx < hairColors.length - 1) {
                    const sep = document.createTextNode(" ");
                    textSpan.appendChild(sep);
                }
            });

            hairColorSubItem.appendChild(dotsSpan);
            hairColorSubItem.appendChild(textSpan);
        }

        setVal("val-hairStyle", getRandomItem(characterData.hairStyle));
        const eyeColorDots = document.getElementById("eyeColorDots");
        const valEyeColor = document.getElementById("val-eyeColor");

        if (eyeColorDots && valEyeColor) {
            eyeColorDots.innerHTML = "";
            valEyeColor.innerHTML = "";

            const eyeColorParent = eyeColorDots.parentElement;
            if (eyeColorParent) {
                eyeColorParent.style.display = "inline-flex";
                eyeColorParent.style.alignItems = "center";
                eyeColorParent.style.gap = "6px";
            }

            eyeColorDots.style.display = "inline-flex";
            eyeColorDots.style.gap = "3px";
            eyeColorDots.style.alignItems = "center";

            const eyeTypeRand = options.oddEye ? Math.random() : 0;

            if (eyeTypeRand > 0.65) {
                const mainEye = getRandomColor();
                const subEye = getRandomColor();

                const dot = document.createElement("span");
                dot.className = "dot";
                dot.style.background = `linear-gradient(135deg, ${mainEye} 50%, ${subEye} 50%)`;
                eyeColorDots.appendChild(dot);

                const c1Span = document.createElement("span");
                c1Span.textContent = mainEye;
                c1Span.style.color = mainEye;
                c1Span.style.fontWeight = "600";

                const c2Span = document.createElement("span");
                c2Span.textContent = subEye;
                c2Span.style.color = subEye;
                c2Span.style.fontWeight = "600";

                valEyeColor.appendChild(c1Span);
                valEyeColor.appendChild(document.createTextNode(" "));
                valEyeColor.appendChild(c2Span);
                valEyeColor.appendChild(document.createTextNode(" (파이아이)"));
            } else if (eyeTypeRand > 0.3) {
                const eye1 = getRandomColor();
                const eye2 = getRandomColor();

                const dot1 = document.createElement("span");
                dot1.className = "dot";
                dot1.style.backgroundColor = eye1;

                const dot2 = document.createElement("span");
                dot2.className = "dot";
                dot2.style.backgroundColor = eye2;

                eyeColorDots.appendChild(dot1);
                eyeColorDots.appendChild(dot2);

                const c1Span = document.createElement("span");
                c1Span.textContent = eye1;
                c1Span.style.color = eye1;
                c1Span.style.fontWeight = "600";

                const c2Span = document.createElement("span");
                c2Span.textContent = eye2;
                c2Span.style.color = eye2;
                c2Span.style.fontWeight = "600";

                valEyeColor.appendChild(c1Span);
                valEyeColor.appendChild(document.createTextNode(" "));
                valEyeColor.appendChild(c2Span);
                valEyeColor.appendChild(document.createTextNode(" (오드아이)"));
            } else {
                const eyeColor = getRandomColor();
                const dot = document.createElement("span");
                dot.className = "dot";
                dot.style.backgroundColor = eyeColor;
                eyeColorDots.appendChild(dot);

                const cSpan = document.createElement("span");
                cSpan.textContent = eyeColor;
                cSpan.style.color = eyeColor;
                cSpan.style.fontWeight = "600";
                valEyeColor.appendChild(cSpan);
            }
        }

        setVal("val-eyeShape", getRandomItem(characterData.eyeShape));

        const personalityList = getRandomItems(characterData.personalityKeywords, 3);
        setVal("val-personality", personalityList.join(", "));

        const honorific = getRandomItem(characterData.speechHonorific);
        const tone = getRandomItem(characterData.speechTone);
        setVal("val-speechSet", `${honorific}, ${tone}`);

        setVal("val-alignment", getRandomItem(characterData.alignment));
        setVal("val-values", getRandomItem(characterData.values));
        setVal("val-firstImpression", getRandomItem(characterData.firstImpression));
        setVal("val-wealth", getRandomItem(characterData.wealth));
        setVal("val-reputation", getRandomItem(characterData.reputation));
        const hobbyList = getRandomItems(characterData.hobby, 2);
        setVal("val-hobby", hobbyList.join(", "));

        const specialtyList = getRandomItems(characterData.specialty, 2);
        setVal("val-specialty", specialtyList.join(", "));

        const likes = getRandomItems(characterData.likesAndDislikes, 3);
        let dislikes = getRandomItems(characterData.likesAndDislikes, 3);
        while (dislikes.some((item) => likes.includes(item))) {
            dislikes = getRandomItems(characterData.likesAndDislikes, 3);
        }
        setVal("val-likes", likes.join(", "));
        setVal("val-dislikes", dislikes.join(", "));

        setVal("val-scent", getRandomItem(characterData.scent));
        setVal("val-weakness", getRandomItem(characterData.weakness));
        setVal("val-habit", getRandomItem(characterData.habit));
        setVal("val-fear", getRandomItem(characterData.fear));

        const animal = getRandomItem(characterData.symbolAnimal);
        const plant = getRandomItem(characterData.symbolPlant);
        setVal("val-symbolSet", `${animal} / ${plant}`);

        const belongingsList = getRandomItems(characterData.belongings, 3);
        setVal("val-belongings", belongingsList.join(", "));

        setVal("val-secret", getRandomItem(characterData.secret));
        setVal("val-family", getRandomItem(characterData.family));

        const etcList = getRandomItems(characterData.etc, 3);
        setVal("val-etc", etcList.join("\n"));
    }

    function setVal(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    if (generateBtn) generateBtn.addEventListener("click", generateProfile);

    if (copyBtn) {
        copyBtn.addEventListener("click", () => {
            let textToCopy = "";

            const mainColorCode = document.getElementById("mainColorCode")?.textContent || "";
            textToCopy += `대표 색상: ${mainColorCode}\n`;

            const name = document.getElementById("val-name")?.textContent || "";
            textToCopy += `이름: ${name}\n\n`;

            const basicMetaBar = document.querySelectorAll(".basic-meta-bar .meta-unit");
            basicMetaBar.forEach((unit) => {
                if (!unit.classList.contains("is-hidden")) {
                    const val = unit.querySelector(".val")?.textContent || "";
                    let lbl = "";
                    if (unit.id === "field-birthday") lbl = "생일";
                    else if (unit.id === "field-gender") lbl = "성별";
                    else if (unit.id === "field-age") lbl = "나이";
                    else if (unit.id === "field-nationality") lbl = "국적";
                    else if (unit.id === "field-height") lbl = "신장";
                    else if (unit.id === "field-bodyType") lbl = "체형";
                    else if (unit.id === "field-job") lbl = "직업";

                    textToCopy += `${lbl}: ${val}\n`;
                }
            });
            textToCopy += "\n";

            const hairColorEl = document.getElementById("field-hairColor");
            const hairStyleEl = document.getElementById("field-hairStyle");
            const hairColorHidden = hairColorEl ? hairColorEl.classList.contains("is-hidden") : true;
            const hairStyleHidden = hairStyleEl ? hairStyleEl.classList.contains("is-hidden") : true;

            if (!hairColorHidden || !hairStyleHidden) {
                textToCopy += "헤어: ";
                if (!hairColorHidden) {
                    const hairColorText = document.getElementById("val-hairColorText")?.textContent || "";
                    textToCopy += hairColorText;
                }
                if (!hairColorHidden && !hairStyleHidden) textToCopy += " ";
                if (!hairStyleHidden) textToCopy += document.getElementById("val-hairStyle")?.textContent || "";
                textToCopy += "\n";
            }

            const eyeColorEl = document.getElementById("field-eyeColor");
            const eyeShapeEl = document.getElementById("field-eyeShape");
            const eyeColorHidden = eyeColorEl ? eyeColorEl.classList.contains("is-hidden") : true;
            const eyeShapeHidden = eyeShapeEl ? eyeShapeEl.classList.contains("is-hidden") : true;

            if (!eyeColorHidden || !eyeShapeHidden) {
                textToCopy += "눈동자: ";
                if (!eyeColorHidden) textToCopy += document.getElementById("val-eyeColor")?.textContent || "";
                if (!eyeColorHidden && !eyeShapeHidden) textToCopy += " ";
                if (!eyeShapeHidden) textToCopy += document.getElementById("val-eyeShape")?.textContent || "";
                textToCopy += "\n";
            }

            const personalityBlock = document.getElementById("field-personality");
            if (personalityBlock && !personalityBlock.classList.contains("is-hidden")) {
                textToCopy += `성격 키워드: ${document.getElementById("val-personality")?.textContent || ""}\n`;
            }
            textToCopy += "\n";

            const detailItems = document.querySelectorAll(".details-grid-2col .detail-item");
            detailItems.forEach((item) => {
                if (!item.classList.contains("is-hidden")) {
                    const lbl = item.querySelector(".lbl")?.textContent.replace("― ", "") || "";
                    const val = item.querySelector(".val")?.textContent || "";
                    textToCopy += `${lbl}: ${val}\n`;
                }
            });

            const etcBlock = document.getElementById("field-etc");
            if (etcBlock && !etcBlock.classList.contains("is-hidden")) {
                textToCopy += `\n특이사항:\n${document.getElementById("val-etc")?.textContent || ""}\n`;
            }

            navigator.clipboard.writeText(textToCopy.trim()).then(() => {
                if (toast) {
                    toast.classList.add("show");
                    setTimeout(() => toast.classList.remove("show"), 2000);
                }
            });
        });
    }

    generateProfile();
});
