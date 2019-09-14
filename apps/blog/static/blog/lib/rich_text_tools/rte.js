/**
 * @author: point <onepointpointone@gmail.com>
 * @github: https://github.com/pointworld
 * Rich text editor tool
 * C by Point on 03/08/2017.
 * M by Point on ...

// 注：寻找或开发一个，可以对代码编辑器的代码注释内容，进行自动排版、缩进和折叠等功能，的插件

标题：富文本编辑器（Rich Text Editor）

目标：让 HTML 文档拥有和 Word 软件类似的功能

难点：
  浏览器不支持多处同时选择并编辑的功能
  如何实现被编辑的内容实时同步回后端

功能：
  1. 操作目标可编辑：form 元素、textarea 元素、拥有 contenteditable="true" 属性的元素
  2. 在文档可编辑区域单击鼠标右键弹出文本编辑器工具框 - RTEBox
  3. RTEBox 功能：
    - 结构处理
      + 对文档中每个标题下的内容实现展开与折叠功能

    - 文本处理
      + 外观：格式化、字体、字号、字形、粗细、文字颜色、文字背景、文字排列、字间距、行间距、行高、
      + 装饰：
      + 内容：删除、复制、粘贴、插入、缩进、书写方向
      + 语义：段落、标题、列表、链接（链接化、去链接化）
      + 其他：

    - 图片处理
      + base64 编码
      + 尺寸、透明度、边框、

    - 事件处理
      + 复制粘贴中的内容处理
        - 复制
          + 浅拷贝
          + 深拷贝
        - 粘贴


逻辑实现

业务逻辑

产品外观描述：由一个'可固定可隐藏的工具栏'和一个'自弹出自隐藏的工具框'组成
  1. 可固定可隐藏的工具栏，用于容纳富文本编辑器的所有工具
  2. 自弹出自隐藏的工具框，用于容纳富文本编辑器的常用工具

代码实现：
  Class: Rte
    Bar
      html-1
      style-1
      js
    Box
      html-2
      style-2
      js




 */

const edit_article = document.getElementById('edit_article')
const view_article = document.getElementById('view_article')

let editable = false

entry_content = document.getElementsByClassName('entry-content')[0]

if (edit_article) {
  edit_article.addEventListener('click', () => {
    entry_content.setAttribute('contenteditable', true)
    editable = true
  })
}

if (view_article) {
  view_article.addEventListener('click', () => {
    entry_content.removeAttribute('contenteditable')
    editable = false
  })
}

