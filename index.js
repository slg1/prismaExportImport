const { exec } = require('child_process');
const { GraphQLClient } = require('graphql-request');


const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InNlcnZpY2UiOiJtdWx0aXBsUGF0aFJlc0BkZXYiLCJyb2xlcyI6WyJhZG1pbiJdfSwiaWF0IjoxNTUyOTE4OTQ2LCJleHAiOjE1NTM1MjM3NDZ9.uK9d9CTiSOBAE-K-W_LYrm0OggPmO1zlXnV2Om28sdE"


const client = new GraphQLClient('http://localhost:4466/exportImport/dev', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})


var isDebugMode = false;

console.debug = function (args) {
  if (isDebugMode) {
    console.log(args);
  }
}

async function createCode(code) {
  console.log('createCode for code:',code);
  return await client.request(`mutation {
    createCode (
      data: {
        code: "${code}"
      }) 
    {
      id, code
    }
  }`);
}

async function createObj(name, id) {
 console.log(`createObj name:${name} linked to code:${id}`);
 return await client.request(`mutation {
  createObj (
      data: {
        codeLink: {connect: {id: "${id}"}}
      }) 
    {
      id, codeLink {id, code}
    }
  }`);
}

// Export OK if 
// const NB_CODES= 100;
// const NB_OBJECTS < 750;
const NB_CODES= 100;
const NB_OBJECTS= 1000;
const NB_OBJECTS_CODE_PACKET= 10;

async function main() {
  let promises = [];
  let result = {};
  for (i = 0; i < NB_CODES; i++) {
    promises.push(await createCode(`code${i}`));
  }
  try {
    await Promise.all(promises);
  } catch (err) {
    ctx.logger.error('createCode failure:', JSON.stringify(err));
  }
  result.codes = JSON.stringify(promises, null, 2);
  
  let promises2 = [];
  for (i = 0; i < NB_OBJECTS; i++) {
    for (j = 0; j < NB_OBJECTS_CODE_PACKET; j++) {
      promises2.push(await createObj(`obj${i}_${j}`, promises[i%NB_CODES].createCode.id));
    }
  }
  try {
    await Promise.all(promises2);
  } catch (err) {
    ctx.logger.error('createObj failure:', JSON.stringify(err));
  }
  result.objects = JSON.stringify(promises2, null, 2);
  console.log(JSON.stringify(result, null, 2));
}

main();
