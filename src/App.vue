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
      <div id="gjs">
        <h1 style="color: red;">alo</h1>
      </div>
    </div>

  </div>
</template>

<script setup>
import grapesjs from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'
import { onMounted } from 'vue';

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

  console.log(blockManager)

  blockManager.render([
    {
      label: 'Label text', content: `<div class="uay">
        <div class="div1">cai gi the</div>
        <div class="div2">cai quan que</div>
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
        .uay .div1 {
          color: yellow;
        }

        .uay .div2 {
          color: red;
        }
        </style>
      `}
  ])


  editor.on('component:update:content', model => {
    console.log('New content', model.view.el.textContent);

  })


  editor.on('component:selected', (element) => {

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
    console.log(element)

    const commandToAdd = 'tlb-settime';
    const commandIcon = 'abc';

    editor.Commands.add(commandToAdd, editor => {
      // const elementSlt = editor.getSelected()
      // // elementSlt.addAttributes({ 'needChanged': '@avatar'})
      // console.log(elementSlt)
      // elementSlt.setAttributes({ src: '@avatar'})

      console.log(editor.getHtml())
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
</style>
