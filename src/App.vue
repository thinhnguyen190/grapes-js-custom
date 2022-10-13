<template>
  <div class="grapes__selects">
    <div class="grapes__selects__items">
      <div class="grapes__selects__items__item" v-for="select in listSelects" :key="select.name"
        :class="{'selected': checkSelectSelected(select.name)}">
        {{select.name}}
      </div>
    </div>

    <div class="grapes__selects__component-available">
      <!-- <div class="component-available" v-for="component in selectSelected.components" :key="component.name">
        {{component.name}}
      </div> -->
    </div>
  </div>

  <div class="grapes__drawboard">
    <div class="grapes__drawboard__content">
      <div id="gjs" ref="tableDraw">
        <textarea style="color: red;" spellcheck="false">alo</textarea>

      </div>
    </div>

    <div class="box--mention" ref="boxMention">
      <div class="box--mention__item">
        item1
      </div>

      <div class="box--mention__item">
        item2
      </div>

      <div class="box--mention__item">
        item3
      </div>

      <div class="box--mention__item">
        item4
      </div>
    </div>
  </div>
</template>

<script setup>
import grapesjs from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'
import { onMounted, ref } from 'vue';
import Mentionify from './utils/AutoCompleteMention'


let editor = {}

const listSelects = [
  {
    name: "Element",
    components: [
      {
        name: "component1"
      },
      {
        name: "component2"
      },
      {
        name: "component3"
      }
    ]
  },
  {
    name: "Template"
  },
  {
    name: "BGround"
  },
  {
    name: "Text"
  },
  {
    name: "Tool"
  },
  {
    name: "Upload"
  },
  {
    name: "Favorites"
  }
]


const boxMention = ref()

const tableDraw = ref()
//////////////////
const users = [
  { username: 'john_doe' },
  { username: 'jane_doe' },
]

const resolveFn = prefix => prefix === ''
  ? users
  : users.filter(user => user.username.startsWith(prefix))

const replaceFn = (user, trigger) => `${trigger}${user.username} `

const menuItemFn = (user, setItem, selected) => {
  const div = document.createElement('div')
  div.setAttribute('role', 'option')
  div.className = 'menu-item'
  if (selected) {
    div.classList.add('selected')
    div.setAttribute('aria-selected', '')
  }
  div.textContent = user.username
  div.onclick = setItem
  return div
}
////////////////////

const selectSelected = {
  name: "Element",
  components: [
    {
      name: "component1"
    },
    {
      name: "component2"
    },
    {
      name: "component3"
    },
    {
      name: "component4"
    },
    {
      name: "component5"
    },
    {
      name: "component6"
    }
  ]
}

const checkSelectSelected = (select) => {
  if (select === selectSelected.name) return true

  return false
}

