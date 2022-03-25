import BpmnModeler from "bpmn-js/lib/Modeler";
import propertiesPanelModule from "bpmn-js-properties-panel";
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";

import CliModule from "bpmn-js-cli";

import camundaModdleExtensionModule from "camunda-bpmn-moddle/lib";
import customDescriptor from "./descripter/camundaDescriptor.json";

export class CustomBpmnModelerFactory {}

export class CustomBpmnModeler extends BpmnModeler {}

// CustomBpmnModeler.prototype._modules = [
//   ...BpmnModeler.prototype._modules,
//   propertiesPanelModule,
//   propertiesProviderModule, 
//   CliModule
// ];

CustomBpmnModelerFactory.prototype.get_instance = (divIdContainer, divIdParentPropertiesPanel) => {
  // new Bpmn Modeler
  const bpmnModeler = new CustomBpmnModeler({
    container: divIdContainer,
    propertiesPanel: {
      parent: divIdParentPropertiesPanel
    },
    additionalModules: [
      propertiesPanelModule,
      propertiesProviderModule, 
      camundaModdleExtensionModule,
      CliModule
    ],
    moddleExtensions: {
      camunda: customDescriptor
    },
    keyboard: {
      bindTo: document
    },
    cli: {
      bindTo: 'cli'
    }
  });
  return bpmnModeler
}

