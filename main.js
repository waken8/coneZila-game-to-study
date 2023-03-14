let cardFiled;
let userFiled;

let users;
let currenUserIndex = 0;
let currentUser;

let win;

const numberOfUserButtons = document.querySelectorAll(".user-number-button");
numberOfUserButtons[0].numberOfUser = 2;
numberOfUserButtons[1].numberOfUser = 3;
numberOfUserButtons[2].numberOfUser = 4;

numberOfUserButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    createUsers(e);
    gameInit();
  });
});

function gameInit() {
  document.querySelector(".select-user-number-filed").remove();

  cardFiled = document.querySelector(".card-filed");
  userFiled = document.querySelector(".user-filed");

  // 引数にtrueを渡した場合、カードをシャッフル
  setCards(true);
  setUsers();

  currentUser = users[currenUserIndex];

  // プレイヤーをランダムに決める
  // 残りはCPU
  const randomUser = shuffle(users)[0];
  randomUser.player = true;

  const mainUserStates =
    document.querySelectorAll(".user-states")[randomUser.id];

  const mainUserText = document.createElement("div");
  mainUserText.textContent = "あなた";

  mainUserStates.before(mainUserText);

  if (!users[0].player) {
    playCPU();
  }
}

function createUsers(e) {
  const numberOfUser = e.target.numberOfUser;
  let names = ["A", "B"];

  if (numberOfUser === 3) names.push("C");
  if (numberOfUser === 4) {
    names.push("C");
    names.push("D");
  }

  users = names.map((name, index) => {
    const user = {};

    user.name = name;
    user.id = index;
    user.numbers = [1];
    user.player = false;

    return user;
  });
}

let cards = [];
const cardColors = [
  "#FFC7AF",
  "#FFBEDA",
  "#DCC2FF",
  "#BAD3FF",
  "#EDFFBE",
  "#DEB887",
  "#F5DEB3",
];

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

// ユーザーの変更
// プレイヤー以外の場合、自動操作

function next() {
  if (checkUserWin()) {
    return;
  }

  changeUser();
  isFliping = false;

  if (!currentUser.player) playCPU();
}

let isFliping = false;
function cardFlip(e) {
  if (isFliping) return;
  isFliping = true;

  const isPlayer = e.isTrusted;

  const cardInner = e.target.parentElement;
  cardInner.classList.add("selecting");

  const card = e.target.parentElement.parentElement;
  const cardNumber = card.number;

  setTimeout(() => {
    if (!checkCardNumber(cardNumber)) {
      cardInner.classList.remove("selecting");
      setTimeout(next, 800);
      return;
    }

    if (isPlayer) {
      cardFlipByPlayer(cardInner, cardNumber, card);
    } else {
      cardFlipByCpu(card, cardInner, cardNumber);
    }
  }, 700);
}

function cardCheckSucsess(card, cardNumber) {
  currentCardColor = card.color;
  card.remove();
  currentUser.numbers.push(cardNumber);
  setUserNumberCard(cardNumber);
}

function cardFlipByPlayer(cardInner, cardNumber, card) {
  const askSelect = confirm("このカードにしますか?");

  if (askSelect) {
    cardCheckSucsess(card, cardNumber);
    next();
  } else {
    cardInner.classList.remove("selecting");
    setTimeout(next, 800);
  }
}

function cardFlipByCpu(card, cardInner, cardNumber) {
  if (currentUser.numbers.length === 9) {
    cardCheckSucsess(card, cardNumber);
    return;
  }

  const limitUpperNumber = getGreatestNumber(currentUser) + 10;

  if (cardNumber < limitUpperNumber) {
    cardCheckSucsess(card, cardNumber);
    next();
  } else {
    cardInner.classList.remove("selecting");
    setTimeout(next, 800);
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
  if (win) return;
  const deley = 1200;

  setTimeout(() => {
    const cards = document.querySelectorAll(".front");
    const target = shuffle(cards)[0];
    target.click();
  }, deley);
}

function checkUserWin() {
  if (currentUser.numbers.length === 7) {
    win = true;
    alert(`${currentUser.name}の勝利`);
    location.reload();
  }
}

function shuffle([...array]) {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
