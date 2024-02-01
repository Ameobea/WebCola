const fs = require('fs');
const path = require('path');
const { createHash } = require('crypto');

const { getHelpersModule, HELPERS_ID } = require('./helper');

module.exports = function wasm(options = {}) {
  const { sync = [], maxFileSize = 14 * 1024, publicPath = '' } = options;

  const syncFiles = sync.map((x) => path.resolve(x));
  const copies = Object.create(null);

  return {
    name: 'wasm',

    resolveId(id) {
      if (id === HELPERS_ID) {
        return id;
      }

      return null;
    },

    load(id) {
      if (id === HELPERS_ID) {
        return getHelpersModule(options.disableNodeSupport);
      }

      if (!/\.wasm$/.test(id)) {
        return null;
      }

      return Promise.all([fs.promises.stat(id), fs.promises.readFile(id)]).then(
        ([stats, buffer]) => {
          if ((maxFileSize && stats.size > maxFileSize) || maxFileSize === 0) {
            console.log('... writing file');
            const hash = createHash('sha1').update(buffer).digest('hex').substr(0, 16);

            const filename = `${hash}.wasm`;
            const publicFilepath = `${publicPath}${filename}`;

            // only copy if the file is not marked `sync`, `sync` files are always inlined
            if (syncFiles.indexOf(id) === -1) {
              copies[id] = {
                filename,
                publicFilepath,
                buffer
              };
            }
          }

          return buffer.toString('binary');
        }
      );
    },

    async transform(code, id) {
      if (code && /\.wasm$/.test(id)) {
        const isSync = syncFiles.indexOf(id) !== -1;
        const publicFilepath = copies[id] ? `'${copies[id].publicFilepath}'` : null;
        let src;

        if (publicFilepath === null) {
          src = new Promise((resolve, reject) => {
            fs.readFile(id, (error, buffer) => {
              if (error != null) {
                reject(error);
              }
              resolve(`'${buffer.toString('base64')}'`);
            });
          });
        } else {
          if (isSync) {
            this.error('non-inlined files can not be `sync`.');
          }
          src = null;
        }

        return {
          map: {
            mappings: ''
          },
          code: `import { _loadWasmModule } from ${JSON.stringify(HELPERS_ID)};
export default function(imports){return _loadWasmModule(${+isSync}, ${publicFilepath}, ${await src}, imports)}`
        };
      }
      return null;
    },
    generateBundle: async function write() {
      await Promise.all(
        Object.keys(copies).map(async (name) => {
          const copy = copies[name];

          this.emitFile({
            type: 'asset',
            source: copy.buffer,
            name: 'Rollup WASM Asset',
            fileName: copy.filename
          });
        })
      );
    }
  };
}

