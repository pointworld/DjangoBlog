/**
 * JS tools: Tree of Content
 * C by Point at 1/2018
 * M by Point at ...
 * github: https://www.github.com/pointworld
 *
 * 目的： 构建一个基于 h 系列标签的目录树工具
 * 代码健壮性问题： 空校验未实现 - 当文档没有 h 系列的标签时，控制台报错
 *
 * 逻辑实现：
 * + 确定容器
 * + 获取 h 系列标签
 *   - 遍历文章所在容器中的所有标签，筛选得到
 * + 对 h 系列标签进行处理
 *   - 显示（show、hide）
 *   - 排列
 *   - 样式
 *   - 行为（锚点、缓动）
 * + 生成目录树
 */

let ToC = {
    // load ToC style dynamically
    ToC_loadStyles: function (str) {
        let tocStyle = document.createElement("style")
        tocStyle.type = "text/css"
        tocStyle.innerHTML = str

        document.getElementsByTagName('head')[0].appendChild(tocStyle)
    },

    // get element position based on top of browser
    getElementPosition: function (ele) {
        return {top: ele.offsetTop}
    },

    // get scrollBar position
    getScrollBarPosition: function () {
        return scrollBarPosition = document.body.scrollTop || document.documentElement.scrollTop
    },

    // move scroll bar，destination: finalPos，speed: internal
    moveScrollBar: function (finalpos, interval) {

        if (!window.scrollTo) return false

        // forbidden mouse wheel when window is scrolling
        window.onmousewheel = function () {
            return false
        }

        // clear timer
        if (document.body.movement) clearTimeout(document.body.movement)

        let currentpos = ToC.getScrollBarPosition()

        let dist = 0
        if (currentpos === finalpos) {
            window.onmousewheel = function () {
                return true
            }
            return true
        }
        if (currentpos < finalpos) {
            dist = Math.ceil((finalpos - currentpos) / 10);
            currentpos += dist;
        }
        if (currentpos > finalpos) {
            dist = Math.ceil((currentpos - finalpos) / 10);
            currentpos -= dist;
        }

        let scrTop = ToC.getScrollBarPosition()
        window.scrollTo(0, currentpos)
        //若已到，则解禁鼠标滚轮，并退出
        if (ToC.getScrollBarPosition() === scrTop) {
            window.onmousewheel = function () {
                return true
            }
            return true
        }

        //进行下一步移动
        let repeat = "ToC.moveScrollBar(" + finalpos + "," + interval + ")"
        document.body.movement = setTimeout(repeat, interval)
    },

    htmlDecode: function (text) {
        let temp = document.createElement("div")
        temp.innerHTML = text
        let output = temp.innerText || temp.textContent
        temp = null
        return output
    },

    /*
     create ToC：
     id: container
     a-f: heading node value
     interval: move speed
     */
    createToC: function (id, a, b, c, d, e, f, interval) {
        // get container of id="maincontent"
        // let target = document.getElementById(id)
        let target = document.getElementsByTagName(id)[0]
        if (!target) return false
        // get all nodes within container
        let nodes = target.getElementsByTagName("*")

        // create a container to contain ToC
        let divSideBar = document.createElement('DIV')
        divSideBar.className = 'sideBar'
        divSideBar.setAttribute('id', 'sideBar')

        // create what to be shown when ToC was hiden
        let divSideBarTab = document.createElement('DIV')
        divSideBarTab.setAttribute('id', 'sideBarTab')

        divSideBar.appendChild(divSideBarTab)

        let btn_tab = document.createElement('button')
        btn_tab.style.background = 'rgba(0, 0, 0, 0)'
        btn_tab.style.border = 0
        divSideBarTab.appendChild(btn_tab)
        let txt = document.createTextNode('ToC')
        btn_tab.appendChild(txt)

        let divSideBarContents = document.createElement('DIV')
        divSideBarContents.style.display = 'none'
        divSideBarContents.setAttribute('id', 'sideBarContents')
        divSideBar.appendChild(divSideBarContents)

        let dlist = document.createElement("dl")
        divSideBarContents.appendChild(dlist)
        let num = 0

        let h2_num = h3_num = h4_num = h5_num = h6_num = 0

        // foreach all nodes within container, get all heading nodes, deal with all heading nodes
        for (let i = 0, len = nodes.length; i < len; i++) {
            if (nodes[i].nodeName === a || nodes[i].nodeName === b || nodes[i].nodeName === c ||
                nodes[i].nodeName === d || nodes[i].nodeName === e || nodes[i].nodeName === f) {

                // get text of heading element
                let nodetext = nodes[i].innerHTML.replace(/<\/?[^>]+>/g, "").replace(/[^>]+>/g, "").replace(/&nbsp;/ig, "")
                nodetext = ToC.htmlDecode(nodetext)

                // set anchor attribute to heading element
                nodes[i].setAttribute("id", "blogTitle" + num)
                let item

                switch (nodes[i].nodeName) {
                    // h1
                    case a:
                        item = document.createElement("dt")
                        item.style.backgroundColor = '#272727'
                        item.style.fontWeight = 700
                        item.style.color = '#bfb9b9'
                        item.style.textAlign = "center"
                        item.style.fontSize = '20px'
                        item.dataset.index = ''
                        nodes[i].dataset.index = item.dataset.index
                        break
                    // h2
                    case b:
                        h2_num += 1
                        item = document.createElement("dd")
                        item.style.backgroundColor = "#aaa"
                        item.style.color = "#000"
                        item.style.fontWeight = 'bold'
                        item.style.textAlign = "center"
                        nodes[i].dataset.index = item.dataset.index = h2_num + '.'
                        nodes[i].dataset.index = item.dataset.index
                        h3_num = 0
                        break
                    // h3
                    case c:
                        h3_num += 1
                        item = document.createElement("dd")
                        item.style.color = "#000"
                        item.style.fontWeight = 'bold'
                        item.dataset.index = h2_num + '.' + h3_num + '.'
                        nodes[i].dataset.index = item.dataset.index
                        h4_num = 0
                        break
                    // h4
                    case d:
                        h4_num += 1
                        item = document.createElement("dd")
                        item.style.textIndent = "1em"
                        item.dataset.index = h2_num + '.' + h3_num + '.' + h4_num + '.'
                        nodes[i].dataset.index = item.dataset.index
                        h5_num = 0
                        break
                    // h5
                    case e:
                        h5_num += 1
                        item = document.createElement("dd")
                        item.style.textIndent = "2em"
                        item.dataset.index = h2_num + '.' + h3_num + '.' + h4_num + '.' + h5_num + '.'
                        nodes[i].dataset.index = item.dataset.index
                        h6_num = 0
                        break
                    // h6
                    case f:
                        h6_num += 1
                        item = document.createElement("dd")
                        item.style.textIndent = "3em"
                        item.dataset.index = h2_num + '.' + h3_num + '.' + h4_num + '.' + h5_num + '.' + h6_num + '.'
                        nodes[i].dataset.index = item.dataset.index
                        break
                }

                // create anchor link
                let itemtext = document.createTextNode(nodetext)
                item.appendChild(itemtext)
                let btn = document.createElement('button')
                btn.style.background = 'rgba(0, 0, 0, 0)'
                btn.style.border = 0
                item.appendChild(btn)
                item.setAttribute("name", num)
                item.onclick = function () {
                    let pos = ToC.getElementPosition(document.getElementById("blogTitle" + this.getAttribute("name")))
                    if (!ToC.moveScrollBar(pos.top, interval)) return false
                }

                dlist.appendChild(item)
                num++
            }
        }

        if (num === 0) return false

        divSideBarTab.onmouseenter = function () {
            divSideBarContents.style.display = 'block'
            divSideBar.style.right = '50px'
            btn_tab.innerText = 'X'
            btn_tab.style.fontSize = '18px'
            btn_tab.style.cursor = 'pointer'
        }

        divSideBarTab.onclick = function () {
            if (divSideBarContents.style.display === 'none') {
                divSideBarContents.style.display = 'block'
                divSideBar.style.right = '50px'
                btn_tab.innerText = 'X'
                btn_tab.style.fontSize = '18px'
                btn_tab.style.cursor = 'pointer'
            }
            else {
                divSideBarContents.style.display = 'none'
                divSideBar.style.right = '2px'
                btn_tab.innerText = 'ToC'
                btn_tab.style.fontSize = '12px'
            }
        }

        divSideBar.onmouseleave = function () {
            // divSideBarContents.style.display = 'none'
        }

        document.body.appendChild(divSideBar)

        // add css of ToC to html file
        ToC.ToC_loadStyles(`
            #sideBar{
                position:fixed;
                top:50px;
                right:2px;
                width: auto;
                height: auto;
                font-size:12px;
                text-align:left;
            }
            #sideBarTab{
                float:left;
                width:30px;
                padding:5px;
                border-radius:10px 20px 80px 10px;
                text-align:center;
                background-color:rgba(0,0,0,.2);
            }
            #sideBarContents{
                float:left;
                overflow:auto;
                max-height:680px;
                border-radius:10px 20px 80px 10px;
                background:#dedede;
            }
            #sideBarContents dl, #sideBarContents dt, #sideBarContents dd {
                margin:0;
                padding:0;
            }
            #sideBarContents dt, #sideBarContents dd {
                margin:2px;
                padding:6px;
                cursor:pointer;
            }
            #sideBarContents dd:hover, dt:hover {
                color:#A7995A;
            }
            #sideBarContents dd::before {
                content: attr(data-index) ' ';
                opacity: 0.3;
            }
        `)
    }
}

// when the document was loaded， the function - ToC.createToC will be executed.
window.addEventListener("load", ToC.createToC("article", "H1", "H2", "H3", "H4", "H5", "H6", 20), false)
