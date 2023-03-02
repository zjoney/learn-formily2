import Ajv from 'ajv'
const ajv = new Ajv()
const schema = {
  type: 'object',
  properties: {
    foo: { type: 'integer' }, // 数字
    bar: { type: 'string' },
  },
  required: ['foo'], // 必填字段
  additionalProperties: false, // 是否允许额外属性
}
const validate = ajv.compile(schema)
const data = {
  foo: 1,
  bar: 'abc',
  age: 3
}
const data2 = {
  foo: '1',
  bar: 'abc',
}
const valid = validate(data)
if (!valid) {
  console.log(validate.errors)
  /** 检测到多了属性age
  [{…}]
0:
instancePath: ""
keyword: "additionalProperties"
message: "must NOT have additional properties"
params: {additionalProperty: "age"}
schemaPath: "#/additionalProperties"
__proto__: Object
length: 1
__proto__: Array(0)
  */
}
const valid2 = validate(data2)
if (!valid2) {
  console.log(validate.errors)
  /** 检测到foo必须是一个数字
   * [{…}]
0:
instancePath: "/foo"
keyword: "type"
message: "must be integer"
params: {type: "integer"}
schemaPath: "#/properties/foo/type"
__proto__: Object
length: 1
__proto__: Array
   */
}
