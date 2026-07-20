let gameState = {
    level: 1,
    xp: 0,
    maxXp: 100, // 기본 레벨 1 목표 경험치
    coins: 100, // 👈 기본 지급 코인 수 (원하는 숫자로 변경 가능)
    equipped: { hat: "none", acc: "none", bg: "none" },
    inventory: ["hat_party", "acc_ribbon"], 
    currentShopTab: "bg",
    usageSeconds: 463, 
    alertThresholdMinutes: 30, 
    targetFocusMinutes: 10,
    timerInterval: null,
    isTimerRunning: false,
    isTimerPaused: false,
    remainingSeconds: 600,
    attendance: {
        streak: 1,
        monthlyCount: 1,
        checkedToday: true,
        checkedDays: [20] 
    },
    missions: [
        { id: 1, title: "아침 기상 후 물 한 잔 마시기 💧", completed: false },
        { id: 2, title: "스마트폰 내려두고 스트레칭 🧘", completed: false }
    ]
};

// --- ✨ 레벨업 전용 보상 테이블 (특정 레벨 달성 시 지급) ---
const levelRewards = {
    2: { id: "hat_crown", name: "왕관", icon: "👑", type: "hat" },
    3: { id: "bg_galaxy", name: "우주 속으로", icon: "🌌", type: "bg", color: "#0b0c10" },
    4: { id: "acc_monocle", name: "기사의 혜안", icon: "🧐", type: "acc" },
    5: { id: "bg_palace", name: "황금 궁전", icon: "🏰", type: "bg", color: "#f4d03f" }
};

// --- 일반 착용 아이템 DB ---
const wearableItems = [
    { id: "hat_party", name: "꼬마 고깔모자", icon: "🎪", type: "hat" },
    { id: "acc_ribbon", name: "빨간 나비리본", icon: "🎀", type: "acc" },
    { id: "hat_flower", name: "노란 꽃모자", icon: "👒", type: "hat" },
    { id: "acc_necklace", name: "진주 목걸이", icon: "📿", type: "acc" },
    { id: "dec_lamp", name: "감성 스탠드", icon: "💡", type: "acc" },
    { id: "dec_book", name: "마음의 양식", icon: "📚", type: "acc" },
    { id: "dec_pencil", name: "행운의 연필", icon: "✏️", type: "acc" },
    { id: "acc_glasses", name: "지적인 안경", icon: "👓", type: "acc" },
    { id: "hat_ribbon", name: "핑크 리본모자", icon: "👒", type: "hat" },
    { id: "acc_bowtie", name: "하늘색 보우타이", icon: "👔", type: "acc" },
    // 레벨업 보상 아이템
    levelRewards[2],
    levelRewards[4]
];

// --- 배경 아이템 DB ---
const backgroundItems = [
    { id: "bg_default", name: "감성 크림색 (기본)", icon: "", type: "bg", color: "#f7f3e9" },
    { id: "bg_ocean", name: "바닷속 세계", icon: "🐠", type: "bg", color: "#1e3c72" },
    { id: "bg_sparkle_forest", name: "반짝이는 숲", icon: "✨", type: "bg", color: "#1b4332" },
    { id: "bg_night", name: "별빛 밤하늘", icon: "🌙", type: "bg", color: "#2c3e50" },
    { id: "bg_rainbow", name: "무지개 동산", icon: "🌈", type: "bg", color: "#e8f5e9" },
    { id: "bg_sky", name: "푸른 하늘", icon: "☁️", type: "bg", color: "#a2dff7" },
    { id: "bg_mint", name: "산뜻한 민트", icon: "", type: "bg", color: "#e0f2f1" },
    { id: "bg_sakura", name: "벚꽃 핑크", icon: "", type: "bg", color: "#fce4ec" },
    { id: "bg_sunset", name: "노을 주황", icon: "", type: "bg", color: "#ffcc80" },
    { id: "bg_forest", name: "싱그러운 초록", icon: "", type: "bg", color: "#c8e6c9" },
    { id: "bg_peach", name: "달콤 복숭아", icon: "", type: "bg", color: "#ffe0b2" },
    { id: "bg_lavender", name: "은은한 보라", icon: "", type: "bg", color: "#e1bee7" },
    // 레벨업 보상 배경
    levelRewards[3],
    levelRewards[5]
];

