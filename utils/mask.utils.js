

// export const inputMask = (positionStart, mask, arrSymbols, elem, hover = false) => {
// 	const input = elem;
// 	const lengthMask = mask.length;
// 	const numberPlaceholderArr = mask.split('');
// 	let valueArrMask = mask.split('');
// 	let valueUser = '';
// 	let indexValue = positionStart;
// 	let cursorPosition = positionStart;
// 	let inputFocus = false;

// 	input.addEventListener('focus', handleFocus);
// 	input.addEventListener('blur', handleBlur);
// 	input.addEventListener('keydown', handleKeydown);
// 	input.addEventListener('click', handleClick);


// 	if (hover) {
// 		input.addEventListener('mouseenter', handleMouseEnter);
// 		input.addEventListener('mouseleave', handleMouseLeave);
// 	}


// 	// Функция для удаления всех слушателей
// 	function removeAllListeners() {
// 		input.removeEventListener('focus', handleFocus);
// 		input.removeEventListener('blur', handleBlur);
// 		input.removeEventListener('keydown', handleKeydown);
// 		input.removeEventListener('click', handleClick);


// 		if (hover) {
// 			input.removeEventListener('mouseenter', handleMouseEnter); // Если у вас есть обработчики для hover
// 			input.removeEventListener('mouseleave', handleMouseLeave); // Если у вас есть обработчики для hover
// 		}
// 	};


// 	function handleMouseEnter(e) {
// 		if (!valueUser.length) {
// 			e.target.value = mask;
// 		}
// 	}

// 	function handleMouseLeave(e) {
// 		if (!valueUser.length && !inputFocus) {
// 			e.target.value = '';
// 		}
// 	}

// 	function handleFocus(e) {
// 		inputFocus = true;
// 		if (!valueUser.length) {
// 			e.target.value = mask;
// 			setCursorPosition(input, positionStart)
// 		}
// 	}

// 	function handleBlur(e) {
// 		inputFocus = false;
// 		if (!valueUser.length) {
// 			e.target.value = '';
// 		}
// 	}

// 	function handleKeydown(e) {
// 		e.preventDefault()
// 		console.log(e);
// 		const key = e.key;
// 		if (key === 'Tab') return;
// 		if (key === 'Delete' && cursorPosition < indexValue) {
// 			if (cursorPosition < positionStart) {
// 				cursorPosition = positionStart;
// 				setCursorPosition(e.target, cursorPosition);
// 				return;
// 			}
// 			if (arrSymbols.includes(valueArrMask[indexValue - 1]) || valueArrMask[indexValue - 1] === ' ') {
// 				indexValue = decrementIndexValue(indexValue);
// 			}

// 			indexValue = decrementIndexValue(indexValue);
// 			valueArrMask = deleteNumberPhone(valueArrMask, indexValue, numberPlaceholderArr);
// 			valueUser = deleteLastCharacter(valueUser);
// 			e.target.value = valueArrMask.join('');
// 			setCursorPosition(e.target, cursorPosition);
// 			return;
// 		}



// 		if (key === 'ArrowRight') {
// 			cursorPosition < lengthMask && cursorPosition++;
// 			setCursorPosition(e.target, cursorPosition);
// 		} if (key === 'ArrowLeft') {
// 			cursorPosition > 0 && cursorPosition--;
// 			setCursorPosition(e.target, cursorPosition);
// 		}

// 		if (key === 'Backspace' && indexValue > positionStart) {

// 			if (arrSymbols.includes(valueArrMask[indexValue - 1]) || valueArrMask[indexValue - 1] === ' ') {
// 				indexValue = decrementIndexValue(indexValue);
// 				indexValue = decrementIndexValue(indexValue);
// 				valueArrMask = backspaceNumberPhone(valueArrMask, indexValue, numberPlaceholderArr);
// 				cursorPosition = indexValue;
// 				setTimeout(() => {
// 					e.target.value = valueArrMask.join('');
// 					setCursorPosition(e.target, cursorPosition);
// 				}, 0);


// 				valueUser = deleteLastCharacter(valueUser);
// 				return;
// 			}
// 			indexValue = decrementIndexValue(indexValue);
// 			cursorPosition = indexValue;
// 			valueArrMask = backspaceNumberPhone(valueArrMask, indexValue, numberPlaceholderArr);
// 			valueUser = deleteLastCharacter(valueUser, numberPlaceholderArr);
// 			e.target.value = valueArrMask.join('');
// 			setCursorPosition(e.target, cursorPosition);
// 			return;
// 		}

// 		if (indexValue === lengthMask) {
// 			return;
// 		}
// 		if (e.code === 'Backspace' && e.target.selectionStart < positionStart) {
// 			e.preventDefault();
// 			setCursorPosition(e.target, positionStart)
// 		}
// 		if (key >= '0' && key <= '9') {
// 			if (arrSymbols.includes(valueArrMask[indexValue]) || valueArrMask[indexValue] === ' ') {
// 				indexValue = incrementIndex(indexValue);
// 			}
// 			valueUser += e.key;
// 			valueArrMask[indexValue] = e.key;
// 			indexValue = incrementIndex(indexValue);
// 			cursorPosition = indexValue;
// 			e.target.value = valueArrMask.join('');
// 			setCursorPosition(e.target, cursorPosition);
// 		}
// 	}

// 	function handleClick(e) {
// 		console.log(e);
// 		if (e.target.selectionStart < positionStart || !valueUser) {
// 			setCursorPosition(e.target, positionStart);
// 			cursorPosition = e.target.selectionStart;
// 			return
// 		}
// 		cursorPosition = e.target.selectionStart;
// 	}

