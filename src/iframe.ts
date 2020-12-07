import { setAttribute } from '@/utils/dom'

function loadCDNCSS (url: string) {
  const _link = document.createElement('link')
  setAttribute(_link, {
    ref: 'stylesheet',
    href: url
  })
  document.querySelector('head')?.appendChild(_link)
}

function loadCDNJS (url: string) {
  const _script = document.createElement('script')
  setAttribute(_script, {
    type: 'text/javascript',
    src: url
  })
  document.querySelector('body')?.appendChild(_script)
}

function appendSetting (headStuff: string, cssCDN, jsCDN) {
  const headHtml = document.querySelector('head')?.innerHTML
  if (document.querySelector('head')) {
    (document.querySelector('head') as HTMLHeadElement).innerHTML = headHtml + headStuff
  }
  const reg = /^(?:(http|https|ftp):\/\/)?((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i;
  cssCDN.filter(item => item.address).map(item => {
    if (reg.test(item.address)) loadCDNCSS(item.address)
  })
  jsCDN.filter(item => item.address).map(item => {
    if (reg.test(item.address)) loadCDNJS(item.address)
  })
}

function loadPage (htmlCode, cssCode, jsCode) {
  const _html = document.querySelector('#customHTML')
  if (_html) document.body.removeChild(_html)
  const html = document.createElement('div')
  html.id = 'customHTML'
  html.innerHTML = htmlCode
  document.body.appendChild(html)

  const _css = document.querySelector('#customCSS')
  if (_css) document.head.removeChild(_css)
  const css = document.createElement('style')
  css.id = 'customCSS'
  css.innerHTML = cssCode
  document.head.appendChild(css)

  const _script = document.querySelector('#customJS')
  if (_script) document.body.removeChild(_script)
  const script = document.createElement('script')
  script.id = 'customJS'
  script.innerHTML = jsCode
  document.body.appendChild(script)
}

let settingFlag = true
window.addEventListener('message', (event) => {
  console.log(event)
  const { data } = event
  try {
    const { type, data: codeValue } = data
    if (!codeValue) return
    const { html, css, javascript, setting } = codeValue

    if (type !== 'editorChange') return
    if (settingFlag) {
      const { headStuff, cssCDN, jsCDN } = setting
      appendSetting(headStuff, cssCDN, jsCDN)
      settingFlag = false
    }
    loadPage(html.code, css.code, javascript.code)
  } catch (e) {
    console.log(e)
  }
}, false)
