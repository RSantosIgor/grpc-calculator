const grpc = require('@grpc/grpc-js')
const protoLoader = require("@grpc/proto-loader")

const PROTO_PATH = __dirname + "/contracts/subtraction.proto"

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  defaults: true,
  oneofs: true
})

const protos = grpc.loadPackageDefinition(packageDefinition)

function subtraction(call, callback) {
  const { fNumber, sNumber } = call.request;
  callback(null, {
    result: fNumber - sNumber
  });
}

async function main() {
  const server = new grpc.Server();
  server.addService(protos.SubtractionService.service, {
    subtraction
  });
  
  await server.bindAsync("0.0.0.0:2000",
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error(err)
      } else {
        server.start();
        console.log("Subtraction server is running");
      }
    });
}

main();