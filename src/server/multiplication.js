const grpc = require('@grpc/grpc-js')
const protoLoader = require("@grpc/proto-loader")

const PROTO_PATH = __dirname + "/contracts/multiplication.proto"

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  defaults: true,
  oneofs: true
})

const protos = grpc.loadPackageDefinition(packageDefinition)

function multiplication(call, callback) {
  const { fNumber, sNumber } = call.request;
  callback(null, {
    result: fNumber * sNumber
  });
}

async function main() {
  const server = new grpc.Server();
  server.addService(protos.MultiplicationService.service, {
    multiplication
  });
  
  await server.bindAsync("0.0.0.0:3000",
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error(err)
      } else {
        server.start();
        console.log("Multiplication server is running");
      }
    });
}

main();