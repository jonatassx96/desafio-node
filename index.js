// Configurando API
const express = require("express");
const uuid = require("uuid");

const port = 3001;
const app = express();
app.use(express.json());
const clientsOrders = [];
//Middlewares
const printMetodERequest = (request, response, next) => {
  const requestMetod = request.method;
  const url = request.host + request.route.path;
  console.log(`Uma nova rota foi solicitada.`);
  console.log(`Metodo da requisição: ${requestMetod}`);
  console.log(`URL: ${url}`);

  next();
};

const checkOrderId = (request, response, next) => {
  const { id } = request.params;
  const index = clientsOrders.findIndex((clientOrder) => clientOrder.id === id);
  if (index < 0) {
    return response.status(404).json({ message: "User not found" });
  }
  request.orderIndex = index;
  request.orderId = id;

  next();
};

// ROTAS
app.post("/order", printMetodERequest, (request, response) => {
  const { order, clienteName, price } = request.body;
  const clientOrder = {
    id: uuid.v4(),
    order,
    clienteName,
    price,
    status: "Em preparação",
  };
  clientsOrders.push(clientOrder);
  return response.status(201).json(clientOrder);
});

app.get("/order", printMetodERequest, (request, response) => {
  return response.json(clientsOrders);
});

app.put("/order/:id", printMetodERequest, checkOrderId, (request, response) => {
  const index = request.orderIndex;
  const { order, clienteName, price } = request.body;
  const id = request.orderId;
  const updateClientOrder = { id, order, clienteName, price, status: "Em preparação" };
  clientsOrders[index] = updateClientOrder;
  return response.json(updateClientOrder);
});

app.delete(
  "/order/:id",
  printMetodERequest,
  checkOrderId,
  (request, response) => {
    const index = request.orderIndex;
    clientsOrders.splice(index, 1);
    return response.status(204).json();
  }
);

app.get("/order/:id", printMetodERequest, checkOrderId, (request, response) => {
  const index = request.orderIndex;
  return response.json(clientsOrders[index]);
});

app.patch("/order/:id", printMetodERequest, checkOrderId, (request, response) => {
    const index = request.orderIndex;
  const { order, clienteName, price } = request.body;
  const id = request.orderId;
  const updateClientOrder = { id, order, clienteName, price, status: "Pronto" };
  clientsOrders[index] = updateClientOrder;
  return response.json(updateClientOrder);
});

// Mensagem de start no console >>
app.listen(port, () => {
  console.log(`Server started on port ${port}.`);
});
