module.exports = {
	entry: './app/index.js',
	output: {
		path: __dirname + '/dist',
		filename: 'index.js',
		publicPath: '/dist/'
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				loader: ['style-loader','css-loader']
			},
			{
				test: /\.(eot|woff|woff2|ttf|svg)$/,
				loader: 'url-loader'
			}
		]
	},
	devServer: {
		inline: true,
		stats: 'minimal',
		contentBase: 'app',
		historyApiFallback: true,
		host: '0.0.0.0',
		port: 8000,
		proxy: {
			'/api': {
				target: 'http://172.24.4.225:8090',
				secure: false,
				pathRewrite: {'^/api' : ''}
			}
		}
	}
}