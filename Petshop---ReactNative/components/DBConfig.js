export const DBConfig = {
  name: 'AlunoDB',
  version: 1,
  objectStoresMeta: [
    {
      store: 'AlunoST',
      storeConfig: { autoIncrement: true },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: true } },
        { name: 'nome', keypath: 'nome', options: { unique: true } },
        { name: 'idade', keypath: 'idade', options: { unique: false } },
        { name: 'cidade', keypath: 'cidade', options: { unique: false } }
      ]
    }
  ]
};