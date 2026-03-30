// ФУНКЦИЯ С КООРДИНАТАМИ

const coordsText = document.querySelector('#coords-value')
document.addEventListener('mousemove', function (event) {
  let cursorX = event.clientX
  let cursorY = event.clientY
  if (coordsText) {
    // подключение координат
    coordsText.textContent = `X:${cursorX} Y:${cursorY}`
  }
})

// ПРОГРЕСС-БАР

// поиск чекбоксов
const checkboxes = document.querySelectorAll('.task-check')
// поиск прогресс-бара
const progressBarLine = document.querySelector('.progressBarLine')
const progressText = document.querySelector('.progressBarNumber')

function updateProgress() {
  // поиск отмеченных чекбоксов
  const checkedCheckboxes = document.querySelectorAll('.task-check:checked')
  // счет процентов
  const percent = Math.round(
    (checkedCheckboxes.length / checkboxes.length) * 100,
  )
  progressBarLine.style.opacity = '1'
  progressBarLine.style.width = percent + '%'
  progressText.textContent = percent + '%'
}

// реакция чекбоксов на клики
checkboxes.forEach(function (checkbox) {
  checkbox.addEventListener('change', updateProgress)
})

// СКАНЕР
const scanButton = document.querySelector('.scan')
const scannerBoxes = document.querySelectorAll('.scanner-box')
const scanAreas = document.querySelectorAll('.dragonfly, .plant')

let isScannerActive = false

// включение/выключение
scanButton.addEventListener('click', () => {
  isScannerActive = !isScannerActive
  scanButton.style.backgroundColor = isScannerActive ? '#c0ff95' : ''

  if (!isScannerActive) {
    scannerBoxes.forEach((box) => {
      box.style.display = 'none'
    })
  }
})
scanAreas.forEach((area) => {
  const box = area.querySelector('.scanner-box')

  area.addEventListener('mousemove', (event) => {
    if (isScannerActive && box) {
      const rect = area.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      box.style.left = `${x}px`
      box.style.top = `${y}px`
      box.style.display = 'block'
    }
  })

  area.addEventListener('mouseleave', () => {
    if (box) box.style.display = 'none'
  })
})

// ПЕЧАТНАЯ МАШИНКА

function typeText(element) {
  const fullText = element.dataset.originalText
  element.innerHTML = ''

  let index = 0

  function startTyping() {
    let typing = setInterval(() => {
      let char = fullText[index]

      if (char === '\n') {
        element.innerHTML += '<br>'
      } else if (char === ' ') {
        element.innerHTML += '&nbsp;'
      } else {
        element.innerHTML += char
      }
      index++
      if (index === fullText.length) {
        clearInterval(typing)
      }
    }, 120)
  }

  startTyping()
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        typeText(entry.target)
        observer.unobserve(entry.target)
      }
    })
  },
  {
    threshold: 0.2,
  },
)

const allHeaders = document.querySelectorAll('h1')
const footerElement = document.querySelector('footer')

allHeaders.forEach(function (header) {
  header.dataset.originalText = header.innerText
  header.innerHTML = ''
  observer.observe(header)
})

if (footerElement) {
  footerElement.dataset.originalText = footerElement.innerText
  footerElement.innerHTML = ''
  observer.observe(footerElement)
}

// ИНТЕРАКТИВНАЯ КАРТА

const mapPoints = document.querySelectorAll('.point') // все метки
const mapOverlay = document.getElementById('mapOverlay') // оверлей
const modalCloseBtn = document.getElementById('modalClose') // крестик
const modalSelectBtn = document.getElementById('modalSelect') // кнопка ВЫБРАТЬ
const modalNotif = document.getElementById('modalNotif') // текст уведомления

let currentSelectedPoint = null

mapPoints.forEach(function (point) {
  point.addEventListener('click', function () {
    currentSelectedPoint = point
    modalNotif.textContent = ''
    mapOverlay.classList.add('active')
  })
})

modalSelectBtn.addEventListener('click', function () {
  if (!currentSelectedPoint) return

  if (currentSelectedPoint.dataset.correct === 'true') {
    modalNotif.textContent = 'Верно! Здесь Лилия сможет расти.'
    modalNotif.style.color = '#5cb85c'
  } else {
    modalNotif.textContent = 'Не подходит. Попробуй еще раз.'
    modalNotif.style.color = '#ff6400'
  }
})