const allItems = [...wearableItems, ...backgroundItems];

// --- 코인숍 판매 목록 ---
const shopItems = {
    bg: [
        { id: "bg_ocean", name: "바닷속 세계", icon: "🐠", price: 300, type: "bg", color: "#1e3c72" },
        { id: "bg_sparkle_forest", name: "반짝이는 숲", icon: "✨", price: 300, type: "bg", color: "#1b4332" },
        { id: "bg_sky", name: "푸른 하늘", icon: "☁️", price: 150, type: "bg", color: "#a2dff7" },
        { id: "bg_night", name: "별빛 밤하늘", icon: "🌙", price: 200, type: "bg", color: "#2c3e50" },
        { id: "bg_rainbow", name: "무지개 동산", icon: "🌈", price: 250, type: "bg", color: "#e8f5e9" },
        { id: "bg_mint", name: "산뜻한 민트", icon: "", price: 100, type: "bg", color: "#e0f2f1" },
        { id: "bg_sakura", name: "벚꽃 핑크", icon: "", price: 100, type: "bg", color: "#fce4ec" },
        { id: "bg_sunset", name: "노을 주황", icon: "", price: 120, type: "bg", color: "#ffcc80" },
        { id: "bg_forest", name: "싱그러운 초록", icon: "", price: 120, type: "bg", color: "#c8e6c9" },
        { id: "bg_peach", name: "달콤 복숭아", icon: "", price: 130, type: "bg", color: "#ffe0b2" },
        { id: "bg_lavender", name: "은은한 보라", icon: "", price: 140, type: "bg", color: "#e1bee7" }
    ],
    acc: [
        { id: "hat_flower", name: "노란 꽃모자", icon: "👒", price: 180, type: "hat" },
        { id: "acc_necklace", name: "진주 목걸이", icon: "📿", price: 220, type: "acc" },
        { id: "dec_lamp", name: "감성 스탠드", icon: "💡", price: 150, type: "acc" },
        { id: "dec_book", name: "마음의 양식", icon: "📚", price: 100, type: "acc" },
        { id: "dec_pencil", name: "행운의 연필", icon: "✏️", price: 80, type: "acc" },
        { id: "acc_glasses", name: "지적인 안경", icon: "👓", price: 140, type: "acc" },
        { id: "hat_ribbon", name: "핑크 리본모자", icon: "👒", price: 180, type: "hat" },
        { id: "acc_bowtie", name: "하늘색 보우타이", icon: "👔", price: 120, type: "acc" }
    ]
};

window.onload = function() {
    startUsageTracking();
    updateAllUI();
    renderAttendance();
};

// ✨ 새로 추가된 레벨 보상 안내 버튼 클릭 함수
function showLevelRewardsInfo() {
    let msg = "🎁 [레벨업 한정 보상 안내] 🎁\n\n";
    Object.keys(levelRewards).forEach(lvl => {
        const reward = levelRewards[lvl];
        msg += `• Lv.${lvl}: ${reward.icon} ${reward.name}\n`;
    });
    msg += "\n* 레벨 달성 시 50 코인과 함께 보상 아이템이 보관함에 자동으로 지급됩니다!";
    alert(msg);
}

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.action-btn').forEach(b => b.classList.remove('active'));
    
    const targetScreen = document.getElementById('screen-' + id);
    if (targetScreen) targetScreen.classList.add('active');

    const activeNavBtn = document.querySelector(`.nav-${id}`);
    if (activeNavBtn) activeNavBtn.classList.add('active');

    if (id === 'decor') renderInventory();
    if (id === 'shop') renderShop();
    if (id === 'attendance') renderAttendance();
}

