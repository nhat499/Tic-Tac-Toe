/*
 * Name: Nhat Trang
 * Date: may 6, 2020
 * Section: CSE 154 Ai
 *
 * This is the JS to implement the events of a game, tic tac toe.
 * This game is play with 2 player on the same system. players can
 * now change their representive icon to a pokemon
 */

"use strict";
(function() {
  let count = 0;
  let imgX = "img/x.png";
  let imgO = "img/o.png";
  const BASE_URL = "https://pokeapi.co/api/v2/";

  window.addEventListener("load", init);

  /** This function contain the affect for clicking reset and blank images */
  function init() {
    addBlank();
    let reset = qs("button");
    reset.addEventListener("click", resetGame);
    let div = qsa("div");
    for (let i = 0; i < div.length; i++) {
      div[i].addEventListener("click", changeBlank);
      div[i].addEventListener("click", win);
    }
    let submitBtnX = id("submit-x");
    let submitBtnO = id("submit-o");
    submitBtnX.addEventListener("click", makeRequestX);
    submitBtnO.addEventListener("click", makeRequestO);
  }

  /** This function make a requestion to the poke api for its data for player X */
  function makeRequestX() {
    let url = BASE_URL + variableX();
    fetch(url)
      .then(checkStatus)
      .then(resp => resp.json())
      .then(processData)
      .catch(handleErrorX);
  }

  /** This function make a requestion to the poke api for its data for player O */
  function makeRequestO() {
    let url = BASE_URL + variableO();
    fetch(url)
      .then(checkStatus)
      .then(resp => resp.json())
      .then(processData2)
      .catch(handleErrorO);
  }

  /**
   * This takes the user inputed number for team X
   * and return it
   * @return {string} return a string of number
   */
  function variableX() {
    let inputX = id("new-x");
    let pokeNum = inputX.value;
    return "pokemon/" + pokeNum;
  }

  /**
   * This takes the user inputed number for team O
   * and return it
   * @return {string} return a string of number
   */
  function variableO() {
    let inputO = id("new-o");
    let pokeNum = inputO.value;
    return "pokemon/" + pokeNum;
  }

  /**
   * This function get the pokemon img for team O
   * @param {JSON} responseData is a JSON file of pokemon
   */
  function processData2(responseData) {
    let allO = qsa(".o");
    for (let i = 0; i < allO.length; i++) {
      allO[i].src = responseData.sprites.front_default;
    }
    imgO = responseData.sprites.front_default;
  }

  /**
   * This function get the pokemon img for team X
   * @param {JSON} responseData is a JSON file of pokemon
   */
  function processData(responseData) {
    let allX = qsa(".x");
    for (let i = 0; i < allX.length; i++) {
      allX[i].src = responseData.sprites.front_default;
    }
    imgX = responseData.sprites.front_default;
  }

  /**
   * This function the status of the response
   * @param {Promise} response check if the promise is reslove and
   * @return {Promise} return the response
   */
  function checkStatus(response) {
    if (response.ok) {
      return response;
    } else {
      throw Error("Error in request: " + response.statusText);
    }
  }

  /**
   * This function lets the player knows that there is an error changing the O img,
   * and what they can do to fix it.
   */
  function handleErrorO() {
    let body = qs("body");
    let solution = gen("p");
    solution.textContent = "please pick a number between 1 and 802 for O";
    body.appendChild(solution);
  }

  /**
   * This function lets the player knows that there is an error changing the X img,
   * and what they can do to fix it.
   */
  function handleErrorX() {
    let body = qs("body");
    let solution = gen("p");
    solution.textContent = "please pick a number between 1 and 802 for X";
    body.appendChild(solution);
  }

  /** This function add a blank image to each tic tac toe box */
  function addBlank() {
    let main = document.body.children[1];
    let section = main.children[1];
    for (let i = 0; i < section.children.length; i++) {
      let blank = gen("img");
      blank.src = "img/blank.png";
      blank.alt = "blank";
      blank.classList.add("blank");
      let div = section.children[i];
      div.appendChild(blank);
    }
  }

  /** This function change the blank image to x or o image */
  function changeBlank() {
    let blank = this.firstElementChild;
    let containBlank = blank.classList.contains("blank");
    if (count % 2 === 0 && containBlank) {
      let xImage = document.createElement("img");
      xImage.alt = "x";
      xImage.classList.add("xImg");
      xImage.src = imgX;
      this.replaceChild(xImage, blank);
      qs(".o").classList.remove('hidden');
      qs(".x").classList.add('hidden');
      count++;
    } else if (count % 2 !== 0 && containBlank) {
      let oImage = document.createElement("img");
      oImage.alt = "o";
      oImage.classList.add("oImg");
      oImage.src = imgO;
      this.replaceChild(oImage, blank);
      qs(".x").classList.remove("hidden");
      qs(".o").classList.add("hidden");
      count++;
    }
    blank.classList.remove("blank");
  }

  /** This function removes the error message */
  function removeErrorMessage() {
    let body = qs("body");
    let errorMessage = qsa("body > p");
    for (let i = 0; i < errorMessage.length; i++) {
      body.removeChild(errorMessage[i]);
    }
  }

  /** This function reset the game */
  function resetGame() {
    if (winConditionO() || winConditionX()) {
      let wins = qs(".win");
      wins.classList.remove("win");
      count = 0;
      let winMes = id("win message");
      winMes.remove();
      let winner = id("winner");
      winner.remove();
      let div = qsa("div");
      for (let i = 0; i < div.length; i++) {
        div[i].classList.remove("hidden");
      }
    }
    let img = qsa("div > img");
    for (let i = 0; i < img.length; i++) {
      img[i].remove();
    }
    addBlank();
    removeErrorMessage();
    qs(".x").classList.remove("hidden");
    if (!qs(".o").classList.contains("hidden")) {
      qs(".o").classList.add("hidden");
    }
  }

  /**
   * This specify the winning condition for team X
   * @return {boolean} return true if X has won
   */
  function winConditionX() {
    let main = qs("main");
    let section = main.children[1];
    let topleft = section.children[0].children[0].classList.contains("xImg");
    let topmiddle = section.children[1].children[0].classList.contains("xImg");
    let topright = section.children[2].children[0].classList.contains("xImg");
    let middleleft = section.children[3].children[0].classList.contains("xImg");
    let middlemiddle = section.children[4].children[0].classList.contains("xImg");
    let middleright = section.children[5].children[0].classList.contains("xImg");
    let bottomleft = section.children[6].children[0].classList.contains("xImg");
    let bottommiddle = section.children[7].children[0].classList.contains("xImg");
    let bottomright = section.children[8].children[0].classList.contains("xImg");
    if (topleft && topmiddle && topright || middleleft && middlemiddle && middleright ||
      bottomleft && bottommiddle && bottomright || topleft && middleleft && bottomleft ||
      middlemiddle && topmiddle && bottommiddle || topright && middleright && bottomright ||
      topleft && middlemiddle && bottomright || topright && middlemiddle && bottomleft) {
      return true;
    }
  }

  /**
   * This specify the winning condition for team O
   * @return {boolean} return true if O has won
   */
  function winConditionO() {
    let main = qs("main");
    let section = main.children[1];
    let topleft = section.children[0].children[0].classList.contains("oImg");
    let topmiddle = section.children[1].children[0].classList.contains("oImg");
    let topright = section.children[2].children[0].classList.contains("oImg");
    let middleleft = section.children[3].children[0].classList.contains("oImg");
    let middlemiddle = section.children[4].children[0].classList.contains("oImg");
    let middleright = section.children[5].children[0].classList.contains("oImg");
    let bottomleft = section.children[6].children[0].classList.contains("oImg");
    let bottommiddle = section.children[7].children[0].classList.contains("oImg");
    let bottomright = section.children[8].children[0].classList.contains("oImg");
    if (topleft && topmiddle && topright || middleleft && middlemiddle && middleright ||
      bottomleft && bottommiddle && bottomright || topleft && middleleft && bottomleft ||
      middlemiddle && topmiddle && bottommiddle || topright && middleright && bottomright ||
      topleft && middlemiddle && bottomright || topright && middlemiddle && bottomleft) {
      return true;
    }
  }

  /** This function let the play knows who has won */
  function win() {
    if (winConditionO() || winConditionX()) {
      let section = qsa("section");
      let winner = gen("img");
      let winMes = gen("p");
      winMes.id = "win message";
      winMes.textContent = "WINNER!!";
      winner.id = "winner";
      let div = qsa("div");
      section[1].classList.add("win");
      section[1].appendChild(winner);
      section[1].appendChild(winMes);
      for (let i = 0; i < div.length; i++) {
        div[i].classList.add("hidden");
      }
      if (winConditionX()) {
        winner.src = imgX;
      } else {
        winner.src = imgO;
      }
    }
  }

  /**
   * This is a helper function to get an element from the html file
   * @param {string} select - the string of an html element
   * @return {element} return the html element
   */
  function qs(select) {
    return document.querySelector(select);
  }

  /**
   * This is a helper function to get all matched element from the html file
   * @param {string} select - the string of an html element
   * @return {element} return the an array of mathed html element
   */
  function qsa(select) {
    return document.querySelectorAll(select);
  }

  /**
   * This is a helper function to get matched id from the html file
   * @param {string} select - the string of an html element
   * @return {element} return the mathed html element
   */
  function id(select) {
    return document.getElementById(select);
  }

  /**
   * This is a helper function create a new html element
   * @param {string} tagName - the string of an html element
   * @return {element} return the html element
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }
})();