modalCloseBtn.addEventListener('click', function () {
  mapOverlay.classList.remove('active')
  currentSelectedPoint = null
})

mapOverlay.addEventListener('click', function (event) {
  if (event.target === mapOverlay) {
    mapOverlay.classList.remove('active')
    currentSelectedPoint = null
  }
})

// РАНДОМНЫЕ ЧИСЛА

const btnTest = document.getElementById('btn-test')
const countDisplay = document.getElementById('mutation-count')

const btnRisk = document.getElementById('btn-risk')
const riskDisplay = document.getElementById('mutation-risk')

let testInterval
let isTesting = false

let riskInterval
let isCalculating = false

// расчет количества мутаций
btnTest.addEventListener('click', () => {
  if (!isTesting) {
    //
    testInterval = setInterval(() => {
      countDisplay.textContent = Math.floor(Math.random() * 99)
    }, 50)

    btnTest.textContent = 'ОСТАНОВИТЬ'
    btnTest.style.backgroundColor = '#ffdfcb'
    isTesting = true
  } else {
    // остановка таймера
    clearInterval(testInterval)
    btnTest.textContent = 'ТЕСТ'
    btnTest.style.backgroundColor = '#c0ff95'
    isTesting = false
  }
})

// расчет процента риска
btnRisk.addEventListener('click', () => {
  if (!isCalculating) {
    riskInterval = setInterval(() => {
      riskDisplay.textContent = Math.floor(Math.random() * 99)
    }, 50)

    btnRisk.textContent = 'ОСТАНОВИТЬ'
    btnRisk.style.backgroundColor = '#ffdfcb'
    isCalculating = true
  } else {
    clearInterval(riskInterval)
    btnRisk.textContent = 'РАССЧИТАТЬ'
    btnRisk.style.backgroundColor = '#c0ff95'
    isCalculating = false
  }
})

//КОНСОЛЬ

const consoleInput = document.querySelector('.console-input')
const warningWrapper = document.querySelector('.console-warnings')
const warnings = document.querySelectorAll('.console-warnings img')

// плашки по умолчанию скрыты
warnings.forEach((warning) => (warning.style.opacity = '0'))

// появление
consoleInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter' && consoleInput.value.trim() !== '') {
    warningWrapper.style.opacity = '1'

    warnings.forEach((warning, index) => {
      warning.classList.remove('show-danger')
      warning.style.opacity = '0'

      // последовательное появление плашек по таймеру
      setTimeout(() => {
        warning.classList.add('show-danger')
      }, index * 300)
    })

    // очищение поля ввода после нажатия Enter
    consoleInput.value = ''
  }
})

// ИНСТРУМЕНТ "СРАВНЕНИЕ"

const comparisonBtn = document.querySelector('.comparison') // кнопка в меню
const dragonflyArea = document.querySelector('.dragonfly') // зона клика
const comparisonResult = document.getElementById('comparison-result')
const comparisonInput = document.getElementById('comparison-input')
const comparisonOkBtn = document.getElementById('comparison-ok')
const savedDataText = document.getElementById('saved-comparison-data')

let isHumanToolActive = false

// активация
comparisonBtn.addEventListener('click', (e) => {
  e.stopPropagation()
  isHumanToolActive = true

  // Меняем курсор на всем сайте
  document.body.classList.add('human-cursor-active')

  // Подсветим кнопку инструмента
  comparisonBtn.style.backgroundColor = '#c0ff95'
})

//клик по области стрекозы для размещения
dragonflyArea.addEventListener('click', () => {
  if (isHumanToolActive) {
    // Показываем блок с человечком и инпутом
    comparisonResult.classList.add('comparison-result-active')

    // Сбрасываем режим инструмента, чтобы курсор стал обычным
    isHumanToolActive = false
    document.body.classList.remove('human-cursor-active')
    comparisonBtn.style.backgroundColor = ''
  }
})

// сохранение данных по кнопке ОК
comparisonOkBtn.addEventListener('click', () => {
  const value = comparisonInput.value.trim()

  if (value !== '') {
    // вывод текста под иконку
    savedDataText.textContent = `Разница: ${value}%`

    document.querySelector('.comparison-input-box').style.display = 'none'

    console.log('Данные сравнения сохранены:', value)
  } else {
    alert('Пожалуйста, введи значение!')
  }
})

