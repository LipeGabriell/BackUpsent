CREATE DATABASE IF NOT EXISTS `backend-upsent`;
USE `backend-upsent`;


CREATE TABLE IF NOT EXISTS profissao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL
);


INSERT INTO profissao (nome) VALUES ("Designer");
INSERT INTO profissao (nome) VALUES ("Programmer");
INSERT INTO profissao (nome) VALUES ("Marketing");


CREATE TABLE IF NOT EXISTS funcionario (
    nome VARCHAR(100) NOT NULL,
    idade INT(3) NOT NULL,
    cpf VARCHAR(14) PRIMARY KEY,
    telefone VARCHAR(15) NOT NULL,
    profissao_id INT,
    FOREIGN KEY (profissao_id) REFERENCES profissao(id)
);


CREATE TABLE IF NOT EXISTS endereco (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rua VARCHAR(255) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    funcionario_cpf VARCHAR(14) NOT NULL,
    FOREIGN KEY (funcionario_cpf) REFERENCES funcionario(cpf) ON DELETE CASCADE
);