// ✨ 레벨업 시 코인 + 레벨업 전용 아이템 보상 지급
function gainXP(amount) {
    gameState.xp += amount;
    
    while (gameState.xp >= gameState.maxXp) {
        gameState.xp -= gameState.maxXp;
        gameState.level++;
        
        // 레벨업할 때마다 요구 경험치 1.5배 증가
        gameState.maxXp = Math.round(gameState.maxXp * 1.5);
        
        // 기본 보상 코인
        let rewardCoin = 50;
        gameState.coins += rewardCoin;
        
        let rewardMsg = `🎉 축하합니다! Lv.${gameState.level}로 레벨업했습니다!\n\n🎁 기본 보상: 🪙 ${rewardCoin} 코인`;

        // ✨ 해당 레벨 전용 보상 아이템 확인 및 지급
        const specialReward = levelRewards[gameState.level];
        if (specialReward) {
            if (!gameState.inventory.includes(specialReward.id)) {
                gameState.inventory.push(specialReward.id);
            }
            rewardMsg += `\n🌟 한정 보상: [${specialReward.name}] 획득! (보관함 확인)`;
        }

        rewardMsg += `\n\n(다음 레벨 필요 경험치: ${gameState.maxXp} XP)`;
        alert(rewardMsg);
    }
    updateAllUI();
}

function updateAllUI() {
    document.getElementById('level-display').innerText = `Lv.${gameState.level}`;
    document.getElementById('coin-display').innerText = `🪙 ${gameState.coins}`;
    
    const xpPercent = Math.min(100, Math.floor((gameState.xp / gameState.maxXp) * 100));
    const xpBar = document.getElementById('xp-bar');
    if (xpBar) xpBar.style.width = `${xpPercent}%`;

    const hat = allItems.find(i => i.id === gameState.equipped.hat);
    const acc = allItems.find(i => i.id === gameState.equipped.acc);
    const bg = backgroundItems.find(i => i.id === gameState.equipped.bg);

    document.getElementById('wear-hat').innerText = hat ? hat.icon : "";
    document.getElementById('wear-acc').innerText = acc ? acc.icon : "";
    
    const room = document.getElementById('room');
    const bgLayer = document.getElementById('room-bg-layer');
    
    if (bg) {
        room.style.backgroundColor = bg.color;
        bgLayer.innerText = bg.icon || "";
    } else {
        room.style.backgroundColor = "#f7f3e9";
        bgLayer.innerText = "";
    }

    const equippedHatText = hat ? hat.name : '';
    const equippedAccText = acc ? acc.name : '';
    const equippedText = [equippedHatText, equippedAccText].filter(Boolean).join(', ');

    document.getElementById('equipped-banner').innerText = equippedText ? `👗 착용: ${equippedText}` : "기본 상태";

    renderMissions();
    updateUsageDisplay();
}

function renderMissions() {
    const list = document.getElementById('mission-list');
    const countDisplay = document.getElementById('mission-count');
    if (!list) return;

    list.innerHTML = "";
    const completedCount = gameState.missions.filter(m => m.completed).length;
    if (countDisplay) countDisplay.innerText = `${completedCount}/${gameState.missions.length} 완료`;

    gameState.missions.forEach((m) => {
        const div = document.createElement('div');
        div.className = "mission-item";
        div.innerHTML = `
            <span class="mission-text" style="${m.completed ? 'text-decoration: line-through; opacity: 0.5;' : ''}">${m.title}</span>
            <div>
                <button class="claim-btn ${m.completed ? 'done' : ''}" onclick="claimMission(${m.id})">${m.completed ? '✓' : ''}</button>
                <button class="delete-btn" onclick="deleteMission(${m.id})">✕</button>
            </div>
        `;
        list.appendChild(div);
    });
}

function claimMission(id) {
    const mission = gameState.missions.find(m => m.id === id);
    if (mission && !mission.completed) {
        mission.completed = true;
        gameState.coins += 20;
        gainXP(40);
    }
}

function addCustomMission() {
    const input = document.getElementById('custom-mission-input');
    const title = input.value.trim();

    if (!title) {
        alert("미션 내용을 입력해 주세요!");
        return;
    }

    gameState.missions.push({ id: Date.now(), title: title, completed: false });
    input.value = "";
    updateAllUI();
}

function deleteMission(id) {
    gameState.missions = gameState.missions.filter(m => m.id !== id);
    updateAllUI();
}

