const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = __dirname + "/../server/contracts/calculator.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  defaults: true,
  oneofs: true,
});

const protos = grpc.loadPackageDefinition(packageDefinition);

function main() {
  const client = new protos.CalculatorService(
    "localhost:4000",
    grpc.credentials.createInsecure()
  );
    const fNumber = 10;
    const sNumber = 5; 

    client.addition({fNumber, sNumber}, (error, response) => {
        console.log("Result addition:", response);
    });
    client.subtraction({fNumber, sNumber}, (error, response) => {
        console.log("Result subtraction:", response);
    });
    client.multiplication({fNumber, sNumber}, (error, response) => {
        console.log("Result multiplication:", response);
    });
    client.division({fNumber, sNumber}, (error, response) => {
        console.log("Result division:", response);
    });
}

main();