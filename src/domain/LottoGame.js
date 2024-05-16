import { LOTTO_GAME } from "../constants/LottoGame";
import { LOTTO } from "../constants/lotto";
import { WINNINGS } from "../constants/message";
import { initMap } from "../utils/initMap";

export class LottoGame {
  #lottos;
  #winningNumberArray;
  #bonusNumber;
  #result;

  constructor(lottos, winningNumberArray, bonusNumber) {
    this.#lottos = lottos;
    this.#winningNumberArray = winningNumberArray;
    this.#bonusNumber = bonusNumber;
    this.#result = initMap(LOTTO_GAME.MAX_RANK);
    this.#checkLottos();
  }

  #checkUnitLotto(lotto) {
    const checkResult = lotto.filter((number) => this.#winningNumberArray.includes(number)).length;

    return this.#convertCheckResultToRank(lotto, checkResult);
  }

  #convertCheckResultToRank = (lotto, checkResult) => {
    const resultMapping = {
      [LOTTO.NUMBERS_COUNT - 3]: 5,
      [LOTTO.NUMBERS_COUNT - 2]: 4,
      [LOTTO.NUMBERS_COUNT - 1]: lotto.includes(this.#bonusNumber) ? 2 : 3,
      [LOTTO.NUMBERS_COUNT]: 1,
    };

    return resultMapping[checkResult] || LOTTO.NUMBERS_COUNT;
  };

  #setResult(key, value) {
    this.#result.set(key, value);
  }

  #checkLottos() {
    this.#lottos.forEach((lotto) => {
      if (this.#checkUnitLotto(lotto) === LOTTO.NUMBERS_COUNT) return;
      this.#setResult(this.#checkUnitLotto(lotto), this.#result.get(this.#checkUnitLotto(lotto)) + 1);
    });
  }

  get result() {
    return this.#result;
  }

  get totalIncome() {
    const prizes = [WINNINGS.FIRST, WINNINGS.SECOND, WINNINGS.THIRD, WINNINGS.FOURTH, WINNINGS.FIFTH];

    return prizes.reduce((total, prize, index) => total + this.#result.get(index + 1) * prize, 0);
  }
}