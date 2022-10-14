const properties = [
	'direction',
	'boxSizing',
	'width',
	'height',
	'overflowX',
	'overflowY',

	'borderTopWidth',
	'borderRightWidth',
	'borderBottomWidth',
	'borderLeftWidth',
	'borderStyle',

	'paddingTop',
	'paddingRight',
	'paddingBottom',
	'paddingLeft',

	'fontStyle',
	'fontVariant',
	'fontWeight',
	'fontStretch',
	'fontSize',
	'fontSizeAdjust',
	'lineHeight',
	'fontFamily',

	'textAlign',
	'textTransform',
	'textIndent',
	'textDecoration',

	'letterSpacing',
	'wordSpacing',

	'tabSize',
	'MozTabSize',
]

const isFirefox = typeof window !== 'undefined' && window['mozInnerScreenX'] != null

/**
 * Hàm lấy ra vị trí hiện tại của con trỏ text so với box text
 * @param {HTMLTextAreaElement} element
 * @param {number} position
 */
function getCaretCoordinates(element, position) {
	const div = document.createElement('div') //Tạo một thẻ div
	document.body.appendChild(div) //Áp nó vào dom


	const style = div.style 
	const computed = getComputedStyle(element) // Lấy ra style của box text

	style.whiteSpace = 'pre-wrap'
	style.wordWrap = 'break-word'
	style.position = 'absolute'
	style.visibility = 'hidden'

	properties.forEach(prop => {
		style[prop] = computed[prop]
	})

	if (isFirefox) {
		if (element.scrollHeight > parseInt(computed.height))
			style.overflowY = 'scroll'
	} else {
		style.overflow = 'hidden'
	}


	div.textContent = element.value.substring(0, position)

	const span = document.createElement('span') //tạo thẻ span
	span.textContent = element.value.substring(position) || '.' // set cho thẻ span này có text là kí tự cuối cùng 
	div.appendChild(span) // áp vào dom

	const coordinates = {
		top: span.offsetTop + parseInt(computed['borderTopWidth']),
		left: span.offsetLeft + parseInt(computed['borderLeftWidth']),
		// height: parseInt(computed['lineHeight'])
		height: span.offsetHeight
	}

  console.log("stop")
	div.remove()

	return coordinates
}

class Mentionify {
  constructor(ref, menuRef, resolveFn, replaceFn, menuItemFn, positionSupplemental) {
    this.ref = ref
    this.menuRef = menuRef
    this.resolveFn = resolveFn
    this.replaceFn = replaceFn
    this.menuItemFn = menuItemFn
    this.positionSupplemental = positionSupplemental
    this.options = []

    
    this.makeOptions = this.makeOptions.bind(this)
    this.closeMenu = this.closeMenu.bind(this)
    this.selectItem = this.selectItem.bind(this)
    this.onInput = this.onInput.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.renderMenu = this.renderMenu.bind(this)
    
    this.ref.addEventListener('input', this.onInput)
    this.ref.addEventListener('keydown', this.onKeyDown)

  }
  
  async makeOptions(query) {
    const options = await this.resolveFn(query)
    if (options.lenght !== 0) {
      this.options = options
      this.renderMenu()
    } else {
      this.closeMenu()
    }
  }
  
  closeMenu() {
    setTimeout(() => {
      this.options = []
      this.left = undefined
      this.top = undefined
      this.triggerIdx = undefined
      this.renderMenu()
    }, 0)
  }
  
  selectItem(active) {
    return () => {
      const preMention = this.ref.value.substr(0, this.triggerIdx)
      const option = this.options[active]
      const mention = this.replaceFn(option, this.ref.value[this.triggerIdx])
      const postMention = this.ref.value.substr(this.ref.selectionStart)
      const newValue = `${preMention}${mention}${postMention}`
      this.ref.value = newValue

      const caretPosition = this.ref.value.length - postMention.length
      this.ref.setSelectionRange(caretPosition, caretPosition)
      this.closeMenu()
      this.ref.focus()
    }
  }
  
