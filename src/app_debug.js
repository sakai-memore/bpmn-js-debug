import $ from 'jquery';
import 'bootstrap';

import DataUtil from  './lib/DataUtil';
import HbsUtil from  './lib/HbsUtil';

import { togglePanel } from './lib/togglePanel';
import { registerFileDrop } from './lib/registerFileDrop';
import { saveLocal } from './lib/saveLocal';

// -- Custom Modeler
import { CustomBpmnModelerFactory } from "./modeler/CustomBpmnModelerFactory.js";
import { CustomBpmnViewerFactory } from "./viewer/CustomBpmnViewerFactory.js";

import CliHelper from  './lib/CliHelper.js';


// import './style.css';
	
// display a diagram: render xml data on canvas
const displayDiagram = async (xml_data) => {
  try {
    // console.log(xml_data);
    const result = bpmnJs.importXML(xml_data);
    const { warnings } = result;
  
  } catch (err) {
    console.log(err.message, err.warnings);
    alert('could not import BPMN 2.0 XML, see console');
  }
}

// draw canvas: document ready action
const drawCanvas = async (bpmnXML) => {

  // import xml into canvas
  await displayDiagram(bpmnXML);
  
  // get canvas
  const canvas = bpmnJs.get("canvas");
  const overlays = bpmnJs.get("overlays");
  const eventBus = bpmnJs.get("eventBus");
  const elementRegistry = bpmnJs.get("elementRegistry");
  // zoom to fit full viewport
  canvas.zoom('fit-viewport');
  
  // for debug
  window.canvas = canvas; // public on window for debug
  window.overlays = overlays; // public on window for debug
  window.eventBus = eventBus; // public on window for debug
  window.elementRegistry = elementRegistry; // public on window for debug
  
  // create Helper class
  let cliHelper = new CliHelper(elementRegistry)
  // 
  const elKeyAll = await cliHelper.getElemetsIds('Task');
  // console.log(elKeyAll);
  for (let obj of elKeyAll) {
    let elm = await cliHelper.getElementBProperties(obj.id);
    // console.log(elm)
  }
  // getElements
  let taskElms = await cliHelper.getElementsBProperties('Task');
  console.log(`taskElms = ${JSON.stringify(taskElms)}`)
  
  let cxt = "";
  let jsonObj = {'concern_id': 1};
  
  // element event // not on 'element.dbclick'
  eventBus.on('element.click', 10, async (elm) => {
    // elm.element = the model element
    // elm.gfx = the graphical element
    console.log(`element.click! id = ${elm.element.id}`)
    await cliHelper.setElementBPropsExtensions(elm.element.id, jsonObj);
    cxt = await cliHelper.getElementBPropsExtensions(elm.element.id);
    console.log(`line 87: cxt = ${cxt}`);
    jsonObj.concern_name = 'Integrity';
    await cliHelper.setElementBPropsExtensions(elm.element.id, jsonObj);
    cxt = await cliHelper.getElementBPropsExtensions(elm.element.id);
    console.log(cxt);
    let aryConcerns = await cliHelper.getElementsBPropsExtensionsObject('Task');
    console.log(aryConcerns)
    // $("#btn_modal_form").trigger("click");
    
  });

}


// ------------------------------// entry point
const root = async () => {
  console.log('// ----------------// start debug!');
  
  // get bpmn XML data
  const url = MEDIA_PATH + INITIAL_XML_NAME;
  console.log(`load from url: ${url}`);
  const bpmnXML = await DataUtil.fetchData(url);
  
  // render hbs
  $(EL_COMPONENTS).html(divComponents);
  for(let itm of aryHbsComponents) {
    console.log(`render ${itm.hbsPath} ...`);
    await HbsUtil.renderComponent(
      itm.el, 
      itm.hbsPath, 
      itm.data
    );
  }
  
  // // Event- Actions
  // $("#btn_createNew").on("click", {bpmnModeler: bpmnJs, initialDiagram: initialDiagram, fileName: INITIAL_XML_NAME}, createNew);
  // $("#lnk_saveLocal").on("click", {bpmnModeler: bpmnJs, fileName: INITIAL_XML_NAME}, saveLocal);
  $("#btn_saveLocal").on("click", {bpmnModeler: bpmnJs, fileName: INITIAL_XML_NAME}, saveLocal);
  $(".toggle-panel").on("click", togglePanel);
  //
  $("#btn_modal_form").on("click",()=>{
    console.log('#btn_modal_form clicked!');
    $("#modal-form").show();
  });
  // Event- Actions : drop a file
  const dropArea = $(EL_DROP_AREA);
  if (!window.FileList || !window.FileReader) {
    window.alert(
      'Looks like you use an older browser that does not support drag and drop. ' +
      'Try using Chrome, Firefox or the Internet Explorer > 10.');
  } else {
    registerFileDrop(dropArea, displayDiagram);
  }
  
  //
  await drawCanvas(bpmnXML);

}

//// helper ///////////////////////////////////////////
const get_instance = (mode) => {
  let retModule = {};
  let factory = {};
  
  factory = new CustomBpmnViewerFactory();
  retModule = factory.get_instance(EL_CANVAS2);
  
  if(mode === 'modeler') {
    factory = new CustomBpmnModelerFactory();
    retModule = factory.get_instance(EL_CANVAS, EL_PROPERTIES_PANEL_PARENT);
  }
  
  return retModule;
}

// -------------------------------------------// document.ready
// variables
const MEDIA_PATH = '../../media/xml/';
// const INITIAL_XML_NAME = 'initialDiagram.bpmn';
const INITIAL_XML_NAME = 'qr-code.bpmn';
const TEMP_XML_NAME = 'BP_xxxxx.bpmn';

const EL_CANVAS = "#js-canvas";
const EL_CANVAS2 = "#js-canvas2";
const EL_PROPERTIES_PANEL_PARENT = "#properties-panel-parent";
const EL_COMPONENTS = "#div-components";
const EL_DROP_AREA = "#row-main";
const EL_LINK_DOWNLOAD = "[data-download]";

const aryHbsComponents = [
  {el: '#form-component', data: {}, hbsPath: './viewer/components/form-component.hbs'},
];
const divComponents = `
  <div id='form-component'></div>
`;

// let CONS_MODE = 'viewer'
let CONS_MODE = 'modeler'

let bpmnJs = {};
bpmnJs = get_instance(CONS_MODE);
bpmnJs.mode = CONS_MODE;
window.bpmnJs = bpmnJs; // public on window for debug

$(document).on('load', root());