onMounted(() => {
  editor = grapesjs.init({
    // Indicate where to init the editor. You can also pass an HTMLElement
    container: '#gjs',
    // Get the content for the canvas directly from the element
    // As an alternative we could use: `components: '<h1>Hello World Component!</h1>'`,
    width: '100%',
    height: '100%',
    fromElement: true,
    storageManager: false,
    colorPicker: { appendTo: 'parent', offset: { top: 26, left: -166, }},
    panels: {
      defaults: [],
    },
    blockManager:
    // Noi quan ly cac component co the tai su dung nhieu lan
    {
      appendTo: '.grapes__selects__component-available',

      // thiet lap xem do giao dien grapesjs vao dau (do vao the div co id la gjs)
      blocks: [
        //Cac component co the tai su dung 
        {
          id: 'image',
          label: 'Image',
          media: `<<svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" />
        </svg>>`,
          // Use `image` component
          content: { type: 'image' },
          // The component `image` is activatable (shows the Asset Manager).
          // We want to activate it once dropped in the canvas.
          activate: true,
          // select: true, // Default with `activate: true`
        }
      ],
    },
    selectorManager: {
      componentFirst: true,
    },
    // Avoid any default panel
  })



  editor.setDragMode('absolute')

  const blockManager = editor.Blocks



  blockManager.render([
    {
      label: 'Label text', content: `<div class="uay">
        <textarea class="div1">cai gi the</textarea>
        <textarea class="div2">cai quan que</textarea>
      </div>
      <style>
        .uay {
          display: flex;
          justify-content: center;
          width: 200px;
          height: 200px;
          background-color: black;
          color: white;
        }

        textarea {
          resize: none; 
        }
        </style>
      `},
    {
      label: 'div',
      content: `
        <div>
            mot cai div gi do
          </div>
      `
    },
    {
      label: 'areatext',
      content: `
        <textarea>
            mot cai text gi do
          </textarea>
      `
    },
    {
      label: 'img',
      content: `
        <img />
      `
    }
  ])




  editor.on('component:selected', (element) => {
    const domElement = element.getEl();
    console.log(domElement.innerHTML);
    domElement.innerHTML = '<p>djashnjksajkfhnfnsjkfnsfbsakjfsnkj</p>'
    const positionOfTableDraw = tableDraw.value.getBoundingClientRect()
    if(!element['hasMention'] && element.get('tagName') === 'textarea') {
      element['hasMention'] = true
    new Mentionify(
                    domElement,
                    boxMention.value,
                    resolveFn,
                    replaceFn,
                    menuItemFn,
                    positionOfTableDraw
                    )
    }
    
    
   
    

    element.attributes.resizable = {
      tc: true,
      tl: true,
      tr: true,
      cl: true,
      cr: true,
      bl: true,
      bc: true,
      br: true,

    }

    const commandToAdd = 'tlb-settime';
    const commandIcon = 'abc';

    editor.Commands.add(commandToAdd, editor => {
      // const elementSlt = editor.getSelected()
      // // elementSlt.addAttributes({ 'needChanged': '@avatar'})
      // console.log(elementSlt)
      // elementSlt.setAttributes({ src: '@avatar'})

    })



    // get the selected componnet and its default toolbar
    const selectedComponent = editor.getSelected();
    const defaultToolbar = selectedComponent.get('toolbar');

    // check if this command already exists on this component toolbar
    const commandExists = defaultToolbar.some(item => item.command === commandToAdd);

    // if it doesn't already exist, add it
    if (!commandExists) {
      selectedComponent.set({
        toolbar: [...defaultToolbar, { attributes: { class: commandIcon }, command: commandToAdd, label: "xoay" }]
      });
    }


  })


})



</script>

<style>
body {
  margin: 0px;
  box-sizing: border-box;
}

#app {
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;

  display: flex;
}

.grapes__selects {
  width: 432px;
  height: 100%;
  background-color: red;

  display: flex;

}

.grapes__selects .grapes__selects__items {

  width: 30%;
  height: 100%;
}

.grapes__selects__items .grapes__selects__items__item {
  width: 100%;
  padding: 5px 10px;

  font-size: 20px;
  font-weight: 600;

  color: white;
  background-color: rgb(255, 130, 180, 100%);
  border: 1px solid white;

  box-sizing: border-box;

  cursor: pointer;
}

.grapes__selects__items .grapes__selects__items__item.selected {
  background-color: yellowgreen;

}

.gjs-blocks-cs {
  width: 100%;
  height: 100%;
}

.grapes__drawboard {
  width: calc(100% - 432px);
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  /* background-color: yellow; */
}

.grapes__drawboard .grapes__drawboard__content {
  width: 60%;
  height: 60%;
}

.grapes__selects__component-available {
  width: 70%;

  display: flex;
  flex-wrap: wrap;
  align-content: start;

}

.component-available {
  width: 50%;
  height: 150px;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: yellowgreen;

  border: 1px solid #ccc;

  box-sizing: border-box;

  cursor: pointer;
}

#gjs {
  border: 3px solid #444;
}

.gjs-cv-canvas {
  top: 0;
  width: 100%;
  height: 100%;
}

.grapes__drawboard #gjs-tools .gjs-toolbar {
  position: fixed;
  top: 0px !important;
  width: calc(100% - 432px);
  left: 432px !important;
}

.box--mention {
  background-color: #f3f3f3;
  position: fixed;
  z-index: 100;
}

.menu-item {
    cursor: default;
    padding: 1rem;
  }
  
  .menu-item.selected {
    background-color: slateGray;
    color: white;
  }
  
  .menu-item:hover:not(.selected) {
    background-color: #fafafa;
  }
  
</style>