// поиск кнопки для закрытия
const comparisonCloseBtn = document.getElementById('comparison-close')

// закрытие окна
comparisonCloseBtn.addEventListener('click', () => {
  comparisonResult.classList.remove('comparison-result-active')

  // для повторого появления импута
  document.querySelector('.comparison-input-box').style.display = 'flex'
  comparisonInput.value = ''
  savedDataText.textContent = ''
})

// ИНСТРУМЕНТ "КАРАНДАШ"

const pencilBtn = document.querySelector('.pencil')
const canvases = document.querySelectorAll('.drawing-canvas')

let isPencilActive = false

// включение/выключение инструмента
pencilBtn.addEventListener('click', () => {
  isPencilActive = !isPencilActive
  pencilBtn.style.backgroundColor = isPencilActive ? '#c0ff95' : ''

  if (isPencilActive) {
    document.body.classList.add('pencil-mode-active')
  } else {
    document.body.classList.remove('pencil-mode-active')
  }
})

//настройка холстов
canvases.forEach((canvas) => {
  const ctx = canvas.getContext('2d')
  // кнопка очистки
  const clearBtn = canvas.parentElement.querySelector('.clear-canvas-btn')

  let isDrawing = false
  let hasDrawn = false

  function resizeCanvas() {
    canvas.width = canvas.parentElement.offsetWidth
    canvas.height = canvas.parentElement.offsetHeight
    ctx.strokeStyle = '#ff6400'
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
  }

  setTimeout(resizeCanvas, 100)
  window.addEventListener('resize', resizeCanvas)

  // очистка холста
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      clearBtn.style.display = 'none'
      hasDrawn = false
    })
  }

  // рисование
  canvas.addEventListener('mousedown', (e) => {
    if (!isPencilActive) return
    isDrawing = true
    ctx.beginPath()
    ctx.moveTo(e.offsetX, e.offsetY)
  })

  canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing || !isPencilActive) return
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.stroke()

    // показ кнопки стереть
    if (!hasDrawn) {
      hasDrawn = true
      if (clearBtn) clearBtn.style.display = 'block'
    }
  })

  canvas.addEventListener('mouseup', () => (isDrawing = false))
  canvas.addEventListener('mouseleave', () => (isDrawing = false))
})

//ИНСТРУМЕНТ "ЛИНЕЙКА"

const rulerBtn = document.querySelector('.ruler') // кнопка в меню
const hotspots = document.querySelectorAll('.measurement-hotspot') // зоны клика
const dimCloseBtns = document.querySelectorAll('.dim-close') // крестик

let isRulerToolActive = false

// активация
rulerBtn.addEventListener('click', (e) => {
  e.stopPropagation()
  isRulerToolActive = true
  // смена курсора
  document.body.classList.add('ruler-cursor-active')
  rulerBtn.style.backgroundColor = '#c0ff95'
})

hotspots.forEach((hotspot) => {
  hotspot.addEventListener('click', (e) => {
    if (!isRulerToolActive) return
    e.stopPropagation()

    const parentArea = hotspot.parentElement
    const dimensionOverlay = parentArea.querySelector('.dimension-overlay')
    const lengthSpan = dimensionOverlay.querySelector('span')

    // генерация случайного числа измерения
    if (hotspot.id === 'hotspot-dragonfly') {
      lengthSpan.textContent = (4.0 + Math.random() * 0.5).toFixed(1)
    } else if (hotspot.id === 'hotspot-plant') {
      lengthSpan.textContent = (12.0 + Math.random() * 2.0).toFixed(1)
    }

    dimensionOverlay.classList.add('active')

    // сброс инструмента
    isRulerToolActive = false
    document.body.classList.remove('ruler-cursor-active')
    rulerBtn.style.backgroundColor = ''
  })
})

// закрытие по клику на крестик
dimCloseBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const overlay = btn.parentElement
    overlay.classList.remove('active')
  })
})

// отмена инструмента при клике на пустое место
document.addEventListener('click', () => {
  if (isRulerToolActive) {
    isRulerToolActive = false
    document.body.classList.remove('ruler-cursor-active')
    rulerBtn.style.backgroundColor = ''
  }
})
