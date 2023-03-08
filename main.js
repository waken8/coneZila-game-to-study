const cardFiled = document.querySelector(".card-filed");

let cards = [];
const cardColors = ["pink", "purple", "red", "blue", "lightgreen", "yellow"];

function gameInit() {}

function setCards(shuffled) {
  const minCardNumber = 2;
  const maxCardNumber = 49;

  for (let i = minCardNumber; i <= maxCardNumber; i++) {
    cards.push(i);
  }

  if (shuffled) {
    cards = shuffle(cards);
  }

  cards.map((number) => createCard(number));
}

function createCard(number) {
  const cardOuter = document.createElement("div");
  cardOuter.classList.add("card-outer");

  const card = document.createElement("div");
  card.classList.add("card");

  // カードの数を識別する
  card.number = number;

  card.addEventListener("click", cardFlip);

  const inner = document.createElement("div");
  inner.classList.add("inner");

  const color = shuffle(cardColors)[0];
  card.color = color;

  const front = document.createElement("div");
  front.classList.add("front");
  front.style.background = color;

  const back = document.createElement("div");
  back.classList.add("back");
  back.style.background = color;
  back.textContent = number;

  cardOuter.append(card);
  inner.append(front);
  inner.append(back);
  card.append(inner);
  cardFiled.append(cardOuter);
}

const a = {
  name: "A",
  id: 0,
  numbers: [1],
  player: true,
};

const b = {
  name: "B",
  id: 1,
  numbers: [1],
  player: false,
};

const c = {
  name: "C",
  id: 2,
  numbers: [1],
  player: false,
};

const users = [a, b, c];
let currenUserIndex = 0;
let currentUser = users[currenUserIndex];

let currentCardColor;

function changeUser() {
  currenUserIndex++;
  currentUser = users[currenUserIndex];

  if (currenUserIndex === users.length) {
    currenUserIndex = 0;
    currentUser = users[currenUserIndex];
  }

  setCurretnUserIcon();
}

function setCurretnUserIcon() {
  const userIcons = document.querySelectorAll(".playing-icon");
  Array.from(userIcons).map((icon) => {
    if (icon.userId !== currenUserIndex) {
      icon.textContent = "";
      return;
    }

    icon.textContent = "▶︎▶︎▶︎";
  });
}

const userFiled = document.querySelector(".user-filed");
function setUsers() {
  users.map((user) => createUserStates(user));
}

function createUserStates(user) {
  const { id, name } = user;

  const userStates = document.createElement("div");
  userStates.classList.add("user-states");

  const icon = document.createElement("div");
  icon.classList.add("playing-icon");

  // 識別用のユーザーid
  icon.userId = id;

  if (id === 0) {
    icon.textContent = "▶︎▶︎▶︎";
  }

  const userName = document.createElement("div");
  userName.textContent = `プレイヤー: ${name}`;
  userName.classList.add("user-name");

  const cardContainer = document.createElement("div");
  cardContainer.classList.add("user-cards");

  const userCard = document.createElement("div");
  userCard.textContent = 1;
  userCard.classList.add("user-card");

  cardContainer.append(userCard);
  userStates.append(icon);
  userStates.append(userName);
  userStates.append(cardContainer);
  userFiled.append(userStates);
}

// 引数にtrueを渡した場合、カードをシャッフル
setCards(true);
setUsers();

let isFliping = false;
function cardFlip(e) {
  if (isFliping) return;
  isFliping = true;

  const isPlayer = e.isTrusted;

  const cardInner = e.target.parentElement;
  cardInner.classList.add("selecting");

  const card = e.target.parentElement.parentElement;
  const cardNumber = card.number;

  // ユーザーの変更
  // プレイヤー以外の場合、自動操作
  const next = () => {
    changeUser();
    isFliping = false;

    if (!currentUser.player) playCPU();
  };

  setTimeout(() => {
    if (!checkCardNumber(cardNumber)) {
      cardInner.classList.remove("selecting");
      setTimeout(next, 800);
      return;
    }

    if (isPlayer) {
      cardFlipByPlayer(cardInner, cardNumber, card);
    } else {
      currentCardColor = card.color;
      card.remove();
      currentUser.numbers.push(cardNumber);
      setUserNumberCard(cardNumber);
    }

    if (checkUserWin()) {
      return;
    }

    next();
  }, 700);
}

function cardFlipByPlayer(cardInner, cardNumber, card) {
  const askSelect = confirm("このカードにしますか?");

  if (askSelect) {
    currentCardColor = card.color;
    card.remove();
    currentUser.numbers.push(cardNumber);
    setUserNumberCard(cardNumber);
  } else {
    cardInner.classList.remove("selecting");
  }
}

function getGreatestNumber(user) {
  const numbers = user.numbers;
  const greatestNumber = numbers[numbers.length - 1];
  return greatestNumber;
}

function checkCardNumber(cardNumber) {
  if (cardNumber > getGreatestNumber(currentUser)) {
    return true;
  }

  return false;
}

function setUserNumberCard(cardNumber) {
  const userCard = document.createElement("div");
  userCard.textContent = cardNumber;
  userCard.classList.add("user-card");
  userCard.style.background = currentCardColor;

  const userStates = document.querySelectorAll(".user-states")[currentUser.id];
  userStates.append(userCard);
}

// CPUにプレイさせる
function playCPU() {
  const deley = 1200;

  setTimeout(() => {
    const cards = document.querySelectorAll(".front");
    const target = shuffle(cards)[0];
    target.click();
  }, deley);
}

function checkUserWin() {
  if (currentUser.numbers.length === 10) {
    alert(`${currentUser.name}の勝利`);
  }
}

function shuffle([...array]) {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
