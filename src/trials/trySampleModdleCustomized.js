import { Moddle } from "moddle";

import { Reader, Writer } from "moddle-xml";

const metaModel = {
  name: "Example",
  uri: "http://example.com/example",
  prefix: "ex",
  xml: {
    tagAlias: "lowerCase"
  },
  types: [
    {
      name: "Root",
      properties: [
        { name: "a", type: "CustomType", xml: { serialize: "xsi:type" } },
        { name: "b", type: "CustomType", xml: { serialize: "xsi:type" } }
      ]
    },
    {
      name: "CustomType"
    }
  ]
};

const moddle = new Moddle([metaModel]);

const root = moddle.create("ex:Root");
const a = moddle.create("ex:CustomType");
a.$parent = root;
const b = moddle.create("ex:CustomType");
b.$parent = root;
root.set("a", a);
root.set("b", b);

console.log(root);

const writer = new Writer();

const xml = writer.toXML(root);
console.log(xml);

const reader = new Reader(moddle);
const rootHandler = reader.handler("ex:Root");

reader.fromXML(xml, rootHandler).then((res) => {
  console.log(res);
  const xml2 = writer.toXML(res.rootElement);
  if (xml !== xml2) console.error("xml import/export does not match");
});