// 	function backspaceNumberPhone(arr, cursorPosition, numberPlaceholderArr) {
// 		let maskArr = arr;
// 		let arrUserData = maskArr.map((v, i, arr) => {
// 			if (i === cursorPosition) {
// 				arr[i] = numberPlaceholderArr[i];
// 				return arr[i];
// 			}
// 			return v;
// 		})
// 		return arrUserData;
// 	}
// 	function deleteNumberPhone(arr, cursorPosition, numberPlaceholderArr) {
// 		let maskArr = arr;
// 		let arrUserData = maskArr.map((v, i, arr) => {
// 			if (i >= cursorPosition && arr[i] !== ' ' && !arrSymbols.includes(arr[i])) {
// 				return arr[i] = numberPlaceholderArr[i];;
// 			}
// 			return v;
// 		})
// 		return arrUserData;
// 	}
// 	function setCursorPosition(inputElement, cursorPosition) {
// 		inputElement.selectionStart = inputElement.selectionEnd = cursorPosition;
// 	}
// 	function decrementIndexValue(index) {
// 		return index - 1;
// 	}
// 	function incrementIndex(index) {
// 		return index + 1;
// 	}
// 	function deleteLastCharacter(str) {
// 		return str.slice(0, -1);
// 	}

// 	return removeAllListeners;
// }




export class InputMask {
  inputFocus = false;
  arrValueInputAndMask = "";
  cursorPosition = 0;
	
  constructor(startPosition, maskString, symbolsArrNotReplace, elem) {
    this.positionStart = startPosition;
    this.mask = maskString;
    this.arrNotReplaceSymbols = symbolsArrNotReplace;
    this.input = elem;
  }

  initMask() {
    this.cursorPosition = this.positionStart;
    this.arrValueInputAndMask = this.mask.split("");
    this.input.addEventListener("focus", this.handleFocus);
    this.input.addEventListener("blur", this.handleBlur);
    this.input.addEventListener("input", this.handleInput);
    this.input.addEventListener("click", this.handleClick);
  }

  handleFocus = () => {
    this.inputFocus = true;
    if (!this.input.value) {
      this.input.value = this.mask;
      this.setCursorPosition(this.positionStart);
      return;
    }
    this.setCursorPosition(this.cursorPosition);
  };
  handleBlur = () => {
    this.inputFocus = false;
    if (this.input.value === this.mask) {
      this.input.value = "";
    }
  };

  handleClick = () => {
    if (this.input.value === this.mask) {
      this.setCursorPosition(this.positionStart);
      return;
    }
    this.setCursorPosition(
      Math.max(this.positionStart, this.input.selectionEnd)
    );
  };

  handleInput = (e) => {
    const typeInput = e.inputType;

    // удаление значений input
    if (
      typeInput === "deleteContentBackward" ||
      typeInput === "deleteContentForward"
    ) {
      
      this.cursorPosition = this.input.selectionEnd;

      // логика пропуска не заменяемых символов маски
      if (
        this.arrNotReplaceSymbols.includes(
          this.arrValueInputAndMask[this.cursorPosition]
        ) ||
        this.arrValueInputAndMask[this.cursorPosition] === " "
      ) {
        if (typeInput !== "deleteContentForward") {
          this.cursorPosition--;
        }
      }

      // логика возврата курсора, если ушел за positionStart
      if (this.cursorPosition < this.positionStart) {
        this.updateInputValue();
        this.setCursorPosition(this.positionStart);
        return;
      }

      // замена символов маски
      this.arrValueInputAndMask[this.cursorPosition] =
        this.mask[this.cursorPosition];
      this.updateInputValue();
      this.setCursorPosition(this.cursorPosition);
      return;
    }

    // ОСТАНОВКА ЗАПОЛНЕНИЯ МАСКИ-
    if (this.input.selectionEnd > this.arrValueInputAndMask.length) {
      this.updateInputValue();
      return;
    }

    const inputValue = e.data ? +e.data : "не число";

    // логика возврата курсора при вводе до positionStart
    if (this.input.selectionEnd - 1 < this.positionStart) {
      this.updateInputValue();
      this.setCursorPosition(this.positionStart);
      return;
    }

    // ПРОВЕРКА НА ЧИСЛО
    if (isNaN(inputValue)) {
      this.updateInputValue();
      this.setCursorPosition(Math.max(this.positionStart, this.cursorPosition));
      return;
    }

    //  ВВОД ЧИСЕЛ

    if (inputValue >= 0 && inputValue <= 9) {
      this.cursorPosition = this.input.selectionEnd;
      this.replaceMaskSymbolOnInput(inputValue);
    }
  };
  updateInputValue() {
    this.input.value = this.arrValueInputAndMask.join("");
  }

  setCursorPosition = (position) => {
    this.input.selectionStart = position;
    this.input.selectionEnd = position;
  };

  replaceMaskSymbolOnInput(value) {
    // если курсор перепрыгивает символ
    if (
      this.arrNotReplaceSymbols.includes(
        this.arrValueInputAndMask[this.cursorPosition - 1]
      ) ||
      this.arrValueInputAndMask[this.cursorPosition - 1] === " "
    ) {
      this.arrValueInputAndMask[this.cursorPosition] = value;
      this.updateInputValue();
      this.cursorPosition++;
      this.setCursorPosition(this.cursorPosition);
    } else {
      // если курсор не перепрыгивает символ
      this.arrValueInputAndMask[this.cursorPosition - 1] = value;
      this.updateInputValue();
      this.setCursorPosition(this.cursorPosition);
    }
  }

  removeMaskListeners() {
    this.input.removeEventListener("focus", this.handleFocus);
    this.input.removeEventListener("blur", this.handleBlur);
    this.input.removeEventListener("input", this.handleInput);
    this.input.removeEventListener("click", this.handleClick);
  }
}


