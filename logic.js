let products = [
    {
      id: 1,
      name: "sofa",
      description: "a sofa",
      price: 1200,
      quantity: 3,
      category: "furniture",
    },
    {
      id: 2,
      name: "cheeseburger",
      description: "a snack",
      price: 300,
      quantity: 40,
      category: "food",
    },
    {
      id: 3,
      name: "hamburger",
      description: "a snack",
      price: 40,
      quantity: Infinity,
      category: "food",
    },
  ];
  
  // get all products
  server.get("/api/products", function (req, resp) {
    const nameQuery = req.query.name;
    if (nameQuery) {
      const matchingProducts = products.filter(function (product) {
        return product.name.includes(nameQuery);
      });
      resp.status(200).json(matchingProducts);
    } else {
      resp.status(200).json(products);
    }
  });
  
  // create a product
  server.post("/api/products", async function (req, resp) {
    const body = req.body;
    if (body.name === undefined || body.description === undefined) {
      resp.status(400).send("Bad Request");
    } else {
      body.id = products.length + 1;
      products.push(body);
      resp.status(201).send(body);
    }
  });
  
  // get a product by id
  server.get("/api/product/:id", function (req, resp) {
    const id = Number(req.params.id);
    console.log(id);
    if (!isNaN(id)) {
      const foundProduct = products.find(function (product) {
        return product.id === id;
      });
      if (foundProduct) {
        resp.status(200).json(foundProduct); // ok found
      } else {
        resp.status(404).send("Not Found"); // not found
      }
    } else {
      resp.status(400).send("Bad Request"); // bad request
    }
  });
  
  // delete a product by id
  server.delete("/api/products/:id", function (req, resp) {
    const id = Number(req.params.id);
    if (!isNaN(id)) {
      const foundProduct = products.find(function (product) {
        return product.id === id;
      });
      if (foundProduct) {
        products = products.filter(function (product) {
          return product.id !== id;
        });
        resp.status(200).json(foundProduct);
      } else {
        resp.status(404).send("Not Found");
      }
    } else {
      resp.status(400).send("Bad Request");
    }
  });