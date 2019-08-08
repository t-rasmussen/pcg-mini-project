const path = require('path');

module.exports = {
  entry: {
     cppn_tutorial: './src/cppn-apps/cppn_tutorial.js',
     cppn_flowers: './src/cppn-apps/cppn_flowers.js',
     cppn_flowers2: './src/cppn-apps/cppn_flowers2.js',
     cppn_flowers3: './src/cppn-apps/cppn_flowers3.js',
     dungeon_partitioning: './src/dungeon_generator/partitioning.js',
     dungeon_cellular_automata: './src/dungeon_generator/cellular_automata.js'
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js'
  },
  mode: 'development'
};