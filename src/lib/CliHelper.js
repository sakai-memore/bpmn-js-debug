const aryCONS_TASK = [
  "bpmn:Activity",
  "bpmn:Task",
  "bpmn:ServiceTask",
  "bpmn:UserTask",
  "bpmn:ManualTask",
  "bpmn:SendTask",
  "bpmn:ReceiveTask",
  "bpmn:ScriptTask",
  "bpmn:BusinessRuleTask",
  "bpmn:SubProcess",
  "bpmn:AdHocSubProcess",
  "bpmn:Transaction",
  "bpmn:CallActivity",
]

const aryCONS_TASK_CATEGORY = [
  "Activity",
  "Task",
  "SubProcess",
  "Transaction",
]

class CliHelper {
  // private 
  _elReg ;
  
  /********
   * constractor */
  constructor(elementRegistry) {
    this._elReg = elementRegistry;
  }
  
  /********
   * 1. getElemetsIds(elm_category: string) : object[] */
  async getElemetsIds(elm_category) {
    let retAry = [];
    let aryTemp = [];
    let objTemp = {};
    let obj = {};
    const isAll = ! (aryCONS_TASK_CATEGORY.includes(elm_category))
    const elAll = this._elReg.getAll();
    // 
    aryTemp = elAll.map((el) =>{
      objTemp.id = el.id
      objTemp.type = el.type
      obj = objTemp
      objTemp = {}
      return obj
    })
    // console.log(aryTemp)
    if (isAll) {
      retAry = aryTemp
    } else {
      retAry = aryTemp.filter((obj) => {
        return aryCONS_TASK.includes(obj.type)
      })
    }
    return retAry;
  }
  
  /********
   * 2. getElementBProperties(id: string) : object */
  async getElementBProperties(id) {
    let retObj = {};
    const elm = this._elReg.get(id);
    retObj = this._convertElementTo(elm);
    return retObj
  }
  
  /********
   * private 
   *    convertElementTo(elm: object) : object */
  async _convertElementTo(elm) {
    let retObj = {};
    let docStr = await this.getElementBPropsDocumentation(elm.id);
    retObj = {
      'element_id': elm.id,
      'element_type': elm.type,
      'element_name': elm.businessObject.name,
      'introduction': docStr,
      'stake_holder_bpmn_id': elm.parent.businessObject.id,
      'stake_holder_bpmn_type': elm.parent.businessObject.$type,
      'stake_holder_bpmn_name': elm.parent.businessObject.name
    }
    return retObj
  }

  
  /********
   * 3. getElementsBProperties(elm_category: string) : object[] */
  async getElementsBProperties(elm_category) {
    let retAry = [];
    let tempAry = [];
    let obj = {};
    // console.log(elm_category)
    // 
    if (aryCONS_TASK_CATEGORY.includes(elm_category)) {
      tempAry = await this.getElemetsIds(elm_category);
      // 
      // If using async/await, can not use Array.map()
      for (let keyObj of tempAry) {
        obj = await this.getElementBProperties(keyObj.id)
        retAry.push(obj);
        obj = {};
      }
    }
    return retAry
  }
  
  /********
   * private
   * @getter
   *    getElementBPropsDocumentation(id: string) : string (json_str) */
  async getElementBPropsDocumentation(id) {
    let retStr = '';
    let tempNode = '';
    const elm = this._elReg.get(id);
    const docNodeAry = elm.businessObject.get('documentation');
    // 
    // Judge node type and assign it, docNodeAry has one text node
    docNodeAry.some((docNode) => {
      return ( (docNode.textFormat === 'text/plain') && (tempNode = docNode) )
    })
    if(!tempNode) {
      tempNode = elm.businessObject.$model.create('bpmn:Documentation', {
        textFormat: 'text/plain'
      })
      docNodeAry.push(tempNode)
    }
    retStr = docNodeAry[0]['text'] || "";
    return retStr
  }
  
  /********
   * 4. getElementBPropsExtensions(id: string) : string (json_str) */
  async getElementBPropsExtensions(id) {
    let retStr = await this.getElementBPropsDocumentation(id);
    return retStr
  }
  
  /********
   * private
   * @setter
   *    setElementBPropsDocumentation(id: string, jsonObj: object) : void */
  async setElementBPropsDocumentation(id, jsonObj) {
    let tempNode = '';
    const elm = this._elReg.get(id);
    const docNodeAry = elm.businessObject.get('documentation');
    docNodeAry.some((docNode) => {
      return ( (docNode.textFormat === 'text/plain') && (tempNode = docNode) )
    })
    if(!tempNode) {
      tempNode = elm.businessObject.$model.create('bpmn:Documentation', {
        textFormat: 'text/plain'
      })
      docNodeAry.push(tempNode)
    }
    docNodeAry[0]['text'] = JSON.stringify(jsonObj);
    return docNodeAry[0]['text']
  }
  
  /********
   * 5. setElementBPropsExtensions(id: string, jsonObj: object) : void */
  async setElementBPropsExtensions(id, jsonObj) {
    this.setElementBPropsDocumentation(id, jsonObj)
  }
  
  /********
   * 6. getElementBPropsExtensionsObject(id: string) : object */
  async getElementBPropsExtensionsObject(id) {
    let retObj = {};
    let jsonStr = await this.getElementBPropsExtensions(id);
    if(jsonStr == ""){
      retObj = {}
    } else {
      retObj = JSON.parse(jsonStr);
    }
    return retObj
  }
  
  /********
   * 7. getElementsBPropsExtensionsObject(elm_category: string) : object[] */
  async getElementsBPropsExtensionsObject(elm_category) {
    let retAry = [];
    let tempAry = [];
    let obj = {};
    // 
    if (aryCONS_TASK_CATEGORY.includes(elm_category)) {
      tempAry = await this.getElemetsIds(elm_category);
      console.log(tempAry)
      // 
      // If using async/await, can not use Array.map()
      for (let keyObj of tempAry) {
        // console.log(keyObj.id)
        obj = await this.getElementBPropsExtensionsObject(keyObj.id)
        console.log(obj);
        if (obj){
          retAry.push(obj);
        }
      }
    }
    // console.log(retAry)
    return retAry
  }
  
}


// // if use private fields, can not use this syntax!
// CliHelper.prototype.listBo = async () => {
//   const elmIds = await this._cli.elements();
//   let elm ;
//   let elmsObj = {};
//   for (let id of elmIds) {
//     elm = await this._cli.element(id);
//     elmsObj[id] = elm.businessObject;
//   }
//   return elmsObj
// }

export default CliHelper;
