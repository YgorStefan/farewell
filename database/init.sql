-- database/init.sql
SET TIME ZONE 'America/Sao_Paulo';

CREATE TABLE IF NOT EXISTS pessoas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    data_nascimento DATE NOT NULL,
    data_falecimento DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS registros_obitos (
    id SERIAL PRIMARY KEY,
    pessoa_id INT NOT NULL UNIQUE,
    numero_registro VARCHAR(50) UNIQUE NOT NULL,
    faf VARCHAR(50),
    local_obito VARCHAR(255) NOT NULL,
    data_obito TIMESTAMPTZ NOT NULL,
    funeraria VARCHAR(150) NOT NULL,
    CONSTRAINT fk_pessoa FOREIGN KEY (pessoa_id) REFERENCES pessoas (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS velorios (
    id SERIAL PRIMARY KEY,
    registro_obito_id INT NOT NULL,
    local_velorio VARCHAR(100) NOT NULL,
    local_sepultamento VARCHAR(100) NOT NULL,
    sala_velorio VARCHAR(100),
    inicio_velorio TIMESTAMPTZ NOT NULL,
    fim_velorio TIMESTAMPTZ,
    inicio_sepultamento TIMESTAMPTZ,
    fim_sepultamento TIMESTAMPTZ,
    CONSTRAINT fk_registro_obito FOREIGN KEY (registro_obito_id) REFERENCES registros_obitos (id) ON DELETE CASCADE
);

-- Pessoas (20 registros variados)
INSERT INTO pessoas (nome, sobrenome, cpf, data_nascimento, data_falecimento) VALUES
('João', 'Silva', '123.456.789-01', '1950-03-15', '2026-06-10'),
('Maria', 'Santos', '234.567.890-12', '1945-07-22', '2026-06-09'),
('Alex', 'Pereira', '345.678.901-23', '1960-11-30', '2026-06-08'),
('Ana', 'Oliveira', '456.789.012-34', '1938-01-25', '2026-06-07'),
('Arthur', 'Morgan', '567.890.123-45', '1955-05-18', '2026-06-06'),
('Lucia', 'Rodrigues', '678.901.234-56', '1942-09-03', '2026-06-05'),
('José', 'Almeida', '789.012.345-67', '1970-12-12', '2026-06-04'),
('Antônia', 'Lima', '890.123.456-78', '1948-04-28', '2026-06-03'),
('Francisco', 'Gomes', '901.234.567-89', '1958-08-14', '2026-06-02'),
('Raimunda', 'Costa', '012.345.678-90', '1940-06-20', '2026-06-01'),
('Sebastião', 'Ribeiro', '111.222.333-44', '1965-02-10', '2026-05-31'),
('Terezinha', 'Carvalho', '222.333.444-55', '1952-10-05', '2026-05-30'),
('Manoel', 'Martins', '333.444.555-66', '1947-03-22', '2026-05-29'),
('Rita', 'Souza', '444.555.666-77', '1962-07-17', '2026-05-28'),
('Geraldo', 'Fernandes', '555.666.777-88', '1953-01-08', '2026-05-27'),
('Aparecida', 'Barbosa', '666.777.888-99', '1944-11-25', '2026-05-26'),
('Adão', 'Dias', '777.888.999-00', '1968-09-13', '2026-05-25'),
('Cremilda', 'Moreira', '888.999.000-11', '1957-05-30', '2026-05-24'),
('Valdir', 'Nunes', '999.000.111-22', '1949-12-01', '2026-05-23'),
('Sueli', 'Teixeira', '000.111.222-33', '1963-08-19', '2026-05-22');

-- Registros de Óbitos (20 registros)
INSERT INTO registros_obitos (pessoa_id, numero_registro, faf, local_obito, data_obito, funeraria) VALUES
(1, 'REG-2026-0001', 'FAF-001', 'Hospital São Lucas', '2026-06-10 08:30:00', 'Funerária Bom Pastor'),
(2, 'REG-2026-0002', 'FAF-002', 'Hospital Santa Casa', '2026-06-09 14:15:00', 'Funerária Paz Eterna'),
(3, 'REG-2026-0003', 'FAF-003', 'Quintal da Casa Branca', '2026-06-08 22:45:00', 'Funerária São José'),
(4, 'REG-2026-0004', 'FAF-004', 'Hospital Evangélico', '2026-06-07 06:00:00', 'Funerária Bom Pastor'),
(5, 'REG-2026-0005', 'FAF-005', 'Hospital do Trabalhador', '2026-06-06 18:20:00', 'Funerária Nossa Senhora'),
(6, 'REG-2026-0006', 'FAF-006', 'Hospital Santa Cruz', '2026-06-05 11:10:00', 'Funerária Paz Eterna'),
(7, 'REG-2026-0007', 'FAF-007', 'Residência', '2026-06-04 03:55:00', 'Funerária São Miguel'),
(8, 'REG-2026-0008', 'FAF-008', 'UPA Boa Vista', '2026-06-03 16:40:00', 'Funerária Bom Pastor'),
(9, 'REG-2026-0009', 'FAF-009', 'Hospital Erasto Gaertner', '2026-06-02 09:25:00', 'Funerária Nossa Senhora'),
(10, 'REG-2026-0010', 'FAF-010', 'Hospital Cajuru', '2026-06-01 20:15:00', 'Funerária São José'),
(11, 'REG-2026-0011', 'FAF-011', 'Residência', '2026-05-31 12:00:00', 'Funerária Paz Eterna'),
(12, 'REG-2026-0012', 'FAF-012', 'Hospital Santa Casa', '2026-05-30 07:50:00', 'Funerária Bom Pastor'),
(13, 'REG-2026-0013', 'FAF-013', 'Hospital São Lucas', '2026-05-29 23:30:00', 'Funerária São Miguel'),
(14, 'REG-2026-0014', 'FAF-014', 'Residência', '2026-05-28 15:10:00', 'Funerária Nossa Senhora'),
(15, 'REG-2026-0015', 'FAF-015', 'Hospital do Trabalhador', '2026-05-27 05:45:00', 'Funerária Bom Pastor'),
(16, 'REG-2026-0016', 'FAF-016', 'Hospital Evangélico', '2026-05-26 19:30:00', 'Funerária São José'),
(17, 'REG-2026-0017', 'FAF-017', 'Hospital Santa Cruz', '2026-05-25 13:15:00', 'Funerária Paz Eterna'),
(18, 'REG-2026-0018', 'FAF-018', 'Residência', '2026-05-24 04:00:00', 'Funerária São Miguel'),
(19, 'REG-2026-0019', 'FAF-019', 'UPA Boa Vista', '2026-05-23 21:45:00', 'Funerária Bom Pastor'),
(20, 'REG-2026-0020', 'FAF-020', 'Hospital Cajuru', '2026-05-22 17:30:00', 'Funerária Nossa Senhora');

-- Velórios (20 registros - 13 no Memorial Farewell, 7 em outros locais)

INSERT INTO velorios (registro_obito_id, local_velorio, local_sepultamento, sala_velorio, inicio_velorio, fim_velorio, inicio_sepultamento, fim_sepultamento) VALUES


(1, 'Memorial Farewell', 'Cemitério Municipal', 'Sala Lírio', 
    CURRENT_DATE - 1 + TIME '08:00',        -- ontem 08:00
    CURRENT_DATE + 1 + TIME '09:00',        -- amanhã 09:00
    CURRENT_DATE + 1 + TIME '10:00',        -- amanhã 10:00
    NULL),

(2, 'Memorial Farewell', 'Cemitério Parque Iguaçu', 'Sala Azaleia', 
    CURRENT_DATE - 1 + TIME '14:00',        -- ontem 14:00
    CURRENT_DATE + 2 + TIME '14:00',        -- depois de amanhã 14:00
    CURRENT_DATE + 2 + TIME '15:00', 
    NULL),

(3, 'Memorial Farewell', 'Cemitério Municipal', 'Sala Orquídea', 
    CURRENT_DATE + TIME '07:00',            -- hoje 07:00
    CURRENT_DATE + 1 + TIME '15:00',        -- amanhã 15:00
    CURRENT_DATE + 1 + TIME '16:00', 
    NULL),

(4, 'Memorial Farewell', 'Cemitério São Francisco', 'Sala Lírio', 
    CURRENT_DATE - 2 + TIME '20:00',        -- anteontem 20:00
    CURRENT_DATE + 3 + TIME '10:00',        -- daqui a 3 dias 10:00
    CURRENT_DATE + 3 + TIME '11:00', 
    NULL),

(5, 'Memorial Farewell', 'Crematório Vaticano', 'Sala Vitória-Régia', 
    CURRENT_DATE - 1 + TIME '10:00',        -- ontem 10:00
    CURRENT_DATE + 2 + TIME '08:00',        -- depois de amanhã 08:00
    CURRENT_DATE + 2 + TIME '09:00', 
    NULL),

(7, 'Memorial Farewell', 'Cemitério Municipal', 'Sala Margarida', 
    CURRENT_DATE + TIME '06:00',            -- hoje 06:00
    CURRENT_DATE + 1 + TIME '09:00',        -- amanhã 09:00
    CURRENT_DATE + 1 + TIME '10:00', 
    NULL),

(13, 'Memorial Farewell', 'Cemitério Municipal', 'Sala Vitória-Régia', 
    CURRENT_DATE + TIME '09:00',            -- hoje 09:00
    CURRENT_DATE + 1 + TIME '13:00',        -- amanhã 13:00
    CURRENT_DATE + 1 + TIME '14:00', 
    NULL),

(15, 'Memorial Farewell', 'Cemitério São Francisco', 'Sala Lírio', 
    CURRENT_DATE + TIME '10:00',            -- hoje 10:00
    CURRENT_DATE + 1 + TIME '07:00',        -- amanhã 07:00
    CURRENT_DATE + 1 + TIME '08:00', 
    NULL),

(19, 'Memorial Farewell', 'Cemitério Parque Iguaçu', 'Sala Vitória-Régia', 
    CURRENT_DATE + TIME '08:00',            -- hoje 08:00
    CURRENT_DATE + 1 + TIME '10:00',        -- amanhã 10:00
    CURRENT_DATE + 1 + TIME '11:00', 
    NULL),

(6, 'Capela Mortuária Santa Cruz', 'Cemitério Santa Cruz', 'Sala Principal', 
    CURRENT_DATE - 1 + TIME '09:00', 
    CURRENT_DATE + 1 + TIME '13:00', 
    CURRENT_DATE + 1 + TIME '14:00', 
    NULL),

(18, 'Funerária Bom Pastor', 'Cemitério Municipal', 'Sala Principal', 
    CURRENT_DATE - 1 + TIME '11:00', 
    CURRENT_DATE + 1 + TIME '15:00', 
    CURRENT_DATE + 1 + TIME '16:00', 
    NULL),

(8, 'Memorial Farewell', 'Cemitério Parque Iguaçu', 'Sala Lírio', 
    CURRENT_DATE - 5 + TIME '08:00', 
    CURRENT_DATE - 4 + TIME '08:30', 
    CURRENT_DATE - 4 + TIME '09:00', 
    CURRENT_DATE - 4 + TIME '09:30'),

(9, 'Capela Mortuária Municipal', 'Cemitério Municipal', 'Sala 1', 
    CURRENT_DATE - 5 + TIME '10:00', 
    CURRENT_DATE - 4 + TIME '09:30', 
    CURRENT_DATE - 4 + TIME '10:00', 
    CURRENT_DATE - 4 + TIME '10:30'),

(10, 'Memorial Farewell', 'Cemitério São Francisco', 'Sala Orquídea', 
    CURRENT_DATE - 6 + TIME '14:00', 
    CURRENT_DATE - 5 + TIME '14:30', 
    CURRENT_DATE - 5 + TIME '15:00', 
    CURRENT_DATE - 5 + TIME '15:30'),

(12, 'Memorial Farewell', 'Crematório Vaticano', 'Sala Azaleia', 
    CURRENT_DATE - 7 + TIME '07:00', 
    CURRENT_DATE - 6 + TIME '10:30', 
    CURRENT_DATE - 5 + TIME '11:00', 
    CURRENT_DATE - 5 + TIME '11:30'),

(16, 'Capela do Hospital', 'Cemitério Parque', 'Capela', 
    CURRENT_DATE - 8 + TIME '09:00', 
    CURRENT_DATE - 6 + TIME '09:30', 
    CURRENT_DATE - 6 + TIME '10:00', 
    CURRENT_DATE - 6 + TIME '10:30'),

(17, 'Memorial Farewell', 'Crematório Vaticano', 'Sala Orquídea', 
    CURRENT_DATE - 9 + TIME '14:00', 
    CURRENT_DATE - 7 + TIME '15:30', 
    CURRENT_DATE - 7 + TIME '16:00', 
    CURRENT_DATE - 7 + TIME '16:30'),

(20, 'Capela Mortuária do Portão', 'Cemitério Municipal', 'Sala 2', 
    CURRENT_DATE - 7 + TIME '12:00', 
    CURRENT_DATE - 5 + TIME '08:30', 
    CURRENT_DATE - 5 + TIME '09:00', 
    CURRENT_DATE - 5 + TIME '09:30'),

(11, 'Igreja Nossa Senhora', 'Cemitério Paroquial', 'Salão Paroquial', 
    CURRENT_DATE + 1 + TIME '16:00', 
    CURRENT_DATE + 2 + TIME '19:30', 
    CURRENT_DATE + 3 + TIME '08:00', 
    NULL),

(14, 'Memorial Farewell', 'Cemitério Parque Iguaçu', 'Sala Margarida', 
    CURRENT_DATE + 2 + TIME '14:00', 
    CURRENT_DATE + 3 + TIME '12:00', 
    CURRENT_DATE + 3 + TIME '13:00', 
    NULL);