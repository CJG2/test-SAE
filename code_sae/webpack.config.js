const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack"); // Ajout de dotenv-webpack
const webpack = require("webpack"); // Import explicite de Webpack

module.exports = {
  entry: {
    app: "./src/scripts/app.js", // Point d'entrée principal (global)
    accueil: "./src/scripts/accueil/accueil.js", // Point d'entrée pour accueil.html
    connexion: [
      "./src/scripts/connexion/connexion.js",
      "./src/scripts/connexion/inscrire.js",
    ], // Point d'entrée pour connexion.html
    apprendre: "./src/scripts/apprendre/apprendre.js", // Point d'entrée pour apprendre.html
    profil: "./src/scripts/profil/profil.js", // Point d'entrée pour profil.html
    miniJeux: "./src/scripts/mini_jeux/miniJeux.js", // Point d'entrée pour miniJeux.html
    progression: "./src/scripts/progression/progression.js", // Point d'entrée pour progression.html
    feedback: "./src/scripts/feedback/feedback.js", // Point d'entrée pour feedback.html
  },
  output: {
    filename: "[name].bundle.js", // Génère des fichiers JS nommés d'après les points d'entrée
    path: path.resolve(__dirname, "dist"),
    clean: true, // Nettoie le dossier dist à chaque build
  },
  module: {
    rules: [
      {
        test: /\.css$/, // Gestion des fichiers CSS
        use: [
          MiniCssExtractPlugin.loader, // Extrait le CSS dans des fichiers séparés
          "css-loader", // Transforme le CSS en modules
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i, // Gestion des fichiers image
        type: "asset/resource",
        generator: {
          filename: "assets/images/[name][ext]", // Destination des fichiers images dans le dossier dist
        },
      },
      {
        test: /\.wasm$/,
        type: "asset/resource",
        generator: {
          filename: "assets/wasm/[name][ext]", // Définir où placer les fichiers WASM dans dist
        },
      },
      {
        test: /\.(mp3|wav)$/, // gestion des fichiers audio (type mp3)
        type: "asset/resource",
        generator: {
          filename: "assets/sons/[name][ext]", // Destination des fichiers audio
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css", // Génère des fichiers CSS spécifiques par page
    }),
    new HtmlWebpackPlugin({
      template: "./src/public/accueil.html", // Source HTML pour la page accueil
      filename: "accueil.html", // Destination de la page dans dist
      chunks: ["accueil", "app"], // Inclure uniquement les fichiers JS de 'accueil' et 'app'
      favicon: "./src/assets/icons/home.png",
    }),
    new HtmlWebpackPlugin({
      template: "./src/public/connexion.html", // Source HTML pour la page connexion
      filename: "connexion.html", // Destination de la page dans dist
      chunks: ["connexion", "app"], // Inclure uniquement les fichiers JS de 'connexion' et 'app'
      favicon: "./src/assets/icons/logo.png",
    }),
    new HtmlWebpackPlugin({
      template: "./src/public/apprendre.html", // Source HTML pour la page apprendre
      filename: "apprendre.html", // Destination de la page dans dist
      chunks: ["apprendre", "app"], // Inclure uniquement les fichiers JS de 'apprendre' et 'app'
      favicon: "./src/assets/icons/apprendre.png",
    }),
    new HtmlWebpackPlugin({
      template: "./src/public/profil.html", // Source HTML pour la page profil
      filename: "profil.html", // Destination de la page dans dist
      chunks: ["profil", "app"], // Inclure uniquement les fichiers JS de 'profil' et 'app'
      favicon: "./src/assets/icons/profil.png",
    }),
    new HtmlWebpackPlugin({
      template: "./src/public/progression.html", // Source HTML pour la page progression
      filename: "progression.html", // Destination de la page dans dist
      chunks: ["progression", "app"], // Inclure uniquement les fichiers JS de 'progression' et 'app'
      favicon: "./src/assets/icons/progression.png",
    }),
    new HtmlWebpackPlugin({
      template: "./src/public/miniJeux.html", // Source HTML pour la page miniJeux
      filename: "miniJeux.html", // Destination de la page dans dist
      chunks: ["miniJeux", "app"], // Inclure uniquement les fichiers JS de 'miniJeux' et 'app'
      favicon: "./src/assets/icons/miniJeux.png",
    }),
    new HtmlWebpackPlugin({
      template: "./src/public/feedback.html", // Source HTML pour la page feedback
      filename: "feedback.html", // Destination de la page dans dist
      chunks: ["feedback", "app"], // Inclure uniquement les fichiers JS de 'feedback' et 'app'
      favicon: "./src/assets/icons/feedback.png",
    }),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"], // Fournit 'Buffer' globalement
      process: "process/browser", // Fournit 'process' globalement
    }),
  ],
  devServer: {
    static: "./dist", // Sert les fichiers depuis le dossier dist
    open: true, // Ouvre automatiquement le navigateur à chaque compilation
    hot: true, // Active le rechargement à chaud
    historyApiFallback: {
      index: "/connexion.html", // Définit la page d'accueil pour l'application SPA
    },
  },
  mode: "development", // Mode développement pour des builds plus rapides et plus simples
  resolve: {
    fallback: {
      path: require.resolve("path-browserify"),
      os: require.resolve("os-browserify"),
      crypto: require.resolve("crypto-browserify"),
      timers: require.resolve("timers-browserify"),
      stream: require.resolve("stream-browserify"),
      zlib: require.resolve("browserify-zlib"),
      process: require.resolve("process/browser"),
      buffer: require.resolve("buffer/"),
      url: require.resolve("url/"),
      vm: require.resolve("vm-browserify"),
      util: require.resolve("util/"),
      assert: require.resolve("assert/"),
      fs: false, // Ajout pour ignorer 'fs' dans un environnement navigateur
      net: false, // Si vous n'avez pas besoin de 'net' côté navigateur
      tls: false, // Si vous n'avez pas besoin de 'tls' côté navigateur
    },
  },
};