function adjustTargetTime(min) {
    if (gameState.isTimerRunning || gameState.isTimerPaused) return;
    gameState.targetFocusMinutes = Math.max(1, gameState.targetFocusMinutes + min);
    document.getElementById('target-time-display').innerText = gameState.targetFocusMinutes + "분";
    gameState.remainingSeconds = gameState.targetFocusMinutes * 60;
    updateTimerDisplay(gameState.remainingSeconds);
}

function updateTimerDisplay(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    document.getElementById('timer').innerText = `00:${m}:${s}`;
}

function handleMainTimerBtn() {
    if (!gameState.isTimerRunning && !gameState.isTimerPaused) {
        gameState.remainingSeconds = gameState.targetFocusMinutes * 60;
        startTimer();
    } else if (gameState.isTimerRunning) {
        pauseTimer();
    } else if (gameState.isTimerPaused) {
        startTimer();
    }
}

function startTimer() {
    gameState.isTimerRunning = true;
    gameState.isTimerPaused = false;

    document.getElementById('timer-main-btn').innerText = "잠시 멈추기 ⏸️";
    document.getElementById('timer-stop-btn').style.display = "inline-block";
    document.getElementById('timer-setup').style.opacity = "0.5";
    document.getElementById('timer-setup').style.pointerEvents = "none";

    clearInterval(gameState.timerInterval);
    gameState.timerInterval = setInterval(() => {
        gameState.remainingSeconds--;
        updateTimerDisplay(gameState.remainingSeconds);

        if (gameState.remainingSeconds <= 0) {
            clearInterval(gameState.timerInterval);
            finishTimer();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(gameState.timerInterval);
    gameState.isTimerRunning = false;
    gameState.isTimerPaused = true;

    document.getElementById('timer-main-btn').innerText = "이어서 시작 ▶️";
}

function resetTimer() {
    clearInterval(gameState.timerInterval);
    gameState.isTimerRunning = false;
    gameState.isTimerPaused = false;
    gameState.remainingSeconds = gameState.targetFocusMinutes * 60;

    updateTimerDisplay(gameState.remainingSeconds);

    document.getElementById('timer-main-btn').innerText = "집중 시작하기 ✨";
    document.getElementById('timer-stop-btn').style.display = "none";
    document.getElementById('timer-setup').style.opacity = "1";
    document.getElementById('timer-setup').style.pointerEvents = "auto";
}

function finishTimer() {
    resetTimer();
    gameState.coins += 30;
    gainXP(50);
}

function renderInventory() {
    const grid = document.getElementById('inventory-grid');
    if (!grid) return;
    grid.innerHTML = "";

    const baseItems = [backgroundItems.find(i => i.id === 'bg_default')];
    const userOwnedItems = [...baseItems, ...gameState.inventory.map(itemId => allItems.find(i => i.id === itemId)).filter(Boolean)];

    if (userOwnedItems.length === 0) {
        grid.innerHTML = `<div style="grid-column: span 3; text-align: center; color: #aaa; font-size: 0.8rem; padding: 20px 0;">보관함이 비어있습니다.<br>상점에서 아이템을 구매해보세요!</div>`;
        return;
    }

    userOwnedItems.forEach(item => {
        const isEquipped = gameState.equipped[item.type] === item.id;
        const div = document.createElement('div');
        div.className = "item-card";
        div.innerHTML = `
            <div class="item-icon" ${item.type === 'bg' ? `style="background-color:${item.color}; border-radius:50%; width: 36px; height: 36px; line-height: 36px; margin: 4px 0; border: 2px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1); display: flex; justify-content: center; align-items: center;"` : ""}>
                ${item.icon || ""}
            </div>
            <div class="item-name">${item.name}</div>
            <button class="item-btn ${isEquipped ? 'equipped' : ''}" onclick="toggleEquip('${item.id}')">
                ${isEquipped ? '해제' : '장착'}
            </button>
        `;
        grid.appendChild(div);
    });
}

function toggleEquip(itemId) {
    if (itemId === 'bg_default') {
        gameState.equipped['bg'] = "none";
        updateAllUI();
        renderInventory();
        return;
    }

    const item = allItems.find(i => i.id === itemId);
    if (!item) return;

    if (gameState.equipped[item.type] === item.id) {
        gameState.equipped[item.type] = "none";
    } else {
        gameState.equipped[item.type] = item.id;
    }
    updateAllUI();
    renderInventory();
}

function switchShopTab(tab) {
    gameState.currentShopTab = tab;
    document.getElementById('tab-bg').classList.toggle('active', tab === 'bg');
    document.getElementById('tab-acc').classList.toggle('active', tab === 'acc');
    renderShop();
}

function renderShop() {
    const grid = document.getElementById('shop-grid');
    if (!grid) return;
    grid.innerHTML = "";

    const items = shopItems[gameState.currentShopTab] || [];
    items.forEach(item => {
        const isBought = gameState.inventory.includes(item.id);
        const div = document.createElement('div');
        div.className = "item-card";
        div.innerHTML = `
            <div class="item-icon" ${item.type === 'bg' ? `style="background-color:${item.color}; border-radius:50%; width: 36px; height: 36px; line-height: 36px; margin: 4px 0; border: 2px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1); display: flex; justify-content: center; align-items: center;"` : ""}>
                ${item.icon || ""}
            </div>
            <div class="item-name">${item.name}</div>
            <button class="item-btn" onclick="buyItem('${item.id}', ${item.price})" ${isBought ? 'disabled style="background:#ccc"' : ''}>
                ${isBought ? '구매완료' : item.price + '코인'}
            </button>
        `;
        grid.appendChild(div);
    });
}

function buyItem(id, price) {
    if (gameState.coins < price) {
        alert("코인이 부족합니다!");
        return;
    }
    gameState.coins -= price;
    gameState.inventory.push(id);
    alert("🛍️ 아이템을 구매했습니다! 보관함에서 착용해보세요.");
    updateAllUI();
    renderShop();
}

function renderAttendance() {
    document.getElementById('streak-days').innerText = gameState.attendance.streak;
    document.getElementById('monthly-count').innerText = gameState.attendance.monthlyCount;

    const calendar = document.getElementById('calendar');
    if (!calendar) return;
    calendar.innerHTML = "";

    for (let day = 1; day <= 30; day++) {
        const div = document.createElement('div');
        div.className = "day-cell";
        
        if (day === 20) div.classList.add('today'); 
        if (gameState.attendance.checkedDays.includes(day)) {
            div.classList.add('checked');
        }

        div.innerText = day;
        calendar.appendChild(div);
    }
}

function startUsageTracking() {
    setInterval(() => {
        gameState.usageSeconds++;
        updateUsageDisplay();
    }, 1000);
}

function updateUsageDisplay() {
    const h = Math.floor(gameState.usageSeconds / 3600);
    const m = Math.floor((gameState.usageSeconds % 3600) / 60);
    const s = gameState.usageSeconds % 60;

    const text = document.getElementById('usage-time-display');
    if (text) text.innerText = `${h}시간 ${m}분 ${s}초`;

    const targetSec = gameState.alertThresholdMinutes * 60;
    const percent = Math.min(100, Math.floor((gameState.usageSeconds / targetSec) * 100));

    const circle = document.getElementById('usage-circle');
    const progressBar = document.getElementById('usage-progress-bar');
    
    if (circle) circle.innerText = `${percent}%`;
    if (progressBar) progressBar.style.width = `${percent}%`;
}

function setAlertThreshold(minutes) {
    gameState.alertThresholdMinutes = minutes;
    
    document.querySelectorAll('.alert-option-btn').forEach(btn => btn.classList.remove('active'));
    const targetBtn = document.getElementById(`alert-btn-${minutes}`);
    if (targetBtn) targetBtn.classList.add('active');

    updateUsageDisplay();
}
// 레벨 보상 안내 팝업 함수
function showLevelRewardsInfo() {
    let msg = "🎁 [레벨업 한정 보상 안내] 🎁\n\n";
    Object.keys(levelRewards).forEach(lvl => {
        const reward = levelRewards[lvl];
        msg += `• Lv.${lvl}: ${reward.icon} ${reward.name}\n`;
    });
    msg += "\n* 레벨 달성 시 50 코인과 함께 보상 아이템이 보관함에 자동으로 지급됩니다!";
    alert(msg);
}
