const express = require("express");
const cors = require("cors");
const db = require("./pool");

const app = express();
app.use(cors());
app.use(express.json());

app.listen(8000, () => {
  console.log("Server started");
});

//TODO retornar os códigos de status http

//get all workers
app.get("/workers/list", (request, response) => {
  try {
    db.query("select * from funcionario", function (err, results, fields) {
      if (err instanceof Error) {
        console.log("[ERROR QUERY]" + err);
        response.send(err);
        return;
      }
      // console.log("[RESULTS QUERY]" + results);
      // console.log("[RESULTS FIELDS]" + fields);
      response.send(results);
    });
  } catch (error) {
    console.log("ERROR: " + error);
  }
});

app.get("/workers/profissions", (request, response) => {
  try {
    db.query("select * from profissao", function (err, results, fields) {
      if (err instanceof Error) {
        console.log("[ERROR QUERY]" + err);
        response.send(err);
        return;
      }
      // console.log("[RESULTS QUERY]" + results);
      // console.log("[RESULTS FIELDS]" + fields);
      console.log("Result: " + results);
      response.send(results);
    });
  } catch (error) {
    console.log("ERROR: " + error);
  }
});

//get specific worker
app.get("/workers/specific", (request, response) => {
  console.log("Specific: ", request.params);
  try {
    db.query(
      `SELECT * FROM funcionario WHERE cpf=?`,
      [request.params.id],
      function (err, results, fields) {
        if (err instanceof Error) {
          console.log("[ERROR QUERY]" + err);
          response.send(err);
          return;
        }
        console.log("[RESULTS QUERY]" + results[0]);
        response.send(results);
      }
    );
  } catch (error) {
    console.log("ERROR: " + error);
  }
});

//edit worker info
app.post("/workers/register", (request, response) => {
  try {
    db.query(
      `
        INSERT INTO funcionario (nome, idade, cpf, telefone, profissao_id)
        VALUES (?, ?, ?, ?, ?);
      `,
      [
        request.body.nome,
        request.body.idade,
        request.body.cpf,
        request.body.telefone,
        request.body.profissao,
      ],
      function (err, results) {
        if (err) {
          console.log("[ERROR QUERY - INSERT FUNCIONÁRIO] " + err);
          response.send(err);
          return;
        } else {
          db.query(
            `INSERT INTO endereco (rua, numero, bairro, cidade, estado, funcionario_cpf) 
             VALUES (?, ?, ?, ?, ?, ?);`,
            [
              request.body.rua,
              request.body.numero,
              request.body.bairro,
              request.body.cidade,
              request.body.estado,
              request.body.cpf,
            ],
            function (err, results) {
              if (err) {
                console.log("[ERROR QUERY - INSERT ENDEREÇO] " + err);
                response.send(err);
                return;
              }

              response.send("Funcionário e endereço registrados com sucesso");
            }
          );
        }
      }
    );
  } catch (error) {
    console.log("ERROR: " + error);
    response.status(500).send("Ocorreu um erro no registro do funcionário.");
  }
});

app.put("/workers/edit", (request, response) => {
  try {
    db.query(
      `
        UPDATE funcionario 
        SET nome = ?, idade = ?, cpf = ?, telefone = ?, profissao_id = ?
        WHERE cpf = ?;
      `,
      [
        request.body.nome,
        request.body.idade,
        request.body.cpf,
        request.body.telefone,
        request.body.profissao,
        request.body.cpf,
      ],
      function (err, results) {
        if (err) {
          console.log("[ERROR QUERY - UPDATE FUNCIONÁRIO] " + err);
          response.send(err);
          return;
        } else {
          db.query(
            `
              UPDATE endereco 
              SET rua = ?, numero = ?, bairro = ?, cidade = ?, estado = ?
              WHERE funcionario_cpf = ?;
            `,
            [
              request.body.rua,
              request.body.numero,
              request.body.bairro,
              request.body.cidade,
              request.body.estado,
              request.body.cpf,
            ],
            function (err, results) {
              if (err) {
                console.log("[ERROR QUERY - UPDATE ENDEREÇO] " + err);
                response.send(err);
                return;
              }

              response.send("Funcionário e endereço atualizados com sucesso");
            }
          );
        }
      }
    );
  } catch (error) {
    console.log("ERROR: " + error);
    response.status(500).send("Ocorreu um erro ao atualizar o funcionário.");
  }
});

app.delete("/workers/delete", function (request, response) {
  console.log("Delete Body:" + request.body.cpf);
  try {
    db.query(
      `DELETE FROM funcionario
      WHERE cpf=?;`,
      [request.body.cpf],
      function (err, results, fields) {
        if (err instanceof Error) {
          console.log("[ERROR QUERY]" + err);
          response.send(err);
          return;
        }
        console.log("Result: " + results);
        response.send(results);
      }
    );
  } catch (error) {
    console.log("ERROR: " + error);
  }
});