  onInput() {
    const positionIndex = this.ref.selectionStart //Vị trí hiện tại của con trỏ text so với khi box text chưa có gì
    let textBeforeCaret = ""

    if(this.ref.value) {
        textBeforeCaret = this.ref.value.slice(0, positionIndex) //Text sau khi nhập thêm
    }
    const tokens = textBeforeCaret.split(/\s/) //Lấy ra tất cả các từ có trong box text
    const lastToken = tokens[tokens.length - 1] //Lấy ra từ cuối cùng trong box text
    const triggerIdx = textBeforeCaret.endsWith(lastToken) //Vị trí bắt đầu của từ cuối cùng trong box text 
      ? textBeforeCaret.length - lastToken.length
      : -1
    const maybeTrigger = textBeforeCaret[triggerIdx] //Kí tự đầu tiên của từ cuối cùng trong box text
    const keystrokeTriggered = maybeTrigger === '#' //Biến kiểm tra xem kí tự đầu tiên của từ cuối cùng có phải @ không
    
    // console.log(`
    //     positionIndex: ${positionIndex},
    //     textBeforeCaret: ${textBeforeCaret},
    //     tokens: ${tokens},
    //     lastToken: ${lastToken},
    //     triggerIdx: ${triggerIdx},
    //     maybeTrigger: ${maybeTrigger},
    //     keystrokeTriggered: ${keystrokeTriggered}
    // `)

    //Nếu kí tự đầu tiên của từ cuối cùng trong box text không phải @ thì đóng box select
    if (!keystrokeTriggered) {
      this.closeMenu()
      return
    }
    
    const query = textBeforeCaret.slice(triggerIdx + 1) //Nếu từ đầu tiền của box text là @ thì lấy ra tất cả các kí tự sau nó

  
    this.makeOptions(query) //Đưa ra các lựa chọn phù hợp
    
    //Lấy ra vị trí hiện tại của con trỏ text so với box text
    // (top, left, chiều cao của con trỏ text)
    const coords = getCaretCoordinates(this.ref, positionIndex) 
    
    //Lấy ra vị trí hiện tại của box text so với trình duyệt
    const { top, left } = this.ref.getBoundingClientRect()

    
    setTimeout(() => {
      this.active = 0
      this.left = window.scrollX  + coords.left + left + this.ref.scrollLeft + this.positionSupplemental.left
      this.top = window.scrollY +  coords.top + top + coords.height - this.ref.scrollTop + this.positionSupplemental.top
      this.triggerIdx = triggerIdx
      this.renderMenu()
    }, 0)

    // console.log(`
    //   this.left: ${this.left},
    //   this.top: ${this.top}
    // `)
  }
  
  onKeyDown(ev) {
    let keyCaught = false
    if (this.triggerIdx !== undefined) {
      switch (ev.key) {
        case 'ArrowDown':
          this.active = Math.min(this.active + 1, this.options.length - 1)
          this.renderMenu()
          keyCaught = true
          break
        case 'ArrowUp':
          this.active = Math.max(this.active - 1, 0)
          this.renderMenu()
          keyCaught = true
          break
        case 'Enter':
        case 'Tab':
          this.selectItem(this.active)()
          keyCaught = true
          break
      }
    }
    
    if (keyCaught) {
      ev.preventDefault()
    }
  }
  
  renderMenu() {  
    if (this.top === undefined) {
      this.menuRef.hidden = true
      return
    }
    
    this.menuRef.style.left = this.left + 'px'
    this.menuRef.style.top = this.top + 'px'
    this.menuRef.innerHTML = ''
    
    this.options.forEach((option, idx) => {
      this.menuRef.appendChild(this.menuItemFn(
        option,
        this.selectItem(idx),
        this.active === idx))
    })
    
    this.menuRef.hidden = false
  }
}

// const users = [
//   { username: 'john_doe' },
//   { username: 'jane_doe' },
// ]

// const resolveFn = prefix => prefix === ''
//   ? users
//   : users.filter(user => user.username.startsWith(prefix))

// const replaceFn = (user, trigger) => `${trigger}${user.username} `

// const menuItemFn = (user, setItem, selected) => {
//   const div = document.createElement('div')
//   div.setAttribute('role', 'option')
//   div.className = 'menu-item'
//   if (selected) {
//     div.classList.add('selected')
//     div.setAttribute('aria-selected', '')
//   }
//   div.textContent = user.username
//   div.onclick = setItem
//   return div
// }

// new Mentionify(
//   document.getElementById('textarea'),
//   document.getElementById('menu'),
//   resolveFn,
//   replaceFn,
//   menuItemFn
// )

export default Mentionify