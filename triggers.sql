DELIMITER //

CREATE TRIGGER insertaParametros
AFTER INSERT ON pertenecegrupo
FOR EACH ROW
BEGIN
    DECLARE v_idPrueba INT;

    -- Get the idPrueba for the group
    SELECT tp.idPrueba INTO v_idPrueba
    FROM pertenecegrupo pg
    JOIN tienePruebas tp ON tp.idGrupo = pg.idGrupo
    WHERE tp.idGrupo = NEW.idGrupo
    LIMIT 1;

    -- If idPrueba = 1, then insert into parametros16PF
    IF v_idPrueba = 2 THEN
        INSERT INTO parametros16PF (idUsuario, idGrupo)
        VALUES (NEW.idUsuario, NEW.idGrupo);
    END IF;
END;
//
DELIMITER ;

DELIMITER $$

CREATE TRIGGER actualizar_parametros_16pf
AFTER INSERT ON responde16PF
FOR EACH ROW
BEGIN
    DECLARE letra VARCHAR(5);
    DECLARE valor INT(5);

    SELECT p.letraAporte, o.valor16PF
    INTO letra, valor
    FROM preguntas16pf p
    JOIN opciones16pf o ON o.idPregunta16PF = p.idPregunta16PF
    WHERE o.idOpcion16PF = NEW.idOpcion16PF;

        IF letra = 'A' THEN
            UPDATE parametros16PF SET A = A + valor WHERE idUsuario = NEW.idUsuario;
        ELSEIF letra = 'B' THEN
            UPDATE parametros16PF SET B = B + valor WHERE idUsuario = NEW.idUsuario;
        ELSEIF letra = 'C' THEN
            UPDATE parametros16PF SET C = C + valor WHERE idUsuario = NEW.idUsuario;
        ELSEIF letra = 'E' THEN
            UPDATE parametros16PF SET E = E + valor WHERE idUsuario = NEW.idUsuario;
        ELSEIF letra = 'F' THEN
            UPDATE parametros16PF SET F = F + valor WHERE idUsuario = NEW.idUsuario;
        ELSEIF letra = 'G' THEN
            UPDATE parametros16PF SET G = G + valor WHERE idUsuario = NEW.idUsuario;
        ELSEIF letra = 'H' THEN
            UPDATE parametros16PF SET H = H + valor WHERE idUsuario = NEW.idUsuario;
        ELSEIF letra = 'I' THEN
            UPDATE parametros16PF SET I = I + valor WHERE idUsuario = NEW.idUsuario;
        ELSEIF letra = 'L' THEN
            UPDATE parametros16PF SET L = L + valor WHERE idUsuario = NEW.idUsuario;
        ELSEIF letra = 'M' THEN
            UPDATE parametros16PF SET M = M + valor WHERE idUsuario = NEW.idUsuario;
        ELSEIF letra = 'N' THEN
            UPDATE parametros16PF SET N = N + valor WHERE idUsuario = NEW.idUsuario;
        ELSEIF letra = 'O' THEN
            UPDATE parametros16PF SET O = O + valor WHERE idUsuario = NEW.idUsuario;
        ELSEIF letra = 'Q1' THEN
            UPDATE parametros16PF SET Q1 = Q1 + valor WHERE idUsuario = NEW.idUsuario;
        ELSEIF letra = 'Q2' THEN
            UPDATE parametros16PF SET Q2 = Q2 + valor WHERE idUsuario = NEW.idUsuario;
        ELSEIF letra = 'Q3' THEN
            UPDATE parametros16PF SET Q3 = Q3 + valor WHERE idUsuario = NEW.idUsuario;
        ELSEIF letra = 'Q4' THEN
            UPDATE parametros16PF SET Q4 = Q4 + valor WHERE idUsuario = NEW.idUsuario;
        ELSEIF letra = 'IM' THEN
            UPDATE parametros16PF SET IM = IM + valor WHERE idUsuario = NEW.idUsuario;
        END IF;
END$$

DELIMITER ;
