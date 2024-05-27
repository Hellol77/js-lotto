import lottoHandler from "../handler/lotto";
import lottoGameHandler from "../handler/lottoGame";
import { $, $$ } from "../utils/querySelector";
import { onModalShow } from "./ModalController";

export default class LottoController {
  #lottos;
  #lottoGame;
  #purchasePrice;

  constructor() {
    this.#lottos;
    this.#lottoGame;
    this.#purchasePrice;
  }

  init() {
    this.initLotto();
    this.initLottosToggle();
    this.initLottoGameResult();
    this.initResetButton();
  }

  initLotto() {
    $("#purchase_price_form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.lottoHandler();
    });
  }

  lottoHandler() {
    try {
      lottoHandler.validatePurchasePrice($("#purchase_price_input").value);
      this.#purchasePrice = $("#purchase_price_input").value;
      this.#lottos = lottoHandler.generateLottos(this.#purchasePrice);
      lottoHandler.outputLottosResult(this.#lottos);

      if ($("#lottos_toggle_button").checked === false) {
        $("#lotto_result_box").classList.add("d-none");
      }
      $("#result_button").disabled = false;
    } catch (e) {
      alert(e.message);
    }
  }

  initLottosToggle() {
    $("#lottos_toggle_button").addEventListener("click", () => {
      $("#lotto_result_box").classList.toggle("d-none");
    });
  }

  initLottoGameResult() {
    $("#result_form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.lottoGameHandler();
    });
  }

  lottoGameHandler() {
    try {
      const winningNumberArray = [...$$(".winning-number")].map((input) => Number(input.value));
      const bonusNumber = Number($(".bonus-number").value);
      lottoGameHandler.validateWinningNumbers(winningNumberArray);
      lottoGameHandler.validateBonusNumber(winningNumberArray, bonusNumber);
      const { result, totalIncome } = lottoGameHandler.getLottoGameResult(
        this.#lottos,
        winningNumberArray,
        bonusNumber,
      );
      lottoGameHandler.outputLottoGameResult(result);
      lottoGameHandler.outputRateOfReturn(totalIncome, this.#purchasePrice);
      onModalShow();
    } catch (e) {
      alert(e.message);
    }
  }

  initResetButton() {
    $("#reset_button").addEventListener("click", () => {
      location.reload();
    });
  }
}
