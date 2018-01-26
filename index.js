import fs from 'fs';
import json2csv from 'json2csv';

Array.prototype.tap = function tap(lambda) {
  lambda(this);
  return this;
};

const content = fs.readFileSync('board.json');
const board = JSON.parse(content);

const idIteracionPendiente = '5a006c11dbbd5fae82939ae2';
const idIteracionEnProgreso = '5a006c17fde552fbe5279bef';
const idIteracion6 = '5a55092b8176f22e19a62364';
const idMVP = '5a1c490a8665be18754683b6';
const idPLugin = '597cbecff4fe5f1d91d4b614';

function estaEnListaQueQueremos(card) {
  return [idIteracionPendiente, idIteracionEnProgreso, idIteracion6, idMVP].includes(card.idList);
}

function estaViva(card) {
  return card.closed === false;
}

function convertirACard(card) {
  const pluginData = card.pluginData[0];
  let estimado = undefined;
  if (pluginData !== undefined) {
    estimado = parseInt(JSON.parse(pluginData.value).estimate);
  }
  return {
    id: card.idShort,
    titulo: card.name,
    descripcion: card.desc,
    estimado: estimado,
    iteracion: card.idList
  };
}

const tarjetasPendientes = board
  .cards
  .filter(estaEnListaQueQueremos)
  .tap(lista => console.info(`filtrando ${lista.length} cards`))
  .filter(estaViva)
  .tap(lista => console.info(`filtrando ${lista.length} cards`))
  .map(convertirACard);

const columnas = ['id', 'iteracion', 'estimado', 'titulo', 'descripcion'];
const csv = json2csv({ data: tarjetasPendientes, fields: columnas });

fs.writeFile('estimaciones.csv', csv, function (err) {
  if (err) throw err;
  console.log('file saved');
});