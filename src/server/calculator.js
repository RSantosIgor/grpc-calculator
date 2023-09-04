const grpc = require('@grpc/grpc-js')
const protoLoader = require("@grpc/proto-loader")

const PROTO_PATH = __dirname + "/contracts/calculator.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  defaults: true,
  oneofs: true
});

const protos = grpc.loadPackageDefinition(packageDefinition);

function protoFactory(operation) {
    const PROTO_PATH_OPERATION = __dirname + `/contracts/${operation}.proto`;
    const packDefinition = protoLoader.loadSync(PROTO_PATH_OPERATION, {
    keepCase: true,
    defaults: true,
    oneofs: true
    });
    return grpc.loadPackageDefinition(packDefinition);
}

function addition(call, callback) {
    const { fNumber, sNumber } = call.request;
    const protos_op = protoFactory('addition');
    const client = new protos_op.AdditionService(
        "localhost:1000",
        grpc.credentials.createInsecure()
    );
    client.addition({fNumber, sNumber}, (error, response) => {
        console.log("ResultAddition:", response);
        callback(null, {
            result: response.result
        });
    });
}

function subtraction(call, callback) {
    const { fNumber, sNumber } = call.request;
    const protos_op = protoFactory('subtraction');
    const client = new protos_op.SubtractionService(
        "localhost:2000",
        grpc.credentials.createInsecure()
    );
    client.subtraction({fNumber, sNumber}, (error, response) => {
        console.log("ResultSubtraction:", response);
        callback(null, {
            result: response.result
        });
    });
}

function multiplication(call, callback) {
    const { fNumber, sNumber } = call.request;
    const protos_op = protoFactory('multiplication');
    const client = new protos_op.MultiplicationService(
        "localhost:3000",
        grpc.credentials.createInsecure()
    );
    client.multiplication({fNumber, sNumber}, (error, response) => {
        console.log("ResultMultiplication:", response);
        callback(null, {
            result: response.result
        });
    });
}

function division(call, callback) {
    const { fNumber, sNumber } = call.request;
    const protos_op = protoFactory('division');
    const client = new protos_op.DivisionService(
        "localhost:5000",
        grpc.credentials.createInsecure()
    );
    client.division({fNumber, sNumber}, (error, response) => {
        console.log("ResultDivisionService", response);
        callback(null, {
            result: response.result
        });
    });
  }

async function main() {
  const server = new grpc.Server();
  server.addService(protos.CalculatorService.service, {
    addition,
    subtraction,
    multiplication,
    division
  });

  await server.bindAsync("0.0.0.0:4000",
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error(err)
      } else {
        server.start();
        console.log("Server is running");
      }
    });
}

main();