let RteBox = {
  rightClickStopDefault: function () {
    return false
  },

  rightClickDefault: function () {
    return true
  },

  // 点击 RteBox 中相应按钮修改样式
  edit: function (a, b) {
    switch (a) {
      case 'backcolor':
        let bgcolor = b ? b : prompt('please input a color value:', 'yellow')
        return document.execCommand(a, 'true', bgcolor)
      case 'forecolor':
        let color = b ? b : prompt('please input a color value:', 'black')
        return document.execCommand(a, 'true', color)
      case 'fontname':
        let fontname = b ? b : prompt('please input a font name:', 'arial')
        return document.execCommand(a, 'true', fontname)
      case 'createlink':
        let createLink = b ? b : prompt('please input a link:', 'http://')
        return document.execCommand(a, 'true', 'url(' + createLink + ')')
      case 'formatblock':
        let formatblock = b ? b : prompt('please input a block tag:', 'div')
        return document.execCommand(a, 'true', formatblock)
      case 'insertimage':
        let img = document.createElement('img')
        img.src = prompt('please input a image url:', 'http://')
        return document.execCommand('insertHTML', 'true', img.outerHTML)
      case 'insertTable':
        let rows = parseInt(prompt('please input a row number:', 2))
        let cols = parseInt(prompt('please input a column number:', 2))

        let table = document.createElement('table')
        table.style.borderTop = '2px solid #131415'
        table.style.borderBottom = '2px solid #131415'
        table.style.borderCollapse = 'collapse'
        table.style.width = '100%'

        let caption = table.createCaption()
        caption.innerHTML = 'table 1.1 heading'

        let tbody = document.createElement('tbody')

        let tr = document.createElement('tr')
        for (let i = 0, th; i < rows; i++) {
          th = document.createElement('th')
          th.innerHTML = 'title'
          th.style.textAlign = 'left'
          th.style.borderBottom = '1px solid #334455'
          tr.appendChild(th)
        }
        tbody.appendChild(tr)

        for (let i = 0, td; i < cols; i++) {

          tr = document.createElement('tr')
          for (let j = 0; j < rows; j++) {
            td = document.createElement('td')
            td.appendChild(document.createTextNode('data'))
            tr.appendChild(td)
          }
          tbody.appendChild(tr)
        }
        table.appendChild(tbody)

        return document.execCommand('insertHTML', 'true', table.outerHTML)
      case 'smiley':
        let Sel = window.getSelection().anchorNode
        let smiley = prompt(
          `\nflag  ` + `nodeName` +
          `\n1     ` + Sel.nodeName.toLowerCase() +
          `\n2     ` + Sel.parentNode.nodeName.toLowerCase() +
          `\n3     ` + Sel.parentNode.parentNode.nodeName.toLowerCase() +
          `\n4     ` + Sel.parentNode.parentNode.parentNode.nodeName.toLowerCase() +
          `\n5     ` + Sel.parentNode.parentNode.parentNode.parentNode.nodeName.toLowerCase(),


          'bgc-red')
        let smileyArr = smiley.split(' ')
        console.log(smileyArr)
        return
      default:
        return document.execCommand(a, 'true', b)
    }
  },

  // 创建 RteBox 编辑菜单框
  createBox: function () {
    let rte_box = document.createElement('div')
    rte_box.id = 'rte_box'

    function createMenuItem(sValue, sLabel) {
      let oNewOpt = document.createElement("option")
      oNewOpt.value = sValue
      oNewOpt.innerHTML = sLabel || sValue
      return oNewOpt
    }

    let firstTable = document.createElement('table')
    firstTable.innerHTML = '<tbody><tr></tr></tbody>'
    for (let oTd, oMenu, oMenuOpts, vOpt, nMenu = 0, len = oTools.menus.length; nMenu < len; nMenu++) {
      oTd = document.createElement('td')
      oMenu = document.createElement("select")
      oMenu.id = 'rte_' + oTools.menus[nMenu].command
      oMenu.addEventListener('change', function () {
        RteBox.edit(oTools.menus[nMenu].command, this[this.selectedIndex].value)
        this.selectedIndex = 0
      }, false)
      oMenu.appendChild(createMenuItem(oTools.menus[nMenu].header))
      oMenuOpts = oTools.menus[nMenu].values
      if (oMenuOpts.constructor === Array) {
        for (vOpt = 0; vOpt < oMenuOpts.length; oMenu.appendChild(createMenuItem(oMenuOpts[vOpt++]))) {
        }
      } else {
        for (vOpt in oMenuOpts) {
          oMenu.appendChild(createMenuItem(vOpt, oMenuOpts[vOpt]))
        }
      }
      oMenu.selectedIndex = 0
      oTd.appendChild(oMenu)
      firstTable.children[0].children[0].appendChild(oTd)
    }


    let oImgBtn = null
    let secondTable = document.createElement('table')
    secondTable.innerHTML = '<tbody><tr></tr><tr></tr></tbody>'

    for (let oTd, oBtn, nBtn = 0, len = oTools.buttons.length; nBtn < len; nBtn++) {
      oTd = document.createElement('td')
      oBtn = oTools.buttons[nBtn]
      oImgBtn = document.createElement("img")
      oImgBtn.className = "rte-button"
      oImgBtn.id = 'rte_' + oBtn.command
      oImgBtn.src = oBtn.image
      oImgBtn.title = oBtn.text
      oImgBtn.addEventListener('click', function () {
        RteBox.edit(oBtn.command)
      }, false)
      oTd.appendChild(oImgBtn)
      if (nBtn < len / 2) {
        secondTable.children[0].children[0].appendChild(oTd)
      }
      else {
        secondTable.children[0].children[1].appendChild(oTd)
      }
    }

    rte_box.innerHTML = `
        <table>
        <tbody>
        <tr id="menuTop"><td>回到顶部</td></tr>
        <tr>
        <td><button onclick="RteBox.edit('insertHTML','text')">HTML</button></td>
        <td><button onclick="RteBox.edit('insertText','text')">Text</button></td>
        <td><button onclick="RteBox.edit('insertParagraph')"><i class="uk-icon-paragraph"></i></button></td>
        <td><button onclick="RteBox.edit('delete')"  title="Delete">del-L</button></td>
        <td><button onclick="RteBox.edit('forwardDelete')"  title="forwardDelete">del-R</button></td>
        <td><button onclick="RteBox.edit('selectAll')" title="selectAll">selectAll</button></td>
        </tr>
        </tbody>
        </table>
        `;
    rte_box.appendChild(firstTable)
    rte_box.appendChild(secondTable)
    document.body.appendChild(rte_box)
  },

  // 动态添加样式
  createBoxStyle: function (str) {
    let style = document.createElement("style")
    style.type = "text/css"
    try {
      style.innerHTML = str
    } catch (ex) {
      style.styleSheet.cssText = str
    }
    let head = document.getElementsByTagName('head')[0]
    head.appendChild(style)
  },

  // 生成编辑菜单
  produceRteBox: function () {
    RteBox.createBox()

    RteBox.createBoxStyle(`
            #rte_box{
                margin: 0!important;
                padding: 3px!important;
                padding-left: 8px;
                text-align: left;
                font-size: 16px;
                background-color: rgba(99,99,99,.7);
                position:fixed;
                display:none;
                border-radius:10px;
            }
            #rte_box td{
                color:#ddd;
            }
            #rte_box td:hover,
            #rte_box button:hover{
                background-color: rgba(0,0,0,.2);
                cursor:pointer;
                color: #ededed;
                font-weight:bold;
            }
            #rte_box td>button{
                background-color: rgba(99,99,99,.4);
                border:none;
                color:#000;
                font-weight:bold;
            }
            `);

    function mouseUp(e) {

      function showBox() {
        if (!editable) return

        let screenH = document.documentElement.clientHeight,
          screenW = document.documentElement.clientWidth,
          rte_boxH = rte_box.offsetHeight || 130,
          rte_boxW = rte_box.offsetWidth || 500;

        document.oncontextmenu = RteBox.rightClickStopDefault;
        // 当鼠标的位置到视口右侧的位置小于菜单的宽度，则视口的右侧为菜单的右侧
        rte_box.style.left = (screenW - e.clientX < rte_boxW) ? screenW - rte_boxW + 'px' : e.clientX - 10 + 'px';
        // 当鼠标的位置到视口底部的位置小于菜单的高度，则鼠标的位置为菜单的底部位置
        rte_box.style.top = (screenH - e.clientY < rte_boxH) ? e.clientY - rte_boxH - 10 + 'px' : e.clientY + 10 + 'px';
        rte_box.style.display = 'block';
      }

      function hideBox() {
        document.oncontextmenu = RteBox.rightClickDefault;
        rte_box.style.display = 'none';
      }

      /*console.log(getSelection());
       console.log(getSelection().toString());
       console.log(getSelection());
       console.log(getSelection().getRangeAt(0));
       console.log(getSelection().getRangeAt(0).commonAncestorContainer);*/
      // console.log(getSelection().anchorNode.parentNode.classList.toggle('bgc-blue'));
      // console.log(getSelection().anchorNode.parentNode.classList.toggle('opacity-4'));
      // console.log(getSelection().anchorNode.parentNode.classList);
      // console.log(getSelection().anchorNode.parentNode.classList.item(2));
      // console.log(getSelection().focusNode);
      // console.log(getSelection().focusNode.parentNode.classList.toggle('bgc-blue'));

      window.getSelection().toString() ?
        // 有文本被选中时
        e.button === 2 ?
          // 鼠标右键被按下时隐藏
          e.ctrlKey ?
            // Ctrl 键被按下时显示，反之隐藏
            showBox() : hideBox()
          // 鼠标右键没有被按下则显示
          : showBox()

        // 没有文本被选中时
        // Ctrl 键和鼠标右键被按下时显示，反之隐藏
        : e.ctrlKey && e.button === 2 ? showBox() : hideBox();
    }

    // 给 id='maincontent' 的盒子添加可编辑功能
    // maincontent.addEventListener('mouseup', mouseUp, false)
    let article = document.getElementsByTagName('article')[0]
    article.addEventListener('mouseup', mouseUp, false)

    // 匀速回到顶部功能
    let timer = null;
    menuTop.addEventListener('click', function () {
      cancelAnimationFrame(timer);
      timer = requestAnimationFrame(function fn() {
        let oTop = document.body.scrollTop || document.documentElement.scrollTop;
        if (oTop > 0) {
          document.body.scrollTop = document.documentElement.scrollTop = oTop - 160;
          timer = requestAnimationFrame(fn);
        } else {
          cancelAnimationFrame(timer);
        }
      });
    }, false);
  }
}

// 异步加载 RteBox 的配置单
let oToolsReq = new XMLHttpRequest(), oTools = null
oToolsReq.onload = function () {
  oTools = JSON.parse(this.responseText)
}
oToolsReq.open("GET", "/static/blog/lib/rich_text_tools/rte.json", true)
oToolsReq.send()

window.addEventListener("load", RteBox.produceRteBox, false)
